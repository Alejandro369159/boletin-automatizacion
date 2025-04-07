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
          <img src="@/assets/images/logo.png" alt="logo" class="h-9 invert mx-auto" />
          <hr class="border-2 mt-4" />
          <p class="text-lg mt-3">Mario A. Martínez</p>
          <p>Boletín de Correos</p>
        </div>

        <RouterLink
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="hover:ml-7 transition-normal duration-100 flex items-center gap-3 text-white font-medium ml-4 mb-3"
        >
          <component :is="route.icon" class="w-5 h-5" />
          <p>{{ route.label }}</p>
        </RouterLink>
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
