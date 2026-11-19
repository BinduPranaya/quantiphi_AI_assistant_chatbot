import { useCallback, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ChatSidebar from './components/ChatSidebar'
import ChatWindow from './components/ChatWindow'
import { getConversations, getConversation, deleteConversation, streamMessage } from './services/chatService'
import './App.css'

export default function App() {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [tone, setTone] = useState('Professional')
  const [loading, setLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const refreshConversations = useCallback(async () => {
    try { setConversations(await getConversations()) }
    catch (error) { toast.error(error.response?.data?.error || 'Could not load chat history. Is the backend running?') }
  }, [])

  useEffect(() => { refreshConversations() }, [refreshConversations])

  async function selectConversation(id) {
    if (loading) return
    try {
      const conversation = await getConversation(id)
      setActiveId(id)
      setMessages(conversation.messages || [])
    } catch { toast.error('Unable to open this conversation') }
  }

  function newChat() {
    if (loading) return
    setActiveId(null)
    setMessages([])
    setInput('')
  }

  async function removeConversation(id) {
    try {
      await deleteConversation(id)
      setConversations(items => items.filter(item => item.id !== id))
      if (activeId === id) newChat()
      toast.success('Conversation deleted')
    } catch { toast.error('Could not delete conversation') }
  }

  async function sendMessage(text = input, force = false) {
    const prompt = text.trim()
    if (!prompt || (loading && !force)) return
    setInput('')
    setLoading(true)
    const optimisticUser = { role: 'user', content: prompt, timestamp: new Date().toISOString() }
    setMessages(previous => [...previous, optimisticUser])
    let assistantStarted = false
    try {
      await streamMessage({
        conversationId: activeId, message: prompt, tone,
        onEvent: event => {
          if (event.type === 'start') {
            if (event.conversation_id) setActiveId(event.conversation_id)
          } else if (event.type === 'token') {
            if (!assistantStarted) {
              assistantStarted = true
              setMessages(previous => [...previous, { role: 'assistant', content: event.content, timestamp: new Date().toISOString() }])
            } else {
              setMessages(previous => previous.map((item, index) => index === previous.length - 1 ? { ...item, content: item.content + event.content } : item))
            }
          } else if (event.type === 'done') {
            setMessages(previous => previous.map((item, index) => index === previous.length - 1 && item.role === 'assistant' ? event.message : item))
            refreshConversations()
          } else if (event.type === 'error') {
            toast.error(event.error)
          }
        }
      })
      if (!assistantStarted) toast.info('The assistant returned an empty response.')
    } catch (error) {
      setMessages(previous => previous.filter((item, index) => !(index === previous.length - 1 && item.role === 'user' && item.content === prompt)))
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
      refreshConversations()
    }
  }

  async function regenerate() {
    if (loading || !activeId) return
    const lastUser = [...messages].reverse().find(item => item.role === 'user')
    if (!lastUser) return
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat/regenerate`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({conversation_id: activeId, tone})
      })
      if (!result.ok) {
        const body = await result.json().catch(() => ({}))
        throw new Error(body.error || 'Unable to prepare regeneration')
      }
      const body = await result.json()
      setMessages(body.messages || [])
      await sendMessage(lastUser.content, true)
    } catch (error) {
      toast.error(error.message || 'Could not regenerate response')
      setLoading(false)
    }
  }

  const activeTitle = conversations.find(item => item.id === activeId)?.title
  return (
    <div className="app-shell">
      <ChatSidebar conversations={conversations} activeId={activeId} onNew={newChat} onSelect={selectConversation} onDelete={removeConversation} collapsed={collapsed} onToggle={() => setCollapsed(value => !value)}/>
      <ChatWindow messages={messages} input={input} setInput={setInput} onSend={() => sendMessage()} loading={loading} tone={tone} setTone={setTone} onRegenerate={regenerate} activeTitle={activeTitle}/>
      <ToastContainer position="bottom-right" theme="dark" autoClose={2600}/>
    </div>
  )
}
