<script setup lang="ts">
import TableComponent from '@/components/TableComponent.vue'
import SubscribersRepository from '@/repositories/SubscribersRepository'
import router from '@/router'
import type { Subscriber } from '@/types/Subscriber'
import type { Column, DataItem } from '@/types/Table'
import { onMounted, ref } from 'vue'

const columns: Column[] = [
  {
    label: 'Nombre del suscriptor',
    key: 'name',
  },
  {
    label: 'Negocio',
    key: 'businessName',
  },
  {
    label: 'Correo electrónico',
    key: 'email',
  },
  {
    label: 'Fecha de suscripción',
    key: 'createdAt',
  },
]

const data = ref<Subscriber[]>([])

function viewDetail(item: DataItem) {
  const itemId = item.id ?? null
  if (itemId && typeof itemId === 'string') router.push(`/suscriptores/${itemId}`)
}

onMounted(async () => {
  const subscribers = await SubscribersRepository.get()
  if (subscribers) data.value = subscribers
})
</script>

<template>
  <h3 class="text-2xl text-center mt-12">Lista de suscriptores</h3>
  <div class="px-8 mt-6">
    <TableComponent
      :columns
      :data
      :rows-per-page="10"
      @row-click="viewDetail"
      :buttons="[
        {
          label: 'Agregar suscriptor',
          action: () => router.push('/suscriptores/nuevo'),
        },
      ]"
    />
  </div>
</template>
