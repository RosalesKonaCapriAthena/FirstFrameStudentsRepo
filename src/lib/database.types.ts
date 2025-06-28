export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          full_name: string
          user_type: 'student' | 'organizer'
          location: string | null
          bio: string | null
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null
          portfolio_url: string | null
          instagram_handle: string | null
          profile_picture_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          full_name: string
          user_type: 'student' | 'organizer'
          location?: string | null
          bio?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          portfolio_url?: string | null
          instagram_handle?: string | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          full_name?: string
          user_type?: 'student' | 'organizer'
          location?: string | null
          bio?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          portfolio_url?: string | null
          instagram_handle?: string | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          organizer_id: string
          title: string
          description: string
          sport: string
          location: string
          address: string
          date: string
          time: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          requirements: string[]
          status: 'active' | 'pending' | 'completed' | 'cancelled'
          applications_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          title: string
          description: string
          sport: string
          location: string
          address: string
          date: string
          time: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          requirements: string[]
          status?: 'active' | 'pending' | 'completed' | 'cancelled'
          applications_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organizer_id?: string
          title?: string
          description?: string
          sport?: string
          location?: string
          address?: string
          date?: string
          time?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          requirements?: string[]
          status?: 'active' | 'pending' | 'completed' | 'cancelled'
          applications_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          opportunity_id: string
          photographer_id: string
          status: 'pending' | 'approved' | 'declined'
          message: string | null
          applied_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          opportunity_id: string
          photographer_id: string
          status?: 'pending' | 'approved' | 'declined'
          message?: string | null
          applied_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          opportunity_id?: string
          photographer_id?: string
          status?: 'pending' | 'approved' | 'declined'
          message?: string | null
          applied_at?: string
          reviewed_at?: string | null
        }
      }
      portfolio_images: {
        Row: {
          id: string
          photographer_id: string
          title: string
          description: string | null
          image_url: string
          category: string
          likes_count: number
          views_count: number
          created_at: string
        }
        Insert: {
          id?: string
          photographer_id: string
          title: string
          description?: string | null
          image_url: string
          category: string
          likes_count?: number
          views_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          photographer_id?: string
          title?: string
          description?: string | null
          image_url?: string
          category?: string
          likes_count?: number
          views_count?: number
          created_at?: string
        }
      }
    }
  }
} 