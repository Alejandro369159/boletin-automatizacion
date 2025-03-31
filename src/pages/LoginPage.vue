<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function login() {
  try {
    router.push('/correos')
    // Login function
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <main
    class="bg-[url(@/assets/images/background.jpg)] w-full h-[100dvh] bg-contain bg-center flex justify-center items-center"
  >
    <form @submit.prevent="login" class="bg-white p-6 rounded-sm shadow-2xl w-2/6">
      <h2 class="text-2xl text-center font-medium">Inicia Sesión</h2>
      <div class="mt-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="block px-3 py-2 w-full bg-gray-100"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="block px-3 py-2 mt-4 w-full bg-gray-100"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-2 mx-auto block mt-4 cursor-pointer"
      >
        Ingresar
      </button>
    </form>
  </main>
</template>
