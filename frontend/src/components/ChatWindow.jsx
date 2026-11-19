import { useEffect, useRef } from 'react'
import { ArrowUp, Paperclip, Sparkles } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ToneSelector from './ToneSelector'

export default function ChatWindow({ messages, input, setInput, onSend, loading, tone, setTone, onRegenerate, activeTitle }) {
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  function submit(e) {
    e?.preventDefault()
    onSend()
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }
  return (
    <main className="main-panel">
      <header className="topbar">
        <div><div className="topbar-title">{activeTitle || 'AI Assistant'}</div><div className="topbar-subtitle"><span className="status-dot"/> Ready to help</div></div>
        <ToneSelector tone={tone} onChange={setTone}/>
      </header>
      <section className="chat-scroll">
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="welcome-icon"><Sparkles size={26}/></div>
            <p className="eyebrow">YOUR AI WORKSPACE</p>
            <h1>What can I help you<br/><span>think through today?</span></h1>
            <p className="welcome-copy">Ask a question, explore an idea, or get help with your next task.</p>
            <div className="suggestion-grid">
              {['Explain a complex topic simply','Help me write a professional email','Give me ideas for a project','Summarize key points about AI'].map(text => <button key={text} onClick={() => {setInput(text); textareaRef.current?.focus()}}>{text}<span>↗</span></button>)}
            </div>
          </div>
        ) : (
          <div className="messages-wrap">
            {messages.map((message, index) => <ChatMessage key={`${index}-${message.timestamp || ''}`} message={message} isLastAssistant={message.role === 'assistant' && index === messages.length - 1} onRegenerate={onRegenerate} isStreaming={loading && index === messages.length - 1 && message.role === 'assistant'}/>)}
            {loading && messages[messages.length - 1]?.role === 'user' && <div className="thinking"><span/><span/><span/> Thinking</div>}
            <div ref={bottomRef}/>
          </div>
        )}
      </section>
      <footer className="composer-area">
        <form className="composer" onSubmit={submit}>
          <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Message your AI assistant..." rows={1} disabled={loading}/>
          <div className="composer-bottom"><span className="composer-hint"><Paperclip size={14}/> Shift + Enter for a new line</span><button className="send-button" type="submit" disabled={loading || !input.trim()} aria-label="Send message"><ArrowUp size={19}/></button></div>
        </form>
        <p className="disclaimer">AI can make mistakes. Verify important information.</p>
      </footer>
    </main>
  )
}
