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

export async function callProtectedApi(query: string): Promise<{data: string}> {
  try {
    const response = await fetch('/.netlify/functions/protected-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('apiKey') || ''}`
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (e) {
    console.error('API call failed:', e);
    return { data: 'API Error - Using fallback' };
  }
}
