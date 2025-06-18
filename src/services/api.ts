import { supabase } from '../lib/supabase';
import { pdfParserService, PDFParseResult } from './pdfParser';

class ApiService {
  async uploadPitchDeck(file: File): Promise<{ deckId: string; fileName: string; storagePath: string; extractedText?: string }> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      console.log('🚀 Starting pitch deck upload and processing...');

      // Parse PDF and extract text using OCR
      let extractedText = '';
      try {
        console.log('📄 Parsing PDF content...');
        const parseResult: PDFParseResult = await pdfParserService.parsePDF(file);
        extractedText = parseResult.text;
        console.log(`✅ Successfully extracted ${extractedText.length} characters from PDF`);
      } catch (parseError) {
        console.error('⚠️ PDF parsing failed, continuing with upload:', parseError);
        // Continue with upload even if parsing fails
      }

      // Create unique file path
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storagePath = `${user.id}/${fileName}`;

      console.log('📤 Uploading file to storage:', fileName);

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pitch-decks')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('✅ File uploaded to storage successfully');

      // Insert record into pitch_decks table with extracted text
      const { data: deckData, error: deckError } = await supabase
        .from('pitch_decks')
        .insert({
          user_id: user.id,
          file_name: file.name,
          storage_path: storagePath,
          extracted_text: extractedText || null
        })
        .select()
        .single();

      if (deckError) {
        console.error('❌ Database insert error:', deckError);
        
        // Clean up uploaded file if database insert fails
        await supabase.storage
          .from('pitch-decks')
          .remove([storagePath]);
        
        throw new Error(`Database error: ${deckError.message}`);
      }

      console.log('🎉 Pitch deck record created successfully with extracted text');

      // Clean up OCR resources
      await pdfParserService.cleanup();

      return {
        deckId: deckData.id,
        fileName: file.name,
        storagePath: storagePath,
        extractedText: extractedText
      };
    } catch (error) {
      console.error('❌ Upload pitch deck error:', error);
      // Clean up OCR resources on error
      await pdfParserService.cleanup();
      throw error;
    }
  }

  async getPitchDecks(): Promise<any[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pitch decks:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get pitch decks error:', error);
      throw error;
    }
  }

  async deletePitchDeck(deckId: string): Promise<void> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // First get the deck to find the storage path
      const { data: deck, error: fetchError } = await supabase
        .from('pitch_decks')
        .select('storage_path')
        .eq('id', deckId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !deck) {
        throw new Error('Pitch deck not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('pitch-decks')
        .remove([deck.storage_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage fails
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('pitch_decks')
        .delete()
        .eq('id', deckId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      console.log('Pitch deck deleted successfully');
    } catch (error) {
      console.error('Delete pitch deck error:', error);
      throw error;
    }
  }

  async getDownloadUrl(storagePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('pitch-decks')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      if (error) {
        throw new Error(error.message);
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Get download URL error:', error);
      throw error;
    }
  }

  // Placeholder methods for future backend integration
  async startPitchSession(persona: string): Promise<any> {
    throw new Error('Backend not implemented yet. Pitch session functionality will be available when backend is ready.');
  }

  async submitFounderIntroduction(sessionId: string, audioBlob: Blob, duration?: number): Promise<any> {
    throw new Error('Backend not implemented yet. Audio processing will be available when backend is ready.');
  }

  async submitPitch(sessionId: string, audioBlob: Blob, duration?: number): Promise<any> {
    throw new Error('Backend not implemented yet. Audio processing will be available when backend is ready.');
  }

  async generateQuestion(sessionId: string): Promise<any> {
    throw new Error('Backend not implemented yet. AI question generation will be available when backend is ready.');
  }

  async submitAnswer(sessionId: string, audioBlob: Blob, duration?: number): Promise<any> {
    throw new Error('Backend not implemented yet. Audio processing will be available when backend is ready.');
  }

  async endSession(sessionId: string): Promise<any> {
    throw new Error('Backend not implemented yet. Session analysis will be available when backend is ready.');
  }

  async getVideoStatus(videoId: string): Promise<any> {
    throw new Error('Backend not implemented yet. Video generation will be available when backend is ready.');
  }

  async getSessionHistory(): Promise<{ sessions: any[] }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('pitch_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return { sessions: data || [] };
    } catch (error) {
      console.error('Get session history error:', error);
      throw error;
    }
  }

  async getStockReplicas(): Promise<{ replicas: any[] }> {
    throw new Error('Backend not implemented yet. Video replica functionality will be available when backend is ready.');
  }
}

export const apiService = new ApiService();