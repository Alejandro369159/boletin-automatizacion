<script setup lang="ts">
import type { Column, DataItem } from '@/types/Table'
import { defineProps, defineEmits, computed, ref } from 'vue'

const props = defineProps<{
  columns: Column[]
  data: DataItem[]
  rowsPerPage?: number
}>()

const emits = defineEmits<{
  (e: 'row-click', item: DataItem): void
}>()

const emitRowClick = (item: DataItem) => {
  emits('row-click', item)
}

const searchQuery = ref('')
const currentPage = ref(1)
const rowsPerPage = computed(() => props.rowsPerPage || 5)

const filteredData = computed(() => {
  if (!searchQuery.value) return props.data
  return props.data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / rowsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredData.value.slice(start, start + rowsPerPage.value)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div>
    <!-- Buscador -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Buscar..."
      class="w-1/3 p-2 mb-2 border border-gray-300 rounded float-end"
    />

    <table class="w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th
            v-for="column in columns"
            :key="column.key"
            class="p-2 border border-gray-300 text-left"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in paginatedData"
          :key="index"
          class="hover:bg-gray-100 cursor-pointer"
          @click="emitRowClick(item)"
        >
          <td v-for="column in columns" :key="column.key" class="p-2 border border-gray-300">
            {{ item[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-2">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="p-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
      >
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="p-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>
