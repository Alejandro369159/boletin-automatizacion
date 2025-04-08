import { logger } from 'firebase-functions'
import { onCall } from 'firebase-functions/v2/https'
import { defineString } from 'firebase-functions/params'

const Mailjet = require('node-mailjet')

const mailJetApiKey = defineString('MAILJET_API_KEY')
const mailJetApiSecret = defineString('MAILJET_API_SECRET')

export const sendEmail = onCall({}, async ({ data }) => {
  const mailjet = Mailjet.apiConnect(mailJetApiKey.value(), mailJetApiSecret.value())

  try {
    const res = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: { Email: 'sergio.rodriguezrm@uanl.edu.mx', Name: data.fromName },
          To: [{ Email: data.toEmail, Name: data.toName }],
          Subject: data.Subject,
          TextPart: data.textBody,
          HTMLPart: data.htmlBody,
        },
      ],
    })
    logger.log(res)
    return res
  } catch (e) {
    logger.error(e)
    return e
  }
})
