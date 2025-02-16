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

export async function promptLLM(query: string): Promise<{data: string}> {
  try {
    const response = await fetch('/.netlify/functions/promptLLM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('apiKey') || ''}`
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'API request failed')
    }

    return await response.json()
  } catch (e) {
    console.error('LLM API call failed:', e)
    return { 
      data: `LLM Error: ${e instanceof Error ? e.message : 'Unknown error'} - Using fallback response`
    }
  }
}
