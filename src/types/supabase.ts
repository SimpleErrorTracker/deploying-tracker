export type Database = {
  public: {
    Tables: {
      bugs: {
        Row: {
          id: string
          description: string
          category: 'Authentication' | 'DB' | 'UI' | 'Network'
          priority: 'low' | 'medium' | 'high' | 'critical'
          status: 'Open' | 'In Progress' | 'Done'
          created_at: string
          updated_at: string
          author_id: string
          author_name: string
        }
        Insert: {
          id?: string
          description: string
          category: 'Authentication' | 'DB' | 'UI' | 'Network'
          priority: 'low' | 'medium' | 'high' | 'critical'
          status?: 'Open' | 'In Progress' | 'Done'
          created_at?: string
          updated_at?: string
          author_id: string
          author_name: string
        }
        Update: {
          id?: string
          description?: string
          category?: 'Authentication' | 'DB' | 'UI' | 'Network'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'Open' | 'In Progress' | 'Done'
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
    }
  }
}
