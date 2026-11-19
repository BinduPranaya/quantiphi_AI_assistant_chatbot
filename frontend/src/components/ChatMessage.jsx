import { Bot, User, Copy, Check, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function ChatMessage({ message, isLastAssistant, onRegenerate, isStreaming }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  async function copyText() {
    try {
      await navigator.clipboard.writeText(message.content || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard permission may be unavailable */ }
  }
  return (
    <div className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>{isUser ? <User size={16}/> : <Bot size={17}/>}</div>
      <div className="message-content">
        <div className="message-meta"><strong>{isUser ? 'You' : 'Assistant'}</strong>{message.timestamp && <span>{new Date(message.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>}</div>
        <div className="message-bubble">{message.content}{isStreaming && <span className="typing-cursor"/>}</div>
        {!isUser && !isStreaming && <div className="message-actions">
          <button onClick={copyText} title="Copy response">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy'}</button>
          {isLastAssistant && <button onClick={onRegenerate} title="Regenerate response"><RefreshCw size={14}/> Regenerate</button>}
        </div>}
      </div>
    </div>
  )
}
