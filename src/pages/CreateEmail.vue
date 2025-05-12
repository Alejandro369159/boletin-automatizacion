<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { NewEmail } from '@/types/Email'
import router from '@/router'
import { weekDays, type WeekDay } from '@/types/Time'
import { storage } from '@/services/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { EmailsRepository } from '@/repositories/EmailsRepository'
import { weekDaysTranslations } from '@/helpers/localTranslations'

const emailsRepository = new EmailsRepository()

function getDateFromHours(hours: number, minutes: number) {
  const date = new Date(1970, 0, 1)
  date.setHours(hours, minutes, 0, 0)
  return date
}

const form = ref<
  Omit<NewEmail, 'createdAt'> & {
    sendAtHourString: string
  }
>({
  title: '',
  subject: '',
  body: '',
  filesUrls: [],
  mode: 'unique',
  days: null,
  sendAtDate: null,
  sendAtHour: getDateFromHours(8, 0),
  sendAtHourString: '08:00',
  addresseeMode: 'all',
  addresseeEmails: null,
  addresseePercent: null,
})

const selectedFiles = ref<FileList | null>(null)

const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

const filesInput = ref('')
const emailsInput = ref('')
const sendAtDateString = computed({
  get: () => (form.value.sendAtDate ? form.value.sendAtDate.toISOString().split('T')[0] : ''),
  set: (val) => {
    form.value.sendAtDate = val ? new Date(val) : null
  },
})

watch(filesInput, (val) => {
  form.value.filesUrls = val
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)
})
watch(emailsInput, (val) => {
  form.value.addresseeEmails = val
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
})

function setSelectedFiles(e: Event) {
  selectedFiles.value = (e.target as HTMLInputElement).files
}

function toggleDay(day: WeekDay) {
  if (form.value.mode !== 'some-days') return
  if (form.value.days === null) form.value.days = []

  if (form.value.days!.includes(day)) {
    form.value.days = form.value.days.filter((_day) => _day !== day)
  } else {
    form.value.days.push(day)
  }
  console.log(form.value.days)
}

