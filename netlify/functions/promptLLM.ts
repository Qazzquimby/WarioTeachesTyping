import { Context } from "@netlify/functions";


export default async (req: Request, context: Context) => {
  try {
    const API_KEY = Netlify.env.OPENROUTER_KEY
    if (!API_KEY) {
      return { statusCode: 500, body: 'Missing API key configuration' }
    }

    const body = JSON.parse(req.body || '{}')
    const userQuery = body.query?.trim()

    if (!userQuery) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing query parameter' })
      }
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [{
          role: 'user',
          content: userQuery
        }]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter error: ${error}`)
    }

    const data = await response.json()
    const answer = data.choices[0]?.message?.content || 'No response'

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: answer })
    }

  } catch (error) {
    console.error('LLM Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process LLM request',
        details: error instanceof Error ? error.message : String(error)
      })
    }
  }
}
