import { SlidersHorizontal } from 'lucide-react'

const tones = ['Professional', 'Casual', 'Concise']
export default function ToneSelector({ tone, onChange }) {
  return (
    <div className="tone-control">
      <SlidersHorizontal size={15}/>
      <span className="tone-label">Tone</span>
      <select value={tone} onChange={e => onChange(e.target.value)} aria-label="Response tone">
        {tones.map(value => <option key={value} value={value}>{value}</option>)}
      </select>
    </div>
  )
}
