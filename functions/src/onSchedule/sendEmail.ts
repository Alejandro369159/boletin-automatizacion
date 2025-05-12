import { logger } from 'firebase-functions'
import { defineString } from 'firebase-functions/params'
import { firestore } from 'firebase-admin'
import { onSchedule } from 'firebase-functions/scheduler'
import { getApp, initializeApp } from 'firebase-admin/app'
import Mailjet, { Client } from 'node-mailjet'

// --- Firebase Initialization ---
export function initFirebaseApp() {
  try {
    getApp()
  } catch {
    initializeApp()
  }
}

// --- Configuration ---
const mailJetApiKey = defineString('MAILJET_API_KEY')
const mailJetApiSecret = defineString('MAILJET_SECRET_KEY')
// Consider making the 'From' email configurable as well
const FROM_EMAIL = 'sergio.rodriguezrm@uanl.edu.mx'
const FROM_NAME = 'Boletín de Automatización'

// --- Types ---
type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

const weekDayToNumber: Record<WeekDay, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

type Email = {
  documentId: string
  addresseeEmails: string[] | null // Used when addresseeMode is 'some'
  addresseeMode: 'all' | 'some'
  body: string
  createdAt: firestore.Timestamp
  days: WeekDay[] | null // Used when mode is 'some-days'
  filesUrls: string[] | null
  mode: 'unique' | 'some-days' | 'daily'
  sendAtDate: firestore.Timestamp // Used when mode is 'unique'
  sendAtHour: firestore.Timestamp // Used for all modes to determine the hour
  subject: string
  title: string
}

type Subscriber = {
  // Assuming documentId is the key in Firestore, but not explicitly stored in the doc
  // documentId: string;
  bussinessName: string
  email: string
  name: string
  status: string // e.g., 'active', 'inactive'
  createdAt: firestore.Timestamp
}

type EmailRegistry = {
  sentAt: firestore.Timestamp
  status: 'success' | 'failed'
  error?: string
}

// --- Helper Functions ---

/**
 * Checks if two Date objects fall on the same calendar date (year, month, day).
 */
function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Determines if an email should be sent based on its schedule and the current time.
 */
function shouldSendEmail(email: Email, lastSentAt: Date | null, now: Date): boolean {
  const sendHour = email.sendAtHour.toDate().getHours() // Get hour directly
  const nowHour = now.getHours()

  // Check if already sent today (for recurring emails)
  if (lastSentAt && isSameDate(lastSentAt, now)) {
    logger.debug(`Email ${email.documentId} already processed today.`)
    return false
  }

  // Check if the current hour matches the target send hour
  if (sendHour !== nowHour) {
    // logger.debug(`Skipping email ${email.documentId}: Hour mismatch (${nowHour} vs ${sendHour})`);
    return false // Log only if needed, can be verbose
  }

  // Check based on email mode
  switch (email.mode) {
    case 'unique': {
      const targetDate = email.sendAtDate.toDate()
      // Check if the date matches today AND it hasn't been sent before (lastSentAt check)
      const shouldSend = isSameDate(targetDate, now) && !lastSentAt
      // logger.debug(`Email ${email.documentId} (unique): Date match=${isSameDate(targetDate, now)}, LastSent=${lastSentAt}, ShouldSend=${shouldSend}`);
      return shouldSend
    }
    case 'some-days': {
      const validDays = email.days?.map((d) => weekDayToNumber[d]) ?? []
      const nowDayOfWeek = now.getDay()
      const shouldSend = validDays.includes(nowDayOfWeek)
      // logger.debug(`Email ${email.documentId} (some-days): ValidDays=${validDays}, Today=${nowDayOfWeek}, ShouldSend=${shouldSend}`);
      return shouldSend // Already checked for hour match and same-day send
    }
    case 'daily': {
      // logger.debug(`Email ${email.documentId} (daily): ShouldSend=true`);
      return true // Already checked for hour match and same-day send
    }
    default:
      // Log error for unexpected mode, using type assertion for clarity
      logger.error(`Invalid email mode: ${(email as any).mode} for email ${email.documentId}`)
      return false
  }
}

/**
 * Fetches emails and active subscribers from Firestore.
 */
