<script setup lang="ts">
const key = ref('')
const isValid = ref(true)

async function checkAPIKey() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { Authorization: `Bearer ${key.value}` },
    })
    isValid.value = response.ok
  }
  catch {
    isValid.value = false
  }
}
</script>

<template>
  <div v-if="!key" class="fixed inset-0 flex items-center justify-center bg-black/80">
    <div class="rounded bg-white p-8">
      <input v-model="key" placeholder="Enter OpenRouter API Key" class="mr-2 border p-2">
      <button class="bg-blue-500 p-2 text-white" @click="checkAPIKey">
        Validate
      </button>
      <div v-if="!isValid" class="mt-2 text-red-500">
        Invalid API key
      </div>
    </div>
  </div>
</template>
