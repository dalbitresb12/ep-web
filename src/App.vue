<script setup>
import Toolbar from "primevue/toolbar";
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <Toolbar class="bg-primary text-white rounded-none">
    <template #start>
      <span class="mr-4">Running Artist</span>
    </template>

    <template #end>
      <div class="space-x-4">
        <RouterLink to="/home" class="text-white underline-none">
          Home
        </RouterLink>
        <RouterLink to="/business/challenges" class="text-white underline-none">
          Challenges
        </RouterLink>
      </div>
    </template>
  </Toolbar>
  <main class="p-4">
    <RouterView />
  </main>
</template>

<style>
@import "primevue/resources/themes/md-light-indigo/theme.css";
@import "primevue/resources/primevue.min.css";
@import "primeicons/primeicons.css";
@import "@/assets/base.css";
</style>