async function handleFilesUpload() {
  if (!selectedFiles.value) return

  const uploadedFileURLs: string[] = []

  for (let i = 0; i < selectedFiles.value.length; i++) {
    const file = selectedFiles.value[i]
    const fileRef = storageRef(storage, `emails/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(fileRef, file)
    const url = await getDownloadURL(snapshot.ref)
    uploadedFileURLs.push(url)
  }

  form.value.filesUrls = uploadedFileURLs
}

async function handleSubmit() {
  try {
    isLoading.value = true
    await handleFilesUpload()
    const newEmail: NewEmail = {
      ...form.value,
      sendAtDate: form.value.mode === 'unique' ? new Date(sendAtDateString.value) : null,
      sendAtHour: getDateFromHours(
        +form.value.sendAtHourString.split(':')[0],
        +form.value.sendAtHourString.split(':')[1],
      ),
      days: form.value.mode === 'unique' ? null : form.value.days,
      addresseeEmails:
        form.value.addresseeMode !== 'some'
          ? null
          : typeof form.value.addresseeEmails === 'string'
            ? form.value.addresseeEmails.split(',')
            : form.value.addresseeEmails,
      addresseePercent: form.value.addresseeMode !== 'percent' ? null : form.value.addresseePercent,
      createdAt: new Date(),
    }
    await emailsRepository.create(newEmail)
    isLoading.value = false
    router.push('/correos')
  } catch (e) {
    const error = e as Error
    errorMessage.value = error.message
    isLoading.value = false
  }
}

// watch the hour is a o'clock
function watchHour() {
  console.log('watchHour', form.value.sendAtHourString)
  const [hours, minutes] = form.value.sendAtHourString.split(':').map(Number)
  if (minutes !== 0) {
    form.value.sendAtHourString = `${hours}:00`.padStart(5, '0')
    form.value.sendAtHour = getDateFromHours(hours, 0)
  }
}
</script>

<template>
  <h2 class="mt-5 ml-5 font-medium text-2xl">Crear Email Programado</h2>
  <div
    v-if="errorMessage"
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    role="alert"
  >
    <strong class="font-bold">Error!</strong>
    <span class="block sm:inline">{{ errorMessage }}</span>
  </div>
  <div v-else-if="isLoading" class="text-xl">Loading...</div>
  <form v-else @submit.prevent="handleSubmit" class="p-4 max-w-3xl">
    <div class="grid grid-cols-2 gap-4">
      <!-- Título -->
      <div class="col-span-2">
        <label class="block" for="title">Título</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="px-3 py-1 w-full bg-white rounded-sm border border-gray-700"
          required
        />
      </div>

      <!-- Asunto -->
      <div class="col-span-2">
        <label class="block" for="subject">Asunto</label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          class="px-3 py-1 w-full bg-white rounded-sm border border-gray-700"
          required
        />
      </div>

      <!-- Cuerpo -->
      <div class="col-span-2">
        <label class="block" for="body">Cuerpo</label>
        <textarea
          id="body"
          v-model="form.body"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
          rows="4"
          required
        ></textarea>
      </div>

      <!-- Archivos -->
      <div class="col-span-2">
        <label class="block" for="files">Archivos por anexar</label>
        <input
          id="files"
          type="file"
          multiple
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-2/3"
          @change="(e) => setSelectedFiles(e)"
        />
      </div>

      <!-- Modo -->
      <div>
        <label class="block" for="mode">Modo de envío</label>
        <select
          id="mode"
          v-model="form.mode"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
          required
        >
          <option value="unique">Único</option>
          <option value="some-days">Algunos días</option>
          <option value="daily">Diario</option>
        </select>
      </div>

      <!-- Días (solo si some-days o daily) -->
      <div v-if="form.mode === 'some-days'">
        <label>Días</label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="day in weekDays"
            :key="day"
            :for="`days-${day}-input`"
            class="flex items-center gap-1"
          >
            <input
              type="checkbox"
              @change="toggleDay(day)"
              :value="day"
              :id="`days-${day}-input`"
            />
            {{ weekDaysTranslations[day] }}
          </label>
        </div>
      </div>

      <!-- Fecha de envío (solo si unique) -->
      <div v-if="form.mode === 'unique'">
        <label class="block" for="sendAtDate">Fecha de envío</label>
        <input
          id="sendAtDate"
          v-model="sendAtDateString"
          type="date"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
        />
      </div>

      <!-- Hora de envío -->
      <div>
        <label class="block" for="sendAtHourString">Hora de envío (HH:mm)</label>
        <input
          id="sendAtHourString"
          v-model="form.sendAtHourString"
          type="time"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
          required
          @input="watchHour"
        />
        <div class="text-sm text-gray-500">
          (La hora se redondeará a la hora más cercana, por ejemplo: 08:30 se convertirá a 08:00)
        </div>
      </div>

      <!-- Destinatarios -->
      <div>
        <label class="block" for="addresseeMode">Modo de destinatarios</label>
        <select
          id="addresseeMode"
          v-model="form.addresseeMode"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
          required
        >
          <option value="all">Todos</option>
          <option value="some">Algunos</option>
        </select>
      </div>

      <!-- Emails (solo si 'some') -->
      <div v-if="form.addresseeMode === 'some'">
        <label class="block" for="emails">Emails (separados por coma)</label>
        <textarea
          id="body"
          v-model="emailsInput"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
          rows="4"
          required
        ></textarea>
      </div>

      <!-- Porcentaje (solo si 'percent') -->
      <div v-if="form.addresseeMode === 'percent'">
        <label for="percent">Porcentaje de destinatarios</label>
        <input
          id="percent"
          v-model.number="form.addresseePercent"
          type="number"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
          min="1"
          max="100"
        />
      </div>
    </div>
    <!-- Botón -->
    <div class="space-x-3">
      <button
        type="submit"
        class="bg-green-600 px-4 py-1 text-white font-medium mt-4 cursor-pointer"
      >
        Crear correo
      </button>
      <button
        @click="router.back()"
        type="button"
        class="bg-gray-300 px-4 py-1 font-medium mt-4 cursor-pointer"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>
