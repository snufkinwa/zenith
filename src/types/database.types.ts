export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          education: string | null;
          website: string | null;
          github: string | null;
          linkedin: string | null;
          skills: string[] | null;
          target_role: string | null;
          preferred_languages: string[] | null;
          solved_problems: {
            easy: number;
            medium: number;
            hard: number;
          } | null;
          study_goal: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          education?: string | null;
          website?: string | null;
          github?: string | null;
          linkedin?: string | null;
          skills?: string[] | null;
          target_role?: string | null;
          preferred_languages?: string[] | null;
          solved_problems?: {
            easy: number;
            medium: number;
            hard: number;
          } | null;
          study_goal?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          education?: string | null;
          website?: string | null;
          github?: string | null;
          linkedin?: string | null;
          skills?: string[] | null;
          target_role?: string | null;
          preferred_languages?: string[] | null;
          solved_problems?: {
            easy: number;
            medium: number;
            hard: number;
          } | null;
          study_goal?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