async function fetchData(
  db: firestore.Firestore,
): Promise<{ emails: Email[]; subscribers: Subscriber[] }> {
  logger.info('Fetching emails and active subscribers...')
  const [emailsSnap, subscribersSnap] = await Promise.all([
    db.collection('emails').get(),
    db.collection('subscribers').get(),
  ])

  const emails = emailsSnap.docs.map((doc) => ({ ...doc.data(), documentId: doc.id })) as Email[]
  const subscribers = subscribersSnap.docs.map((doc) => doc.data()) as Subscriber[]

  logger.info(`Fetched ${emails.length} emails and ${subscribers.length} active subscribers.`)
  return { emails, subscribers }
}

/**
 * Filters the list of all subscribers to get the target recipients for a specific email.
 */
function getTargetSubscribers(email: Email, allSubscribers: Subscriber[]): Subscriber[] {
  if (email.addresseeMode === 'some') {
    if (!email.addresseeEmails || email.addresseeEmails.length === 0) {
      logger.warn(
        `Email ${email.documentId} has addresseeMode 'some' but no addresseeEmails defined. No recipients targeted.`,
      )
      return [] // No specific subscribers listed
    }
    // Create a Set for efficient lookup
    const targetEmails = new Set(email.addresseeEmails)
    const filteredSubscribers = allSubscribers.filter((sub) => targetEmails.has(sub.email))
    logger.info(
      `Email ${email.documentId} targeting ${filteredSubscribers.length} specific subscribers.`,
    )
    return filteredSubscribers
  }
  // Default is 'all' active subscribers
  logger.info(
    `Email ${email.documentId} targeting all ${allSubscribers.length} active subscribers.`,
  )
  return allSubscribers
}

/**
 * Sends the email to the specified recipients using Mailjet batch API.
 */
async function sendBatchEmail(
  email: Email,
  recipients: { Email: string; Name: string }[],
  mailjet: Client,
): Promise<void> {
  // Return void, errors are thrown
  if (recipients.length === 0) {
    logger.info(`No recipients for email ${email.documentId}, skipping Mailjet send.`)
    return // Don't call Mailjet if there's no one to send to
  }

  logger.info(
    `Preparing to send email ${email.documentId} to ${recipients.length} recipients via Mailjet.`,
  )

  // Construct the HTML content with optional file URLs
  const filesHtml =
    email.filesUrls && email.filesUrls.length > 0
      ? `<br/><p>Archivos adjuntos:</p>${email.filesUrls
          .map((url) => `<a href="${url}">${url}</a>`) // Consider displaying a filename instead of the full URL if available
          .join('<br/>')}`
      : ''
  const htmlPart = `${email.body}${filesHtml}`

  // Prepare the Mailjet API request payload
  const messageData = {
    From: { Email: FROM_EMAIL, Name: FROM_NAME },
    To: recipients,
    Subject: email.subject,
    HTMLPart: htmlPart,
    // TextPart: Optional plain text version
    // Attachments: Optional actual file attachments (check Mailjet limits)
  }

  try {
    const response = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [messageData],
    })
    // Mailjet API v3.1 returns status information within the response body
    // You might want to inspect response.body.Messages[0].Status more closely
    logger.info(`Mailjet send request successful for email ${email.documentId}.`, {
      responseStatus: response.response.status,
      responseBody: response.body,
    })
    // Add more detailed logging based on response.body if needed
  } catch (error: any) {
    // Log the detailed Mailjet error
    logger.error(`Mailjet API error sending email ${email.documentId}:`, {
      statusCode: error.statusCode,
      message: error.message,
      errorInfo: error.response?.data, // Include detailed error info if available
    })
    // Re-throw the error to be caught by the main processing loop
    throw new Error(`Mailjet API failed for email ${email.documentId}: ${error.message}`)
  }
}

/**
 * Records the outcome (success or failure) of sending an email in its Firestore registry subcollection.
 */
async function recordEmailOutcome(
  emailId: string,
  status: 'success' | 'failed',
  db: firestore.Firestore,
  error?: Error,
): Promise<void> {
  const registryData: EmailRegistry = {
    sentAt: firestore.Timestamp.now(),
    status: status,
  }
  if (error && status === 'failed') {
    registryData.error = error.message // Store error message on failure
  }

  try {
    await db.collection(`emails/${emailId}/registry`).add(registryData)
    logger.info(`Recorded ${status} status for email ${emailId} in registry.`)
  } catch (dbError) {
    logger.error(`Failed to record ${status} status for email ${emailId} in registry:`, dbError)
    // Decide if this error should also be thrown or just logged
  }
}

