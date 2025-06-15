export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
