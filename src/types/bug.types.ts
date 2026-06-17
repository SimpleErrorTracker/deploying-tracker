export interface Bug {
  id: string
  description: string
  category: 'Authentication' | 'DB' | 'UI' | 'Network'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'Open' | 'In Progress' | 'Done'
  created_at: string
  author_id: string
  author_name: string
}

export interface CreateBugDTO {
  description: string
  category: Bug['category']
  priority: Bug['priority']
}

export interface BugFormData {
  description: string
  category: Bug['category']
  priority: Bug['priority']
}

export interface ValidationErrors {
  description?: string
  category?: string
  priority?: string
}
