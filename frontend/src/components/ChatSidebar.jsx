import { MessageSquare, Plus, Trash2, Sparkles, PanelLeftClose } from 'lucide-react'

export default function ChatSidebar({ conversations, activeId, onNew, onSelect, onDelete, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="brand"><div className="brand-mark"><Sparkles size={19}/></div>{!collapsed && <span>quantiphi<span className="brand-dot">.</span></span>}</div>
        <button className="icon-button sidebar-toggle" onClick={onToggle} title="Toggle sidebar"><PanelLeftClose size={17}/></button>
      </div>
      <button className="new-chat" onClick={onNew}><Plus size={17}/>{!collapsed && 'New chat'}</button>
      {!collapsed && <div className="history-label">YOUR CONVERSATIONS</div>}
      <div className="history-list">
        {conversations.map(item => (
          <div className={`history-item ${activeId === item.id ? 'active' : ''}`} key={item.id}>
            <button className="history-select" onClick={() => onSelect(item.id)} title={item.title}>
              <MessageSquare size={15}/>{!collapsed && <span>{item.title || 'New conversation'}</span>}
            </button>
            {!collapsed && <button className="delete-chat" onClick={() => onDelete(item.id)} title="Delete conversation"><Trash2 size={14}/></button>}
          </div>
        ))}
        {!collapsed && conversations.length === 0 && <p className="empty-history">Your conversations will appear here.</p>}
      </div>
      {!collapsed && <div className="sidebar-footer"><span className="status-dot"/> AI assistant <span className="footer-version">v1.0</span></div>}
    </aside>
  )
}
