<script setup lang="ts">
import TableComponent from '@/components/TableComponent.vue'
import { emailModeTranslation } from '@/helpers/localTranslations'
import { EmailsRepository } from '@/repositories/EmailsRepository'
import router from '@/router'
import type { Email } from '@/types/Email'
import type { Column, DataItem } from '@/types/Table'
import { onMounted, ref } from 'vue'

const emailsRepository = new EmailsRepository()

const columns: Column[] = [
  {
    label: 'Nombre del correo',
    key: 'title',
  },
  {
    label: 'Modo de programación',
    key: 'mode',
  },
  {
    label: 'Fecha de creación',
    key: 'createdAt',
  },
]

const tableEmails = ref<
  Array<Omit<Email, 'createdAt' | 'mode'> & { createdAt: string; mode: string }>
>([])

const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

function viewDetail(item: DataItem) {
  const itemId = item.id ?? null
  if (itemId && typeof itemId === 'string') router.push(`/correos/${itemId}`)
}

onMounted(async () => {
  try {
    isLoading.value = true
    const emails = await emailsRepository.list()
    tableEmails.value = emails.map((email) => ({
      ...email,
      mode: emailModeTranslation[email.mode],
      createdAt: email.createdAt.toLocaleDateString(),
    }))
    isLoading.value = false
  } catch (e) {
    console.log('error')
    isLoading.value = false
    const error = e as Error
    errorMessage.value = error.message
  }
})
</script>

<template>
  <h3 class="text-2xl text-center mt-12">Lista de correos programados</h3>
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
  <div v-else class="px-8 mt-6">
    <TableComponent
      :columns
      :data="tableEmails"
      :rows-per-page="10"
      @row-click="viewDetail"
      :buttons="[
        {
          label: 'Agregar correo',
          action: () => router.push('/correos/nuevo'),
        },
      ]"
    />
  </div>
</template>
