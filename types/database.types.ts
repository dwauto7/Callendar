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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_confirmed: boolean | null
          appointment_date: string | null
          appointment_time: string | null
          appointment_type: string | null
          buying_signals: boolean | null
          call_duration_seconds: number | null
          call_id: string | null
          clinic_id: string | null
          created_at: string | null
          email: string | null
          google_event_id: string | null
          id: string
          invoice_amount: number | null
          invoiced: boolean | null
          patient_name: string | null
          patient_status: string | null
          patient_type: string | null
          phone: string | null
          projected_revenue: number | null
          promo_offered: boolean | null
          promo_text_used: string | null
          qualification_score: string | null
          qualified_at: string | null
          reminder_sent: boolean | null
          reminder_sent_1hr: boolean | null
          sentiment_tag: string | null
          service_category: string | null
          status: string | null
          transcript: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_confirmed?: boolean | null
          appointment_date?: string | null
          appointment_time?: string | null
          appointment_type?: string | null
          buying_signals?: boolean | null
          call_duration_seconds?: number | null
          call_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          email?: string | null
          google_event_id?: string | null
          id?: string
          invoice_amount?: number | null
          invoiced?: boolean | null
          patient_name?: string | null
          patient_status?: string | null
          patient_type?: string | null
          phone?: string | null
          projected_revenue?: number | null
          promo_offered?: boolean | null
          promo_text_used?: string | null
          qualification_score?: string | null
          qualified_at?: string | null
          reminder_sent?: boolean | null
          reminder_sent_1hr?: boolean | null
          sentiment_tag?: string | null
          service_category?: string | null
          status?: string | null
          transcript?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_confirmed?: boolean | null
          appointment_date?: string | null
          appointment_time?: string | null
          appointment_type?: string | null
          buying_signals?: boolean | null
          call_duration_seconds?: number | null
          call_id?: string | null
          clinic_id?: string | null
          created_at?: string | null
          email?: string | null
          google_event_id?: string | null
          id?: string
          invoice_amount?: number | null
          invoiced?: boolean | null
          patient_name?: string | null
          patient_status?: string | null
          patient_type?: string | null
          phone?: string | null
          projected_revenue?: number | null
          promo_offered?: boolean | null
          promo_text_used?: string | null
          qualification_score?: string | null
          qualified_at?: string | null
          reminder_sent?: boolean | null
          reminder_sent_1hr?: boolean | null
          sentiment_tag?: string | null
          service_category?: string | null
          status?: string | null
          transcript?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinic_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "global_stats"
            referencedColumns: ["clinic_config_id"]
          },
        ]
      }
      call_logs: {
        Row: {
          appointment_id: string | null
          call_id: string
          client_name: string | null
          clinic_config_id: string | null
          created_at: string | null
          duration_min: number | null
          duration_secs: number | null
          id: string
          is_after_hours: boolean | null
          minutes_saved: number | null
          monthly_reports: string | null
          patient_phone: string | null
          recording_url: string | null
          summary: string | null
          transcript: string | null
        }
        Insert: {
          appointment_id?: string | null
          call_id: string
          client_name?: string | null
          clinic_config_id?: string | null
          created_at?: string | null
          duration_min?: number | null
          duration_secs?: number | null
          id?: string
          is_after_hours?: boolean | null
          minutes_saved?: number | null
          monthly_reports?: string | null
          patient_phone?: string | null
          recording_url?: string | null
          summary?: string | null
          transcript?: string | null
        }
        Update: {
          appointment_id?: string | null
          call_id?: string
          client_name?: string | null
          clinic_config_id?: string | null
          created_at?: string | null
          duration_min?: number | null
          duration_secs?: number | null
          id?: string
          is_after_hours?: boolean | null
          minutes_saved?: number | null
          monthly_reports?: string | null
          patient_phone?: string | null
          recording_url?: string | null
          summary?: string | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "clinic_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "global_stats"
            referencedColumns: ["clinic_config_id"]
          },
        ]
      }
      clinic_configs: {
        Row: {
          agent_id: string | null
          billing_status: string | null
          clinic_address: string | null
          clinic_logo_url: string | null
          clinic_name: string
          clinic_phone: string | null
          clinic_type: string | null
          clinic_website: string | null
          clinic_whatsapp: string | null
          created_at: string | null
          google_calendar_id: string | null
          id: string
          is_active: boolean | null
          owner_email: string | null
          owner_phone: string | null
          plan_type: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          billing_status?: string | null
          clinic_address?: string | null
          clinic_logo_url?: string | null
          clinic_name: string
          clinic_phone?: string | null
          clinic_type?: string | null
          clinic_website?: string | null
          clinic_whatsapp?: string | null
          created_at?: string | null
          google_calendar_id?: string | null
          id?: string
          is_active?: boolean | null
          owner_email?: string | null
          owner_phone?: string | null
          plan_type?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          billing_status?: string | null
          clinic_address?: string | null
          clinic_logo_url?: string | null
          clinic_name?: string
          clinic_phone?: string | null
          clinic_type?: string | null
          clinic_website?: string | null
          clinic_whatsapp?: string | null
          created_at?: string | null
          google_calendar_id?: string | null
          id?: string
          is_active?: boolean | null
          owner_email?: string | null
          owner_phone?: string | null
          plan_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      clinic_holidays: {
        Row: {
          clinic_config_id: string | null
          created_at: string | null
          description: string | null
          holiday_date: string
          id: string
          is_recurring: boolean | null
        }
        Insert: {
          clinic_config_id?: string | null
          created_at?: string | null
          description?: string | null
          holiday_date: string
          id?: string
          is_recurring?: boolean | null
        }
        Update: {
          clinic_config_id?: string | null
          created_at?: string | null
          description?: string | null
          holiday_date?: string
          id?: string
          is_recurring?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "clinic_holidays_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "clinic_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_holidays_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "global_stats"
            referencedColumns: ["clinic_config_id"]
          },
        ]
      }
      clinic_settings: {
        Row: {
          ai_name: string | null
          ai_tone: string | null
          answering_mode: string | null
          clinic_config_id: string | null
          created_at: string | null
          emergency_contact: string | null
          id: string
          timezone: string | null
          whatsapp_reminders_enabled: boolean | null
          working_days: string | null
          working_hours: string | null
        }
        Insert: {
          ai_name?: string | null
          ai_tone?: string | null
          answering_mode?: string | null
          clinic_config_id?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          id?: string
          timezone?: string | null
          whatsapp_reminders_enabled?: boolean | null
          working_days?: string | null
          working_hours?: string | null
        }
        Update: {
          ai_name?: string | null
          ai_tone?: string | null
          answering_mode?: string | null
          clinic_config_id?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          id?: string
          timezone?: string | null
          whatsapp_reminders_enabled?: boolean | null
          working_days?: string | null
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinic_settings_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "clinic_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_settings_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "global_stats"
            referencedColumns: ["clinic_config_id"]
          },
        ]
      }
      clinic_users: {
        Row: {
          clinic_config_id: string | null
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          clinic_config_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          clinic_config_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinic_users_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "clinic_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_users_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "global_stats"
            referencedColumns: ["clinic_config_id"]
          },
        ]
      }
      credits: {
        Row: {
          agent_id: string | null
          balance: number | null
          clinic_config_id: string | null
          clinic_name: string | null
          clinic_whatsapp: string | null
          created_at: string | null
          id: string
          minutes_used: number | null
          status: string | null
          system_enabled: boolean | null
          total_credits_mins: number | null
        }
        Insert: {
          agent_id?: string | null
          balance?: number | null
          clinic_config_id?: string | null
          clinic_name?: string | null
          clinic_whatsapp?: string | null
          created_at?: string | null
          id?: string
          minutes_used?: number | null
          status?: string | null
          system_enabled?: boolean | null
          total_credits_mins?: number | null
        }
        Update: {
          agent_id?: string | null
          balance?: number | null
          clinic_config_id?: string | null
          clinic_name?: string | null
          clinic_whatsapp?: string | null
          created_at?: string | null
          id?: string
          minutes_used?: number | null
          status?: string | null
          system_enabled?: boolean | null
          total_credits_mins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "credits_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: true
            referencedRelation: "clinic_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: true
            referencedRelation: "global_stats"
            referencedColumns: ["clinic_config_id"]
          },
        ]
      }
      demo_leads: {
        Row: {
          clinic_name: string | null
          created_at: string | null
          demo_call: boolean | null
          doctor_count: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: string | null
          satisfaction_score: string | null
          weekly_call_volume: string | null
        }
        Insert: {
          clinic_name?: string | null
          created_at?: string | null
          demo_call?: boolean | null
          doctor_count?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          satisfaction_score?: string | null
          weekly_call_volume?: string | null
        }
        Update: {
          clinic_name?: string | null
          created_at?: string | null
          demo_call?: boolean | null
          doctor_count?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          satisfaction_score?: string | null
          weekly_call_volume?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          address: string | null
          category: string | null
          company_name: string | null
          created_at: string | null
          decision_maker: string | null
          demo_requested: boolean | null
          id: string
          key_insights: string | null
          pain_points: string | null
          personalized_message: string | null
          phone: string | null
          qualification_score: number | null
          rating: number | null
          reviews_count: number | null
          status: string | null
          wa_sent: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          company_name?: string | null
          created_at?: string | null
          decision_maker?: string | null
          demo_requested?: boolean | null
          id?: string
          key_insights?: string | null
          pain_points?: string | null
          personalized_message?: string | null
          phone?: string | null
          qualification_score?: number | null
          rating?: number | null
          reviews_count?: number | null
          status?: string | null
          wa_sent?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          company_name?: string | null
          created_at?: string | null
          decision_maker?: string | null
          demo_requested?: boolean | null
          id?: string
          key_insights?: string | null
          pain_points?: string | null
          personalized_message?: string | null
          phone?: string | null
          qualification_score?: number | null
          rating?: number | null
          reviews_count?: number | null
          status?: string | null
          wa_sent?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      monthly_reports: {
        Row: {
          clinic_config_id: string | null
          created_at: string | null
          gross_revenue_generated: number | null
          id: string
          report_month: string | null
          report_period: string
          total_bookings: number | null
          total_calls: number | null
          total_minutes_used: number | null
          total_monthly_investment: number | null
        }
        Insert: {
          clinic_config_id?: string | null
          created_at?: string | null
          gross_revenue_generated?: number | null
          id?: string
          report_month?: string | null
          report_period: string
          total_bookings?: number | null
          total_calls?: number | null
          total_minutes_used?: number | null
          total_monthly_investment?: number | null
        }
        Update: {
          clinic_config_id?: string | null
          created_at?: string | null
          gross_revenue_generated?: number | null
          id?: string
          report_month?: string | null
          report_period?: string
          total_bookings?: number | null
          total_calls?: number | null
          total_minutes_used?: number | null
          total_monthly_investment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_reports_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "clinic_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_reports_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "global_stats"
            referencedColumns: ["clinic_config_id"]
          },
        ]
      }
      service_pricing: {
        Row: {
          clinic_config_id: string
          created_at: string | null
          id: string
          price: number
          service_name: string
        }
        Insert: {
          clinic_config_id: string
          created_at?: string | null
          id?: string
          price: number
          service_name: string
        }
        Update: {
          clinic_config_id?: string
          created_at?: string | null
          id?: string
          price?: number
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_pricing_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "clinic_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_pricing_clinic_config_id_fkey"
            columns: ["clinic_config_id"]
            isOneToOne: false
            referencedRelation: "global_stats"
            referencedColumns: ["clinic_config_id"]
          },
        ]
      }
    }
    Views: {
      global_stats: {
        Row: {
          clinic_config_id: string | null
          clinic_name: string | null
          credit_balance: number | null
          is_active: boolean | null
          minutes_used: number | null
          total_credits_mins: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_clinic_access: {
        Args: { target_clinic_id: string }
        Returns: boolean
      }
      create_clinic_on_onboarding: {
        Args: {
          p_clinic_name: string
          p_clinic_whatsapp: string
          p_user_id: string
        }
        Returns: string
      }
      deduct_credits: {
        Args: { p_agent_id: string; p_duration_min: number }
        Returns: undefined
      }
      get_my_clinic_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_clinic_owner: { Args: { target_clinic_id: string }; Returns: boolean }
      refresh_monthly_report: {
        Args: { p_clinic_config_id: string }
        Returns: undefined
      }
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
