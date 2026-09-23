import type { Project } from '../types'
import { offsetIso } from '../utils/dates'

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Northstar Website',
    description: 'Full redesign and rebuild of the marketing site ahead of the Q4 launch.',
    status: 'active',
    dueDate: offsetIso(18),
    memberIds: ['u1', 'u2', 'u3'],
  },
  {
    id: 'p2',
    name: 'Client Onboarding',
    description: 'Standardize the onboarding flow and documentation for new retainer clients.',
    status: 'active',
    dueDate: offsetIso(9),
    memberIds: ['u1', 'u4'],
  },
  {
    id: 'p3',
    name: 'Product Launch',
    description: 'Coordinate the go-to-market plan for the spring product release.',
    status: 'active',
    dueDate: offsetIso(30),
    memberIds: ['u1', 'u2', 'u4', 'u5'],
  },
  {
    id: 'p4',
    name: 'Q4 Content',
    description: 'Plan and produce the content calendar for the fourth quarter.',
    status: 'on-hold',
    dueDate: offsetIso(45),
    memberIds: ['u3', 'u5'],
  },
  {
    id: 'p5',
    name: 'Studio Operations',
    description: 'Internal process improvements — tooling, invoicing and reporting.',
    status: 'active',
    dueDate: undefined,
    memberIds: ['u1'],
  },
]

export function getProjectById(id?: string): Project | undefined {
  if (!id) return undefined
  return projects.find((p) => p.id === id)
}
