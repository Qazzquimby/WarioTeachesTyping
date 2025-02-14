import { ref } from 'vue'

const cryptoKey = ref<CryptoKey>()

export async function initCryptoKey() {
  if (!cryptoKey.value) {
    cryptoKey.value = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }
}

export async function secureSet(key: string, value: string) {
  await initCryptoKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey.value!,
    new TextEncoder().encode(value)
  )
  sessionStorage.setItem(key, JSON.stringify({ iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) }))
}

export async function secureGet(key: string): Promise<string | null> {
  await initCryptoKey()
  const item = sessionStorage.getItem(key)
  if (!item) return null
  
  const { iv, encrypted } = JSON.parse(item)
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    cryptoKey.value!,
    new Uint8Array(encrypted)
  )
  return new TextDecoder().decode(decrypted)
}