/**
 * Fetches the timestamp of the last successful send recorded in the registry.
 */
async function getLastSentTimestamp(
  emailId: string,
  db: firestore.Firestore,
): Promise<Date | null> {
  const registrySnap = await db
    .collection(`emails/${emailId}/registry`)
    // Optional: Filter by status if you only care about last *successful* send
    // .where('status', '==', 'success')
    .orderBy('sentAt', 'desc')
    .limit(1)
    .get()

  if (registrySnap.empty) {
    logger.debug(`No registry entries found for email ${emailId}.`)
    return null
  }

  const lastRegistry = registrySnap.docs[0].data() as EmailRegistry
  const lastSentAt = lastRegistry.sentAt?.toDate() ?? null // Safely access and convert timestamp
  logger.debug(
    `Last registry entry for email ${emailId} found at ${lastSentAt?.toISOString() ?? 'N/A'}.`,
  )
  return lastSentAt
}

// --- Main Scheduled Function ---
export const scheduledSendEmail = onSchedule('0 * * * *', async (event) => {
  initFirebaseApp() // Ensure Firebase is initialized
  logger.info(`Scheduled email function triggered at ${event.scheduleTime}.`) // Log trigger time

  const mailjet = Mailjet.apiConnect(mailJetApiKey.value(), mailJetApiSecret.value())
  const db = firestore()
  const now = new Date() // Use a single timestamp for consistency in checks

  try {
    // 1. Fetch data
    const { emails, subscribers: allActiveSubscribers } = await fetchData(db)

    if (allActiveSubscribers.length === 0) {
      logger.info('No active subscribers found. Exiting function.')
      return // Exit early if no one to send to
    }
    if (emails.length === 0) {
      logger.info('No emails found to process. Exiting function.')
      return // Exit early if no emails configured
    }

    // 2. Process each email
    let emailsSentCount = 0
    let emailsSkippedCount = 0
    let emailsFailedCount = 0

    for (const email of emails) {
      logger.debug(`Processing email: ${email.title} (ID: ${email.documentId})`)
      try {
        // a. Get last sent time for this email
        const lastSentAt = await getLastSentTimestamp(email.documentId, db)

        // b. Check if email should be sent now
        if (!shouldSendEmail(email, lastSentAt, now)) {
          // logger.debug(`Skipping email ${email.documentId} based on schedule or last sent time.`);
          emailsSkippedCount++
          continue // Skip to the next email
        }

        logger.info(`Email ${email.documentId} is due to be sent.`)

        // c. Determine target recipients
        const targetSubscribers = getTargetSubscribers(email, allActiveSubscribers)

        if (targetSubscribers.length === 0) {
          logger.warn(
            `No target subscribers determined for email ${email.documentId}. Skipping send.`,
          )
          emailsSkippedCount++
          // Optionally record this skip in the registry if needed
          // await recordEmailOutcome(email.documentId, 'skipped_no_recipients', db);
          continue
        }

        // d. Format recipients for Mailjet
        const recipients = targetSubscribers.map((sub) => ({ Email: sub.email, Name: sub.name }))

        // e. Send email via Mailjet
        await sendBatchEmail(email, recipients, mailjet)

        // f. Record success in Firestore registry
        await recordEmailOutcome(email.documentId, 'success', db)
        emailsSentCount++
      } catch (error: any) {
        // Handle errors during processing of a single email (e.g., Mailjet failure)
        logger.error(`Failed to process email ${email.documentId}:`, error)
        emailsFailedCount++
        // g. Record failure in Firestore registry
        // Pass the caught error object to record the message
        await recordEmailOutcome(
          email.documentId,
          'failed',
          db,
          error instanceof Error ? error : new Error(String(error)),
        )
        // Continue to the next email
      }
    } // End of email processing loop

    logger.info(
      `Scheduled email processing finished. Sent: ${emailsSentCount}, Skipped: ${emailsSkippedCount}, Failed: ${emailsFailedCount}.`,
    )
  } catch (error) {
    // Handle fatal errors (e.g., failure fetching initial data)
    logger.error('Fatal error during scheduled email execution:', error)
    // Depending on the error, you might want to implement retries or alerts
  }
})
