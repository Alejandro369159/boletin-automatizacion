<script setup lang="ts">
import TableComponent from '@/components/TableComponent.vue'
import router from '@/router'
import type { Column, DataItem } from '@/types/Table'
import suscribers from '@/assets/suscribers.js'

const columns: Column[] = [
  {
    label: 'Nombre del suscriptor',
    key: 'name',
  },
  {
    label: 'Estado',
    key: 'status',
  },
  {
    label: 'Fecha de suscripción',
    key: 'subscribedAt',
  },
]

const data = suscribers

function viewDetail(item: DataItem) {
  const itemId = item.id ?? null
  if (itemId && typeof itemId === 'string') router.push(`/suscriptores/${itemId}`)
}
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
