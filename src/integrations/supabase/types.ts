export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      active_sessions: {
        Row: {
          session_id: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          session_id: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          session_id?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      class_lessons: {
        Row: {
          class_id: string
          content_markdown: string
          created_at: string
          id: string
        }
        Insert: {
          class_id: string
          content_markdown?: string
          created_at?: string
          id?: string
        }
        Update: {
          class_id?: string
          content_markdown?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_lessons_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: true
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_questions: {
        Row: {
          class_id: string
          created_at: string
          id: string
          question_id: number
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          question_id: number
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_questions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          class_number: number
          content: string | null
          created_at: string
          description: string | null
          estimated_minutes: number
          id: string
          path_id: string
          title: string
        }
        Insert: {
          class_number: number
          content?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number
          id?: string
          path_id: string
          title: string
        }
        Update: {
          class_number?: number
          content?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number
          id?: string
          path_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_question_answers: {
        Row: {
          answered_at: string
          daily_question_id: string
          id: string
          is_correct: boolean
          selected_answer: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          daily_question_id: string
          id?: string
          is_correct: boolean
          selected_answer: string
          user_id: string
        }
        Update: {
          answered_at?: string
          daily_question_id?: string
          id?: string
          is_correct?: boolean
          selected_answer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_question_answers_daily_question_id_fkey"
            columns: ["daily_question_id"]
            isOneToOne: false
            referencedRelation: "daily_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_questions: {
        Row: {
          active_date: string
          category: string
          created_at: string
          id: string
          question_id: number
        }
        Insert: {
          active_date: string
          category: string
          created_at?: string
          id?: string
          question_id: number
        }
        Update: {
          active_date?: string
          category?: string
          created_at?: string
          id?: string
          question_id?: number
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          created_at: string
          id: string
          name: string
          persona_goal: string
          tier_min_required: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          persona_goal: string
          tier_min_required?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          persona_goal?: string
          tier_min_required?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          id: string
          lesson_id: string
          score_last: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          lesson_id: string
          score_last?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          lesson_id?: string
          score_last?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_questions: {
        Row: {
          id: string
          lesson_id: string
          question_id: number
        }
        Insert: {
          id?: string
          lesson_id: string
          question_id: number
        }
        Update: {
          id?: string
          lesson_id?: string
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions33"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          category: string
          content: string
          created_at: string
          estimated_minutes: number
          id: string
          level: string
          order_index: number
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          estimated_minutes?: number
          id?: string
          level?: string
          order_index?: number
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          estimated_minutes?: number
          id?: string
          level?: string
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempted_at: string
          identifier: string
          success: boolean
        }
        Insert: {
          attempted_at?: string
          identifier: string
          success?: boolean
        }
        Update: {
          attempted_at?: string
          identifier?: string
          success?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          display_name: string | null
          elo_rating: number | null
          email: string | null
          email_opt_out: boolean
          exam_history: Json | null
          id: string
          is_subscribed: boolean
          preferred_language: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier: string | null
          total_questions_seen: number
          updated_at: string
          used_questions: string[] | null
          weak_category: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          display_name?: string | null
          elo_rating?: number | null
          email?: string | null
          email_opt_out?: boolean
          exam_history?: Json | null
          id: string
          is_subscribed?: boolean
          preferred_language?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          total_questions_seen?: number
          updated_at?: string
          used_questions?: string[] | null
          weak_category?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          display_name?: string | null
          elo_rating?: number | null
          email?: string | null
          email_opt_out?: boolean
          exam_history?: Json | null
          id?: string
          is_subscribed?: boolean
          preferred_language?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          total_questions_seen?: number
          updated_at?: string
          used_questions?: string[] | null
          weak_category?: string | null
        }
        Relationships: []
      }
      question_difficulty: {
        Row: {
          attempt_count: number
          correct_pct: number
          question_id: number
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          correct_pct?: number
          question_id: number
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          correct_pct?: number
          question_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_difficulty_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_reviews: {
        Row: {
          created_at: string | null
          ease_factor: number
          id: string
          interval_days: number
          last_quality: number | null
          next_review_date: string
          question_id: number
          repetitions: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ease_factor?: number
          id?: string
          interval_days?: number
          last_quality?: number | null
          next_review_date?: string
          question_id: number
          repetitions?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ease_factor?: number
          id?: string
          interval_days?: number
          last_quality?: number | null
          next_review_date?: string
          question_id?: number
          repetitions?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      question_translations: {
        Row: {
          created_at: string | null
          explanation: string | null
          id: string
          language: string
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          question_id: number | null
          question_text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          language: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          question_id?: number | null
          question_text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          language?: string
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          question_id?: number | null
          question_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_translations_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          category: string | null
          correct_answer: string | null
          elo_rating: number | null
          exam_category: string | null
          explanation: string | null
          id: number
          is_free_pool: boolean
          language: string | null
          level: string | null
          option_a: string | null
          option_a_translated: string | null
          option_b: string | null
          option_b_translated: string | null
          option_c: string | null
          option_c_translated: string | null
          option_d: string | null
          option_d_translated: string | null
          question_text: string | null
          question_translated: string | null
          subcategory: string | null
        }
        Insert: {
          category?: string | null
          correct_answer?: string | null
          elo_rating?: number | null
          exam_category?: string | null
          explanation?: string | null
          id: number
          is_free_pool?: boolean
          language?: string | null
          level?: string | null
          option_a?: string | null
          option_a_translated?: string | null
          option_b?: string | null
          option_b_translated?: string | null
          option_c?: string | null
          option_c_translated?: string | null
          option_d?: string | null
          option_d_translated?: string | null
          question_text?: string | null
          question_translated?: string | null
          subcategory?: string | null
        }
        Update: {
          category?: string | null
          correct_answer?: string | null
          elo_rating?: number | null
          exam_category?: string | null
          explanation?: string | null
          id?: number
          is_free_pool?: boolean
          language?: string | null
          level?: string | null
          option_a?: string | null
          option_a_translated?: string | null
          option_b?: string | null
          option_b_translated?: string | null
          option_c?: string | null
          option_c_translated?: string | null
          option_d?: string | null
          option_d_translated?: string | null
          question_text?: string | null
          question_translated?: string | null
          subcategory?: string | null
        }
        Relationships: []
      }
      questions33: {
        Row: {
          category: string | null
          correct_answer: string | null
          explanation: string | null
          id: number
          language: string | null
          level: string | null
          option_a: string | null
          option_a_translated: string | null
          option_b: string | null
          option_b_translated: string | null
          option_c: string | null
          option_c_translated: string | null
          option_d: string | null
          option_d_translated: string | null
          question_text: string | null
          question_translated: string | null
          subcategory: string | null
        }
        Insert: {
          category?: string | null
          correct_answer?: string | null
          explanation?: string | null
          id?: number
          language?: string | null
          level?: string | null
          option_a?: string | null
          option_a_translated?: string | null
          option_b?: string | null
          option_b_translated?: string | null
          option_c?: string | null
          option_c_translated?: string | null
          option_d?: string | null
          option_d_translated?: string | null
          question_text?: string | null
          question_translated?: string | null
          subcategory?: string | null
        }
        Update: {
          category?: string | null
          correct_answer?: string | null
          explanation?: string | null
          id?: number
          language?: string | null
          level?: string | null
          option_a?: string | null
          option_a_translated?: string | null
          option_b?: string | null
          option_b_translated?: string | null
          option_c?: string | null
          option_c_translated?: string | null
          option_d?: string | null
          option_d_translated?: string | null
          question_text?: string | null
          question_translated?: string | null
          subcategory?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          key: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          window_start: string
        }
        Update: {
          count?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_user_id: string | null
          referrer_user_id: string
          status: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_user_id?: string | null
          referrer_user_id: string
          status?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_user_id?: string | null
          referrer_user_id?: string
          status?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          answered_at: string
          category: string | null
          id: string
          is_correct: boolean
          question_id: number
          selected_answer: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          category?: string | null
          id?: string
          is_correct: boolean
          question_id: number
          selected_answer: string
          user_id: string
        }
        Update: {
          answered_at?: string
          category?: string | null
          id?: string
          is_correct?: boolean
          question_id?: number
          selected_answer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_class_progress: {
        Row: {
          attempts_count: number
          class_id: string
          completed_at: string | null
          created_at: string
          id: string
          score: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts_count?: number
          class_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts_count?: number
          class_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_class_progress_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          exam_date: string | null
          first_name: string | null
          goal_type: string | null
          id: string
          level: string | null
          onboarding_completed: boolean
          timeline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          exam_date?: string | null
          first_name?: string | null
          goal_type?: string | null
          id?: string
          level?: string | null
          onboarding_completed?: boolean
          timeline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          exam_date?: string | null
          first_name?: string | null
          goal_type?: string | null
          id?: string
          level?: string | null
          onboarding_completed?: boolean
          timeline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_login_allowed: { Args: { p_identifier: string }; Returns: Json }
      consume_rate_limit: {
        Args: { p_key: string; p_max: number; p_window_seconds: number }
        Returns: Json
      }
      ensure_daily_question: { Args: never; Returns: undefined }
      has_paid_access: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      record_login_attempt: {
        Args: { p_identifier: string; p_success: boolean }
        Returns: undefined
      }
      refresh_question_difficulty: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
