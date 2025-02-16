import { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  const API_KEY = Netlify.env.get("OPENROUTER_KEY")
  // For security, prefer parsing body like this:
  const body = event.body ? JSON.parse(event.body) : {}

  console.log('Protected API called with query:', body.query)

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({
      data: `Processed query "${body.query}" - Mock response`,
      envKeyExists: !!API_KEY
    })
  }
}
