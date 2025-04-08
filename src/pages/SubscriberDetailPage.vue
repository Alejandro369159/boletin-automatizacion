<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { DataItem } from '@/types/Table'
import SubscribersRepository from '@/repositories/SubscribersRepository'

const route = useRoute()
const subscriberId = ref<string | null>(null)
const subscriber = ref<DataItem | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showConfirmation = ref(false)
const successMessage = ref<string | null>(null)

onMounted(async () => {
  subscriberId.value = route.params.id as string | null
  if (subscriberId.value) {
    loading.value = true
    error.value = null
    try {
      subscriber.value = await SubscribersRepository.show(subscriberId.value)
    } catch (err: unknown) {
      console.error('Error al obtener los detalles del suscriptor:', err)
      error.value = 'No se pudieron cargar los detalles del suscriptor.'
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})

const unsubscribe = () => {
  showConfirmation.value = true
}

const confirmUnsubscribe = async () => {
  if (subscriber.value && subscriber.value.id) {
    await SubscribersRepository.delete(subscriberId.value!)
  }
  successMessage.value = `Suscripción de ${subscriber.value?.name} anulada correctamente.`
  showConfirmation.value = false
}

const cancelUnsubscribe = () => {
  showConfirmation.value = false
}
</script>

<template>
  <div v-if="loading" class="text-center mt-12">Cargando detalles del suscriptor...</div>
  <div v-else-if="error" class="text-center mt-12 text-red-500">{{ error }}</div>
  <div v-else-if="subscriber" class="px-8 mt-6">
    <h3 class="text-2xl mb-4">Detalles del Suscriptor</h3>
    <div
      v-if="successMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong class="font-bold mr-2">Éxito!</strong>
      <span class="block sm:inline">{{ successMessage }}</span>
    </div>
    <div class="flex items-start gap-6 mb-4">
      <img
        src="https://avatar.iran.liara.run/public/boy"
        alt="Placeholder de usuario"
        class="w-24 h-24 rounded-full object-cover shadow"
      />
      <div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Nombre:</strong> {{ subscriber.name }}</p>
            <p><strong>ID:</strong> {{ subscriber.id }}</p>
            <p v-if="subscriber.status"><strong>Estado:</strong> {{ subscriber.status }}</p>
            <p v-if="subscriber.subscribedAt">
              <strong>Fecha de suscripción:</strong> {{ subscriber.subscribedAt }}
            </p>
            <p v-if="subscriber.email">
              <strong>Correo electrónico:</strong> {{ subscriber.email }}
            </p>
          </div>
          <div>
            <p v-if="subscriber.plan"><strong>Plan:</strong> {{ subscriber.plan }}</p>
            <p v-if="subscriber.country"><strong>País:</strong> {{ subscriber.country }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center gap-4">
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        @click="unsubscribe"
      >
        Anular Suscripción
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="$router.go(-1)"
      >
        Volver
      </button>
    </div>

    <div
      v-if="showConfirmation"
      class="fixed z-10 inset-0 overflow-y-auto bg-gray-600/50 bg-opacity-75 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-8 shadow-xl">
        <h2 class="text-lg font-bold mb-4">
          ¿Estás seguro de que deseas anular la suscripción de {{ subscriber.name }}?
        </h2>
        <div class="flex justify-end gap-4">
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            @click="cancelUnsubscribe"
          >
            Cancelar
          </button>
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            @click="confirmUnsubscribe"
          >
            Anular
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center mt-12">No se ha seleccionado ningún suscriptor.</div>
</template>
