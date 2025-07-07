export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_chat: {
        Row: {
          admin_id: string | null
          created_at: string | null
          id: string
          message: string
          message_type: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          message_type?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          message_type?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string | null
          booking_time: string | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          gardener_id: string | null
          gardener_name: string | null
          id: string
          price: string | null
          service: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_date?: string | null
          booking_time?: string | null
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          gardener_id?: string | null
          gardener_name?: string | null
          id?: string
          price?: string | null
          service?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string | null
          booking_time?: string | null
          client_id?: string | null
          client_name?: string | null
          created_at?: string | null
          gardener_id?: string | null
          gardener_name?: string | null
          id?: string
          price?: string | null
          service?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_gardener_id_fkey"
            columns: ["gardener_id"]
            isOneToOne: false
            referencedRelation: "gardeners"
            referencedColumns: ["id"]
          },
        ]
      }
      gardener_applications: {
        Row: {
          admin_notes: string | null
          avatar_url: string | null
          bio: string
          city: string
          created_at: string
          daily_rate: number
          email: string
          experience: string
          id: string
          languages: string[]
          name: string
          phone: string
          reviewed_at: string | null
          reviewed_by: string | null
          services: string[]
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          avatar_url?: string | null
          bio: string
          city: string
          created_at?: string
          daily_rate: number
          email: string
          experience: string
          id?: string
          languages: string[]
          name: string
          phone: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          services: string[]
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          avatar_url?: string | null
          bio?: string
          city?: string
          created_at?: string
          daily_rate?: number
          email?: string
          experience?: string
          id?: string
          languages?: string[]
          name?: string
          phone?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          services?: string[]
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gardener_bids: {
        Row: {
          bid_amount: number
          created_at: string
          gardener_id: string
          id: string
          job_posting_id: string
          message: string | null
          status: string | null
        }
        Insert: {
          bid_amount: number
          created_at?: string
          gardener_id: string
          id?: string
          job_posting_id: string
          message?: string | null
          status?: string | null
        }
        Update: {
          bid_amount?: number
          created_at?: string
          gardener_id?: string
          id?: string
          job_posting_id?: string
          message?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gardener_bids_gardener_id_fkey"
            columns: ["gardener_id"]
            isOneToOne: false
            referencedRelation: "gardeners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gardener_bids_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      gardener_posts: {
        Row: {
          content: string
          created_at: string
          garden_location: string | null
          gardener_id: string
          id: string
          image_url: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          garden_location?: string | null
          gardener_id: string
          id?: string
          image_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          garden_location?: string | null
          gardener_id?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_gardener_posts_gardener_id"
            columns: ["gardener_id"]
            isOneToOne: false
            referencedRelation: "gardeners"
            referencedColumns: ["id"]
          },
        ]
      }
      gardeners: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          experience: string | null
          hourly_rate: number | null
          id: string
          languages: string[] | null
          location: string | null
          name: string
          phone: string | null
          rating: number | null
          review_count: number | null
          services: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          experience?: string | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          location?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          services?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          experience?: string | null
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          location?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          services?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          assigned_at: string | null
          assigned_gardener_id: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          description: string
          homeowner_id: string
          id: string
          location: string
          preferred_date: string | null
          preferred_time: string | null
          service_type: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_gardener_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          description: string
          homeowner_id: string
          id?: string
          location: string
          preferred_date?: string | null
          preferred_time?: string | null
          service_type: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string | null
          assigned_gardener_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          description?: string
          homeowner_id?: string
          id?: string
          location?: string
          preferred_date?: string | null
          preferred_time?: string | null
          service_type?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_assigned_gardener_id_fkey"
            columns: ["assigned_gardener_id"]
            isOneToOne: false
            referencedRelation: "gardeners"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_post_comments_post_id"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "gardener_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_post_likes_post_id"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "gardener_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      test_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
