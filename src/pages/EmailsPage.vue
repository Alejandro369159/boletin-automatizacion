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
  { id: '1', name: 'Alpha', mode: 'diario', createdAt: '13/05/2024' },
  { id: '2', name: 'Beta', mode: 'ciertos días de la semana', createdAt: '09/01/2025' },
  { id: '3', name: 'Gamma', mode: 'unico', createdAt: '26/03/2025' },
  { id: '4', name: 'Delta', mode: 'secuencia', createdAt: '28/12/2024' },
  { id: '5', name: 'Epsilon', mode: 'diario', createdAt: '26/04/2024' },
  { id: '6', name: 'Zeta', mode: 'ciertos días de la semana', createdAt: '15/03/2025' },
  { id: '7', name: 'Eta', mode: 'unico', createdAt: '07/07/2024' },
  { id: '8', name: 'Theta', mode: 'secuencia', createdAt: '13/03/2025' },
  { id: '9', name: 'Iota', mode: 'diario', createdAt: '08/03/2025' },
  { id: '10', name: 'Kappa', mode: 'ciertos días de la semana', createdAt: '26/03/2025' },
  { id: '11', name: 'Lambda', mode: 'unico', createdAt: '15/11/2024' },
  { id: '12', name: 'Mu', mode: 'secuencia', createdAt: '17/11/2024' },
  { id: '13', name: 'Nu', mode: 'diario', createdAt: '12/02/2025' },
  { id: '14', name: 'Xi', mode: 'ciertos días de la semana', createdAt: '24/01/2025' },
  { id: '15', name: 'Omicron', mode: 'unico', createdAt: '04/07/2024' },
  { id: '16', name: 'Pi', mode: 'secuencia', createdAt: '29/07/2024' },
  { id: '17', name: 'Rho', mode: 'diario', createdAt: '21/02/2025' },
  { id: '18', name: 'Sigma', mode: 'ciertos días de la semana', createdAt: '28/07/2024' },
  { id: '19', name: 'Tau', mode: 'unico', createdAt: '16/10/2024' },
  { id: '20', name: 'Upsilon', mode: 'secuencia', createdAt: '31/07/2024' },
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
