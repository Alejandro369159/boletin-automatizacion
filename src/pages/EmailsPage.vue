<script setup lang="ts">
import { mockEmails } from '@/assets/mockEmails'
import TableComponent from '@/components/TableComponent.vue'
import router from '@/router'
import type { Column, DataItem } from '@/types/Table'

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

function viewDetail(item: DataItem) {
  const itemId = item.id ?? null
  if (itemId && typeof itemId === 'string') router.push(`/correos/${itemId}`)
}
</script>

<template>
  <h3 class="text-2xl text-center mt-12">Lista de correos programados</h3>
  <div class="px-8 mt-6">
    <TableComponent
      :columns
      :data="mockEmails"
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
