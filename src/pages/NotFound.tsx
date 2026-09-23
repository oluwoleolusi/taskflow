import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-[42ch] text-sm text-ink-soft">
        The page you're looking for doesn't exist, or has moved.
      </p>
      <Link to="/today" className="btn-primary mt-6">
        Back to Today
      </Link>
    </div>
  )
}
