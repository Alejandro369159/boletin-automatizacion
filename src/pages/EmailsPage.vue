<script setup lang="ts">
import TableComponent from '@/components/TableComponent.vue'
import router from '@/router'
import type { Column, DataItem } from '@/types/Table'

const columns: Column[] = [
  {
    label: 'Nombre del correo',
    key: 'name',
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

const data = [
  { id: '1', name: 'Alpha', mode: 'pending', createdAt: '2024-05-13T01:04:23.029919' },
  { id: '2', name: 'Beta', mode: 'archived', createdAt: '2025-01-09T01:04:23.029938' },
  { id: '3', name: 'Gamma', mode: 'inactive', createdAt: '2025-03-26T01:04:23.029944' },
  { id: '4', name: 'Delta', mode: 'pending', createdAt: '2024-12-28T01:04:23.029949' },
  { id: '5', name: 'Epsilon', mode: 'pending', createdAt: '2024-04-26T01:04:23.029955' },
  { id: '6', name: 'Zeta', mode: 'archived', createdAt: '2025-03-15T01:04:23.029961' },
  { id: '7', name: 'Eta', mode: 'archived', createdAt: '2024-07-07T01:04:23.029969' },
  { id: '8', name: 'Theta', mode: 'archived', createdAt: '2025-03-13T01:04:23.029980' },
  { id: '9', name: 'Iota', mode: 'inactive', createdAt: '2025-03-08T01:04:23.029996' },
  { id: '10', name: 'Kappa', mode: 'active', createdAt: '2025-03-26T01:04:23.030001' },
  { id: '11', name: 'Lambda', mode: 'inactive', createdAt: '2024-11-15T01:04:23.030005' },
  { id: '12', name: 'Mu', mode: 'active', createdAt: '2024-11-17T01:04:23.030009' },
  { id: '13', name: 'Nu', mode: 'pending', createdAt: '2025-02-12T01:04:23.030013' },
  { id: '14', name: 'Xi', mode: 'archived', createdAt: '2025-01-24T01:04:23.030017' },
  { id: '15', name: 'Omicron', mode: 'pending', createdAt: '2024-07-04T01:04:23.030020' },
  { id: '16', name: 'Pi', mode: 'archived', createdAt: '2024-07-29T01:04:23.030024' },
  { id: '17', name: 'Rho', mode: 'archived', createdAt: '2025-02-21T01:04:23.030027' },
  { id: '18', name: 'Sigma', mode: 'inactive', createdAt: '2024-07-28T01:04:23.030031' },
  { id: '19', name: 'Tau', mode: 'archived', createdAt: '2024-10-16T01:04:23.030035' },
  { id: '20', name: 'Upsilon', mode: 'inactive', createdAt: '2024-07-31T01:04:23.030039' },
]

function viewDetail(item: DataItem) {
  const itemId = item.id ?? null
  if (itemId && typeof itemId === 'string') router.push(`/correos/${itemId}`)
}
</script>

<template>
  <h3 class="text-2xl text-center mt-12">Lista de correos programados</h3>
  <div class="px-8 mt-6">
    <TableComponent :columns :data :rows-per-page="10" @row-click="viewDetail" />
  </div>
</template>
