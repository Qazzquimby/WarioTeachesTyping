<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const game = useGameStore()
</script>

<template>
  <div class="hud">
    <div>LIVES: {{ game.lives }}</div>
    <div>TIME: {{ game.timeLeft.toFixed(1) }}s</div>
    <div>ROUND: {{ game.currentRound }}/10</div>
  </div>
</template>
