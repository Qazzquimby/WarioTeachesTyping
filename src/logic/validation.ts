import { state } from '~/state'
import type { Question } from '~/types'

export async function validateWithLLM(question: Question, answer: string): Promise<boolean> {
  if (!state.userAPIKey) return false
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.userAPIKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/palm-2',
        messages: [{
          role: 'user',
          content: `Is "${answer}" valid for this requirement: ${question.validationDescription}? Answer only yes/no.`
        }]
      })
    })
    
    const data = await response.json()
    return data.choices[0].message.content.toLowerCase().includes('yes')
  } catch (error) {
    console.error('LLM validation failed:', error)
    return false
  }
}
