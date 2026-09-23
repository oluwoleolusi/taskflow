import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  children?: ReactNode
  labelledById: string
}

export default function Drawer({ open, onClose, children, labelledById }: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-200 ease-app ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        className={`absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-surface shadow-panel transition-transform duration-200 ease-app ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="icon-btn absolute right-4 top-4 z-10"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
