<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Email } from '@/types/Email'
import router from '@/router'
import { weekDays, type WeekDay } from '@/types/Time'

type NewEmail = Omit<Email, 'id'>

const form = ref<Omit<NewEmail, 'createdAt'>>({
  title: '',
  subject: '',
  body: '',
  filesIds: [],
  mode: 'unique',
  days: null,
  sendingDay: null,
  sendingHour: '08:00',
  addresseeMode: 'all',
  addresseeEmails: null,
  addresseePercent: null,
})

const filesInput = ref('')
const emailsInput = ref('')
const sendingDayString = computed({
  get: () => (form.value.sendingDay ? form.value.sendingDay.toISOString().split('T')[0] : ''),
  set: (val) => {
    form.value.sendingDay = val ? new Date(val) : null
  },
})

// Sync helpers
watch(filesInput, (val) => {
  form.value.filesIds = val
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

function handleSubmit() {
  const newEmail: NewEmail = {
    ...form.value,
    createdAt: new Date(),
  }
  console.log('Email creado:', newEmail)
}
</script>

<template>
  <h3 class="mt-5 ml-5 font-medium text-2xl">Crear Email Programado</h3>
  <form @submit.prevent="handleSubmit" class="p-4 max-w-3xl">
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
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-2/3"
          placeholder="file_001, file_002"
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
            {{ day }}
          </label>
        </div>
      </div>

      <!-- Fecha de envío (solo si unique) -->
      <div v-if="form.mode === 'unique'">
        <label class="block" for="sendingDay">Fecha de envío</label>
        <input
          id="sendingDay"
          v-model="sendingDayString"
          type="date"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
        />
      </div>

      <!-- Hora de envío -->
      <div>
        <label class="block" for="sendingHour">Hora de envío (HH:mm)</label>
        <input
          id="sendingHour"
          v-model="form.sendingHour"
          type="time"
          class="px-3 py-1 bg-white rounded-sm border border-gray-700 w-full"
          required
        />
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
          <option value="percent">Porcentaje</option>
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
