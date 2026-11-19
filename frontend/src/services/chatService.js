import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function getConversations() {
  const { data } = await axios.get(`${API}/api/conversations`)
  return data
}

export async function getConversation(id) {
  const { data } = await axios.get(`${API}/api/conversations/${id}`)
  return data
}

export async function deleteConversation(id) {
  const { data } = await axios.delete(`${API}/api/conversations/${id}`)
  return data
}

export async function streamMessage({ conversationId, message, tone, onEvent, signal }) {
  const response = await fetch(`${API}/api/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, message, tone }),
    signal
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Unable to contact the server')
  }
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''
    for (const event of events) {
      const line = event.split('\n').find(item => item.startsWith('data: '))
      if (line) {
        try { onEvent(JSON.parse(line.slice(6))) } catch { /* ignore malformed event */ }
      }
    }
  }
}
