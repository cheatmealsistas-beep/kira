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
      app_settings: {
        Row: {
          key: string
          value: Json
          category: string
          description: string | null
          updated_by: string | null
          updated_at: string | null
        }
        Insert: {
          key: string
          value: Json
          category: string
          description?: string | null
          updated_by?: string | null
          updated_at?: string | null
        }
        Update: {
          key?: string
          value?: Json
          category?: string
          description?: string | null
          updated_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      attribution_events: {
        Row: {
          id: string
          user_id: string | null
          session_id: string
          event_type: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          referrer: string | null
          landing_page: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id: string
          event_type: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          referrer?: string | null
          landing_page?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string
          event_type?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          referrer?: string | null
          landing_page?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attribution_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      energy_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          energy_level: string
          context: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          log_date: string
          energy_level: string
          context?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          energy_level?: string
          context?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          slug: string
          name_en: string
          name_es: string
          type: string
          pattern: string
          muscle_groups: string[]
          primary_muscle: string
          equipment_required: string[] | null
          affects_pain_zones: string[] | null
          goal_recomposition: number | null
          goal_strength: number | null
          goal_endurance: number | null
          goal_flexibility: number | null
          exercise_order: string | null
          difficulty: string | null
          card_position_en: string | null
          card_position_es: string | null
          card_grip_en: string | null
          card_grip_es: string | null
          card_movement_en: string | null
          card_movement_es: string | null
          card_target_muscles_en: string | null
          card_target_muscles_es: string | null
          card_key_cue_en: string | null
          card_key_cue_es: string | null
          card_common_mistake_en: string | null
          card_common_mistake_es: string | null
          card_safety_tip_en: string | null
          card_safety_tip_es: string | null
          swap_alternatives: string[] | null
          video_url: string | null
          image_url: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          slug: string
          name_en: string
          name_es: string
          type: string
          pattern: string
          muscle_groups: string[]
          primary_muscle: string
          equipment_required?: string[] | null
          affects_pain_zones?: string[] | null
          goal_recomposition?: number | null
          goal_strength?: number | null
          goal_endurance?: number | null
          goal_flexibility?: number | null
          exercise_order?: string | null
          difficulty?: string | null
          card_position_en?: string | null
          card_position_es?: string | null
          card_grip_en?: string | null
          card_grip_es?: string | null
          card_movement_en?: string | null
          card_movement_es?: string | null
          card_target_muscles_en?: string | null
          card_target_muscles_es?: string | null
          card_key_cue_en?: string | null
          card_key_cue_es?: string | null
          card_common_mistake_en?: string | null
          card_common_mistake_es?: string | null
          card_safety_tip_en?: string | null
          card_safety_tip_es?: string | null
          swap_alternatives?: string[] | null
          video_url?: string | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          slug?: string
          name_en?: string
          name_es?: string
          type?: string
          pattern?: string
          muscle_groups?: string[]
          primary_muscle?: string
          equipment_required?: string[] | null
          affects_pain_zones?: string[] | null
          goal_recomposition?: number | null
          goal_strength?: number | null
          goal_endurance?: number | null
          goal_flexibility?: number | null
          exercise_order?: string | null
          difficulty?: string | null
          card_position_en?: string | null
          card_position_es?: string | null
          card_grip_en?: string | null
          card_grip_es?: string | null
          card_movement_en?: string | null
          card_movement_es?: string | null
          card_target_muscles_en?: string | null
          card_target_muscles_es?: string | null
          card_key_cue_en?: string | null
          card_key_cue_es?: string | null
          card_common_mistake_en?: string | null
          card_common_mistake_es?: string | null
          card_safety_tip_en?: string | null
          card_safety_tip_es?: string | null
          swap_alternatives?: string[] | null
          video_url?: string | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: string
          path: string
          referrer: string | null
          user_agent: string | null
          session_id: string | null
          user_id: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          path: string
          referrer?: string | null
          user_agent?: string | null
          session_id?: string | null
          user_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          path?: string
          referrer?: string | null
          user_agent?: string | null
          session_id?: string | null
          user_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          language: string | null
          timezone: string | null
          user_flags: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          language?: string | null
          timezone?: string | null
          user_flags?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          language?: string | null
          timezone?: string | null
          user_flags?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      session_logs: {
        Row: {
          id: string
          user_id: string
          workout_id: string | null
          session_date: string
          started_at: string
          ended_at: string | null
          actual_duration: number | null
          energy_level: string | null
          perceived_difficulty: number | null
          enjoyment: number | null
          mood_after: string | null
          exercises_completed: number | null
          exercises_total: number | null
          total_sets: number | null
          total_reps: number | null
          notes: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          workout_id?: string | null
          session_date: string
          started_at: string
          ended_at?: string | null
          actual_duration?: number | null
          energy_level?: string | null
          perceived_difficulty?: number | null
          enjoyment?: number | null
          mood_after?: string | null
          exercises_completed?: number | null
          exercises_total?: number | null
          total_sets?: number | null
          total_reps?: number | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string | null
          session_date?: string
          started_at?: string
          ended_at?: string | null
          actual_duration?: number | null
          energy_level?: string | null
          perceived_difficulty?: number | null
          enjoyment?: number | null
          mood_after?: string | null
          exercises_completed?: number | null
          exercises_total?: number | null
          total_sets?: number | null
          total_reps?: number | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_logs_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_price_id: string
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean | null
          trial_start_at: string | null
          trial_end_at: string | null
          canceled_at: string | null
          cancellation_reason: string | null
          ended_at: string | null
          cancel_at: string | null
          cancellation_details: Json | null
          price_amount: number | null
          metadata: Json | null
          attribution_data: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_price_id: string
          status: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean | null
          trial_start_at?: string | null
          trial_end_at?: string | null
          canceled_at?: string | null
          cancellation_reason?: string | null
          ended_at?: string | null
          cancel_at?: string | null
          cancellation_details?: Json | null
          price_amount?: number | null
          metadata?: Json | null
          attribution_data?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_price_id?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean | null
          trial_start_at?: string | null
          trial_end_at?: string | null
          canceled_at?: string | null
          cancellation_reason?: string | null
          ended_at?: string | null
          cancel_at?: string | null
          cancellation_details?: Json | null
          price_amount?: number | null
          metadata?: Json | null
          attribution_data?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          goals: string[] | null
          equipment: string[] | null
          pain_zones: string[] | null
          training_days_per_week: number | null
          session_duration: number | null
          workout_type: string | null
          experience_level: string | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          goals?: string[] | null
          equipment?: string[] | null
          pain_zones?: string[] | null
          training_days_per_week?: number | null
          session_duration?: number | null
          workout_type?: string | null
          experience_level?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          goals?: string[] | null
          equipment?: string[] | null
          pain_zones?: string[] | null
          training_days_per_week?: number | null
          session_duration?: number | null
          workout_type?: string | null
          experience_level?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_slug: string
          exercise_order: number
          sets: number
          reps_min: number | null
          reps_max: number | null
          reps_target: number | null
          duration_seconds: number | null
          rest_seconds: number | null
          intensity_rpe: number | null
          notes: string | null
          completed: boolean | null
          actual_sets: number | null
          actual_reps: number[] | null
          actual_weight: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_slug: string
          exercise_order: number
          sets?: number
          reps_min?: number | null
          reps_max?: number | null
          reps_target?: number | null
          duration_seconds?: number | null
          rest_seconds?: number | null
          intensity_rpe?: number | null
          notes?: string | null
          completed?: boolean | null
          actual_sets?: number | null
          actual_reps?: number[] | null
          actual_weight?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_slug?: string
          exercise_order?: number
          sets?: number
          reps_min?: number | null
          reps_max?: number | null
          reps_target?: number | null
          duration_seconds?: number | null
          rest_seconds?: number | null
          intensity_rpe?: number | null
          notes?: string | null
          completed?: boolean | null
          actual_sets?: number | null
          actual_reps?: number[] | null
          actual_weight?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          workout_type: string
          day_order: number
          estimated_duration: number
          scheduled_for: string | null
          status: string | null
          completed_at: string | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          workout_type: string
          day_order: number
          estimated_duration: number
          scheduled_for?: string | null
          status?: string | null
          completed_at?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          workout_type?: string
          day_order?: number
          estimated_duration?: number
          scheduled_for?: string | null
          status?: string | null
          completed_at?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience exports
export type AppSettings = Tables<'app_settings'>
export type AttributionEvent = Tables<'attribution_events'>
export type Customer = Tables<'customers'>
export type EnergyLog = Tables<'energy_logs'>
export type Exercise = Tables<'exercises'>
export type PageView = Tables<'page_views'>
export type Profile = Tables<'profiles'>
export type SessionLog = Tables<'session_logs'>
export type Subscription = Tables<'subscriptions'>
export type UserPreferences = Tables<'user_preferences'>
export type WorkoutExercise = Tables<'workout_exercises'>
export type Workout = Tables<'workouts'>
