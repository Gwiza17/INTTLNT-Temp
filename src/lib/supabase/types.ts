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
  public: {
    Tables: {
      applicants: {
        Row: {
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          degree_certificate_url: string | null
          email: string
          full_name: string
          gpa: number | null
          id: string
          ielts_result_url: string | null
          ielts_score: number | null
          ielts_status: string | null
          intake_preference: string | null
          is_skilled_couple: boolean | null
          partner_docs: Json | null
          passport_url: string | null
          pathway_destination: string | null
          pathway_discipline: string | null
          proof_of_funds_type: string | null
          proof_of_funds_url: string | null
          referring_partner_code: string | null
          transcripts_url: string | null
          updated_at: string | null
          user_id: string | null
          whatsapp: string | null
          work_experience_years: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          degree_certificate_url?: string | null
          email: string
          full_name: string
          gpa?: number | null
          id?: string
          ielts_result_url?: string | null
          ielts_score?: number | null
          ielts_status?: string | null
          intake_preference?: string | null
          is_skilled_couple?: boolean | null
          partner_docs?: Json | null
          passport_url?: string | null
          pathway_destination?: string | null
          pathway_discipline?: string | null
          proof_of_funds_type?: string | null
          proof_of_funds_url?: string | null
          referring_partner_code?: string | null
          transcripts_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string | null
          work_experience_years?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          degree_certificate_url?: string | null
          email?: string
          full_name?: string
          gpa?: number | null
          id?: string
          ielts_result_url?: string | null
          ielts_score?: number | null
          ielts_status?: string | null
          intake_preference?: string | null
          is_skilled_couple?: boolean | null
          partner_docs?: Json | null
          passport_url?: string | null
          pathway_destination?: string | null
          pathway_discipline?: string | null
          proof_of_funds_type?: string | null
          proof_of_funds_url?: string | null
          referring_partner_code?: string | null
          transcripts_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string | null
          work_experience_years?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          case_id: string | null
          created_at: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          case_id?: string | null
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          case_id?: string | null
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_assignments: {
        Row: {
          assigned_at: string | null
          case_id: string
          stakeholder_id: string
        }
        Insert: {
          assigned_at?: string | null
          case_id: string
          stakeholder_id: string
        }
        Update: {
          assigned_at?: string | null
          case_id?: string
          stakeholder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_assignments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_assignments_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          applicant_id: string
          created_at: string | null
          current_stage_id: string
          documents_status: string | null
          forecast_status: Database["public"]["Enums"]["forecast_status"] | null
          id: string
          notes: string | null
          selected_pathway: string
          sla_due_at: string | null
          stage_entered_at: string | null
          stage_owner_role: Database["public"]["Enums"]["user_role"] | null
          stage_owner_user_id: string | null
          target_intake: string
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          current_stage_id: string
          documents_status?: string | null
          forecast_status?:
            | Database["public"]["Enums"]["forecast_status"]
            | null
          id?: string
          notes?: string | null
          selected_pathway: string
          sla_due_at?: string | null
          stage_entered_at?: string | null
          stage_owner_role?: Database["public"]["Enums"]["user_role"] | null
          stage_owner_user_id?: string | null
          target_intake: string
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          current_stage_id?: string
          documents_status?: string | null
          forecast_status?:
            | Database["public"]["Enums"]["forecast_status"]
            | null
          id?: string
          notes?: string | null
          selected_pathway?: string
          sla_due_at?: string | null
          stage_entered_at?: string | null
          stage_owner_role?: Database["public"]["Enums"]["user_role"] | null
          stage_owner_user_id?: string | null
          target_intake?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          case_id: string
          document_type: string
          file_path: string
          id: string
          owner_type: string | null
          updated_at: string | null
          uploaded_at: string | null
          verified_status: boolean | null
        }
        Insert: {
          case_id: string
          document_type: string
          file_path: string
          id?: string
          owner_type?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          verified_status?: boolean | null
        }
        Update: {
          case_id?: string
          document_type?: string
          file_path?: string
          id?: string
          owner_type?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          verified_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ielts_alerts: {
        Row: {
          city: string
          country: string
          created_at: string | null
          date_range_end: string | null
          date_range_start: string | null
          email: string | null
          id: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          email?: string | null
          id?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          email?: string | null
          id?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      ielts_assessments: {
        Row: {
          country: string
          created_at: string | null
          current_band: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string
          status: string | null
          target_band: string
          test_timeline: string
          updated_at: string | null
          weakest_area: string
        }
        Insert: {
          country: string
          created_at?: string | null
          current_band?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          status?: string | null
          target_band: string
          test_timeline: string
          updated_at?: string | null
          weakest_area: string
        }
        Update: {
          country?: string
          created_at?: string | null
          current_band?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          status?: string | null
          target_band?: string
          test_timeline?: string
          updated_at?: string | null
          weakest_area?: string
        }
        Relationships: []
      }
      ielts_availability: {
        Row: {
          city: string
          country: string
          exam_date: string
          id: string
          last_checked_at: string | null
          provider: string | null
          seats_status: string | null
          source_url: string | null
          test_type: string | null
        }
        Insert: {
          city: string
          country: string
          exam_date: string
          id?: string
          last_checked_at?: string | null
          provider?: string | null
          seats_status?: string | null
          source_url?: string | null
          test_type?: string | null
        }
        Update: {
          city?: string
          country?: string
          exam_date?: string
          id?: string
          last_checked_at?: string | null
          provider?: string | null
          seats_status?: string | null
          source_url?: string | null
          test_type?: string | null
        }
        Relationships: []
      }
      ielts_availability_requests: {
        Row: {
          city: string
          country: string
          created_at: string | null
          email: string
          exam_type: string
          full_name: string
          id: string
          notes: string | null
          phone: string
          preferred_month: string
          status: string | null
          updated_at: string | null
          urgency: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          email: string
          exam_type: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          preferred_month: string
          status?: string | null
          updated_at?: string | null
          urgency: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          email?: string
          exam_type?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          preferred_month?: string
          status?: string | null
          updated_at?: string | null
          urgency?: string
        }
        Relationships: []
      }
      partner_demo_requests: {
        Row: {
          business_type: string
          country: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          monthly_leads: string | null
          notes: string | null
          organization: string | null
          phone: string
          preferred_contact_method: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          business_type: string
          country: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          monthly_leads?: string | null
          notes?: string | null
          organization?: string | null
          phone: string
          preferred_contact_method: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          business_type?: string
          country?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          monthly_leads?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string
          preferred_contact_method?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_invites: {
        Row: {
          created_at: string | null
          custom_message: string | null
          email: string
          error_message: string | null
          id: string
          referral_link: string
          sent_at: string | null
          stakeholder_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          custom_message?: string | null
          email: string
          error_message?: string | null
          id?: string
          referral_link: string
          sent_at?: string | null
          stakeholder_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          custom_message?: string | null
          email?: string
          error_message?: string | null
          id?: string
          referral_link?: string
          sent_at?: string | null
          stakeholder_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_invites_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "stakeholders"
            referencedColumns: ["id"]
          },
        ]
      }
      stages: {
        Row: {
          created_at: string | null
          default_owner_role: Database["public"]["Enums"]["user_role"] | null
          default_sla_days: number
          description: string | null
          id: string
          name: string
          order: number
          required_artifacts: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_owner_role?: Database["public"]["Enums"]["user_role"] | null
          default_sla_days?: number
          description?: string | null
          id?: string
          name: string
          order: number
          required_artifacts?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_owner_role?: Database["public"]["Enums"]["user_role"] | null
          default_sla_days?: number
          description?: string | null
          id?: string
          name?: string
          order?: number
          required_artifacts?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      stakeholders: {
        Row: {
          address: string | null
          applicant_type: string | null
          city: string | null
          contact_person_name: string | null
          contact_person_role: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          id: string
          name: string
          nationality: string | null
          org: string | null
          organization_country: string | null
          other_type_description: string | null
          partner_code: string | null
          passport_number: string | null
          permissions: Json | null
          phone: string | null
          preferred_contact_method: string | null
          registration_number: string | null
          roles: Database["public"]["Enums"]["user_role"][]
          status: Database["public"]["Enums"]["stakeholder_status"] | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          applicant_type?: string | null
          city?: string | null
          contact_person_name?: string | null
          contact_person_role?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          id?: string
          name: string
          nationality?: string | null
          org?: string | null
          organization_country?: string | null
          other_type_description?: string | null
          partner_code?: string | null
          passport_number?: string | null
          permissions?: Json | null
          phone?: string | null
          preferred_contact_method?: string | null
          registration_number?: string | null
          roles?: Database["public"]["Enums"]["user_role"][]
          status?: Database["public"]["Enums"]["stakeholder_status"] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          applicant_type?: string | null
          city?: string | null
          contact_person_name?: string | null
          contact_person_role?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          id?: string
          name?: string
          nationality?: string | null
          org?: string | null
          organization_country?: string | null
          other_type_description?: string | null
          partner_code?: string | null
          passport_number?: string | null
          permissions?: Json | null
          phone?: string | null
          preferred_contact_method?: string | null
          registration_number?: string | null
          roles?: Database["public"]["Enums"]["user_role"][]
          status?: Database["public"]["Enums"]["stakeholder_status"] | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_applicant_id: { Args: { uid: string }; Returns: string }
      has_role: {
        Args: { r: Database["public"]["Enums"]["user_role"]; uid: string }
        Returns: boolean
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { uid: string }; Returns: boolean }
      is_assigned_stakeholder: {
        Args: { cid: string; uid: string }
        Returns: boolean
      }
      uuid_generate_v1: { Args: never; Returns: string }
      uuid_generate_v1mc: { Args: never; Returns: string }
      uuid_generate_v3: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_generate_v4: { Args: never; Returns: string }
      uuid_generate_v5: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_nil: { Args: never; Returns: string }
      uuid_ns_dns: { Args: never; Returns: string }
      uuid_ns_oid: { Args: never; Returns: string }
      uuid_ns_url: { Args: never; Returns: string }
      uuid_ns_x500: { Args: never; Returns: string }
    }
    Enums: {
      forecast_status: "on_track" | "at_risk" | "missed"
      stakeholder_status: "pending" | "approved" | "suspended"
      user_role:
        | "admin"
        | "applicant"
        | "channel_partner"
        | "funder"
        | "migration_agent"
        | "education_provider"
        | "employer"
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
    Enums: {
      forecast_status: ["on_track", "at_risk", "missed"],
      stakeholder_status: ["pending", "approved", "suspended"],
      user_role: [
        "admin",
        "applicant",
        "channel_partner",
        "funder",
        "migration_agent",
        "education_provider",
        "employer",
      ],
    },
  },
} as const
