import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          founder_name: string | null;
          website: string | null;
          linkedin_profile: string | null;
          startup_info: any;
          credits: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          founder_name?: string | null;
          website?: string | null;
          linkedin_profile?: string | null;
          startup_info?: any;
          credits?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          founder_name?: string | null;
          website?: string | null;
          linkedin_profile?: string | null;
          startup_info?: any;
          credits?: string | null;
          created_at?: string;
        };
      };
      pitch_decks: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          storage_path: string;
          extracted_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          storage_path: string;
          extracted_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          storage_path?: string;
          extracted_text?: string | null;
          created_at?: string;
        };
      };
      pitch_sessions: {
        Row: {
          id: string;
          user_id: string;
          persona: string;
          conversation_history: any;
          final_report: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          persona: string;
          conversation_history?: any;
          final_report?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          persona?: string;
          conversation_history?: any;
          final_report?: any | null;
          created_at?: string;
        };
      };
    };
  };
};