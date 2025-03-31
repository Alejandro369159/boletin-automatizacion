<script setup lang="ts">
import { UsersIcon } from '@heroicons/vue/24/outline'
import { HomeIcon } from '@heroicons/vue/24/outline'
import type { FunctionalComponent } from 'vue'

const routes: { label: string; path: string; icon: FunctionalComponent }[] = [
  {
    label: 'Correos',
    path: '/correos',
    icon: HomeIcon,
  },
  {
    label: 'Suscriptores',
    path: '/suscriptores',
    icon: UsersIcon,
  },
]
</script>

<template>
  <main class="flex">
    <nav class="h-[100dvh] bg-blue-800 w-1/6 shadow-xl flex flex-col justify-between">
      <div>
        <div class="text-white font-semibold text-center pt-4 mb-8">
          <p class="text-lg">Nombre del administrador</p>
          <p>Nombre del negocio</p>
        </div>

        <div
          v-for="route in routes"
          :key="route.path"
          class="flex items-center gap-3 text-white font-medium ml-4 mb-3 hover:ml-7 transition-normal duration-100"
        >
          <component :is="route.icon" class="w-5 h-5" />
          <RouterLink :to="route.path" class="block">{{ route.label }}</RouterLink>
        </div>
      </div>

      <button
        @click="$router.push('/login')"
        type="button"
        class="bg-red-600 text-white px-6 py-2 block mx-auto mb-6 cursor-pointer hover:bg-red-700"
      >
        Cerrar Sesión
      </button>
    </nav>
    <section class="w-5/6">
      <RouterView />
    </section>
  </main>
</template>
