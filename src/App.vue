<script setup lang="ts">
import { state } from './state'
</script>

<template>
  <main class="p-4 h-screen">
    <div class="window status-bar mb-4">
      <div class="status-bar-field">Round: {{ state.currentRound }}</div>
      <div class="status-bar-field">Lives: {{ state.lives }}</div>
    </div>
    <RouterView />
  </main>
</template>
