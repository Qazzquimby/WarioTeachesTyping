export async function getIsWord(word: string) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    )
    return response.status === 200
  } catch (e) {
    return false
  }
}

export async function getRandomWord(length: number): Promise<string> {
  try {
    const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${length}`)
    const [word] = await response.json()
    return word
  } catch {
    // Fallback if API fails
    const fallback = Math.random().toString(36).substring(2, 2+length)
    return fallback
  }
}
