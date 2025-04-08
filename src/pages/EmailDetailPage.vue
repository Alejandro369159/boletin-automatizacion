<script setup lang="ts">
import {
  addresseeModeTranslation,
  emailModeTranslation,
  weekDaysTranslations,
} from '@/helpers/localTranslations'
import { EmailsRepository } from '@/repositories/EmailsRepository'
import router from '@/router'
import type { Email } from '@/types/Email'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const emailsRepository = new EmailsRepository()
const route = useRoute()

const emailId = route.params.id as string
const email = ref<Email | null>(null)

const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    email.value = await emailsRepository.get(emailId)
    console.table(email.value)
    isLoading.value = false
  } catch (e) {
    isLoading.value = false
    const error = e as Error
    errorMessage.value = error.message
  }
})
</script>

<template>
  <h2 class="mt-5 ml-5 font-medium text-2xl">Detalle de correo programado</h2>
  <div class="text-center mt-3" v-if="isLoading" role="alert">
    <p><strong>Cargando...</strong></p>
  </div>
  <div
    v-else-if="errorMessage"
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    role="alert"
  >
    <strong class="font-bold">Error!</strong>
    <span class="block sm:inline">{{ errorMessage }}</span>
  </div>
  <article v-else-if="email" class="px-5 mt-5">
    <div>
      <p><strong>Título: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">{{ email.title }}</p>
    </div>
    <hr class="mt-3 mb-3 border border-gray-300" />
    <p class="text-xl font-medium bg-blue-100 py-1 px-2">Configuración</p>
    <div>
      <p><strong>Modo de programación: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">
        {{ emailModeTranslation[email.mode] }}
      </p>
    </div>
    <div v-if="email.mode === 'some-days'">
      <p><strong>Días en los que se envía: </strong></p>
      <ul class="bg-gray-100 p-2 max-w-sm border border-gray-300 max-h-72 overflow-auto">
        <li v-for="day in email.days" :key="day">- {{ weekDaysTranslations[day] }}</li>
      </ul>
    </div>
    <div v-if="email.mode === 'unique'">
      <p><strong>Día programado para el envío: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">
        {{ email.sendingDay!.toLocaleString() }}
      </p>
    </div>
    <div>
      <p><strong>Hora programada para el envío: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">
        {{ email.sendingHour }}
      </p>
    </div>
    <div>
      <p><strong>Modo de población a la que se envía: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">
        {{ addresseeModeTranslation[email.addresseeMode] }}
      </p>
    </div>
    <div v-if="email.addresseeMode === 'some'">
      <p><strong>Correos a los que se envía: </strong></p>
      <ul class="bg-gray-100 p-2 max-w-sm border border-gray-300 max-h-72 overflow-auto">
        <li v-for="userEmail in email.addresseeEmails" :key="userEmail">- {{ userEmail }}</li>
      </ul>
    </div>
    <div v-if="email.addresseeMode === 'percent'">
      <p><strong>Porcentaje de población que recibirá el correo de manera aleatoria: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">
        {{ email.addresseePercent }}
      </p>
    </div>
    <hr class="mt-3 mb-3 border border-gray-300" />
    <p class="text-xl font-medium bg-blue-100 py-1 px-2">Contenido del correo</p>
    <div>
      <p><strong>Asunto: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">
        {{ email.subject }}
      </p>
    </div>
    <div>
      <p><strong>Cuerpo: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">{{ email.body }}</p>
    </div>
    <div>
      <p><strong>Archivos: </strong></p>
      <ul
        v-if="email.filesUrls.length"
        class="bg-gray-100 p-2 max-w-sm border border-gray-300 max-h-72 overflow-auto"
      >
        <li v-for="(file, index) in email.filesUrls" :key="file">
          <a :href="file" class="text-blue-600 hover:underline"> - Archivo {{ index + 1 }}</a>
        </li>
      </ul>
      <p v-else class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">
        Sin archivos adjuntos
      </p>
    </div>
    <div>
      <p><strong>Fecha de creación del correo programado: </strong></p>
      <p class="bg-gray-100 p-2 w-full max-w-sm border border-gray-300">
        {{ email.createdAt.toLocaleString() }}
      </p>
    </div>
  </article>
  <button
    @click="router.back()"
    type="button"
    class="bg-gray-200 border border-gray-400 ml-5 px-4 py-1 font-medium mt-4 cursor-pointer"
  >
    Atrás
  </button>
</template>
