import type { User } from '../types'

export const users: User[] = [
  { id: 'u1', name: 'You', email: 'you@taskflow.app', initials: 'Y', color: '#0D9488' },
  { id: 'u2', name: 'Amara Chukwu', email: 'amara@taskflow.app', initials: 'AC', color: '#2563EB' },
  { id: 'u3', name: 'Leo Marchetti', email: 'leo@taskflow.app', initials: 'LM', color: '#D97706' },
  { id: 'u4', name: 'Priya Nair', email: 'priya@taskflow.app', initials: 'PN', color: '#7C3AED' },
  { id: 'u5', name: 'Sam Okafor', email: 'sam@taskflow.app', initials: 'SO', color: '#DC2626' },
]

export const currentUserId = 'u1'

export function getUserById(id?: string): User | undefined {
  if (!id) return undefined
  return users.find((u) => u.id === id)
}
