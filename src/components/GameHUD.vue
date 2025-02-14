<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const game = useGameStore()
</script>

<template>
  <div class="hud bg-gray-800 text-white p-4 flex gap-6">
    <div>LIVES: {{ game.lives }}</div>
    <div>TIME: {{ game.timeLeft.toFixed(1) }}s</div>
    <div>ROUND: {{ game.currentRound }}/10</div>
  </div>
</template>
