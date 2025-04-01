<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import suscribers from '@/assets/suscribers.js'
import type { DataItem } from '@/types/Table'

const router = useRouter()

const newSubscriber = ref<{ name: string; email: string; businessName: string; role: string }>({
  name: '',
  email: '',
  businessName: '',
  role: '',
})

const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const addSubscriber = () => {
  errorMessage.value = null
  successMessage.value = null

  if (!newSubscriber.value.name.trim()) {
    errorMessage.value = 'El nombre es obligatorio.'
    return
  }

  if (!newSubscriber.value.email.trim()) {
    errorMessage.value = 'El correo electrónico es obligatorio.'
    return
  }

  if (!newSubscriber.value.businessName.trim()) {
    errorMessage.value = 'El nombre del negocio es obligatorio.'
    return
  }

  if (!newSubscriber.value.role.trim()) {
    errorMessage.value = 'El rol es obligatorio.'
    return
  }

  // Find the next available ID (simplistic approach, might need adjustment)
  let nextId = 1
  if (suscribers.length > 0) {
    const lastSubscriber = suscribers[suscribers.length - 1]
    nextId = parseInt(lastSubscriber.id as string, 10) + 1
    if (isNaN(nextId)) {
      // Fallback if IDs are not simple numbers
      nextId = suscribers.length + 1
    }
  }

  const subscriberToAdd: DataItem = {
    id: String(nextId),
    name: newSubscriber.value.name,
    email: newSubscriber.value.email,
    businessName: newSubscriber.value.businessName,
    role: newSubscriber.value.role,
    // Manteniendo campos existentes si son necesarios para TableComponent
    status: 'activo',
    subscribedAt: new Date().toLocaleDateString(),
  }

  suscribers.push(subscriberToAdd)
  console.log('Nuevo suscriptor añadido:', subscriberToAdd)

  successMessage.value = `Usuario "${newSubscriber.value.name}" añadido correctamente.`

  newSubscriber.value = {
    name: '',
    email: '',
    businessName: '',
    role: '',
  }

  setTimeout(() => {
    router.push('/suscriptores')
  }, 1500)
}
</script>

<template>
  <div class="px-8 mt-6">
    <h3 class="text-2xl mb-4">Añadir suscriptor</h3>

    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <div
      v-if="successMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong class="font-bold">Éxito!</strong>
      <span class="block sm:inline">{{ successMessage }}</span>
    </div>

    <form @submit.prevent="addSubscriber" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
        <input
          type="text"
          id="name"
          v-model="newSubscriber.name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Correo Electrónico:</label
        >
        <input
          type="email"
          id="email"
          v-model="newSubscriber.email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label for="businessName" class="block text-gray-700 text-sm font-bold mb-2"
          >Nombre del Negocio:</label
        >
        <input
          type="text"
          id="businessName"
          v-model="newSubscriber.businessName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label for="role" class="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
        <input
          type="text"
          id="role"
          v-model="newSubscriber.role"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div class="md:col-span-2 flex justify-end gap-4 mt-4">
        <button
          type="submit"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Añadir Usuario
        </button>
        <button
          type="button"
          class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          @click="router.go(-1)"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>
