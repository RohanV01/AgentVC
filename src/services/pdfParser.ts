import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface PDFParseResult {
  text: string;
  pageCount: number;
  extractedImages?: string[];
}

class PDFParserService {
  private ocrWorker: any = null;

  async initializeOCR() {
    if (!this.ocrWorker) {
      console.log('🔧 Initializing OCR worker...');
      this.ocrWorker = await createWorker('eng');
      console.log('✅ OCR worker initialized');
    }
    return this.ocrWorker;
  }

  async parsePDF(file: File): Promise<PDFParseResult> {
    try {
      console.log('📄 Starting PDF parsing for:', file.name);
      
      // Convert file to array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log(`📖 PDF loaded with ${pdf.numPages} pages`);
      
      let fullText = '';
      const extractedImages: string[] = [];
      
      // Process each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`🔍 Processing page ${pageNum}/${pdf.numPages}`);
        
        const page = await pdf.getPage(pageNum);
        
        // Extract text content
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();
        
        if (pageText) {
          fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
          console.log(`✅ Extracted ${pageText.length} characters from page ${pageNum}`);
        } else {
          console.log(`⚠️ No text found on page ${pageNum}, trying OCR...`);
          
          // If no text found, try OCR on the page
          try {
            const ocrText = await this.performOCROnPage(page);
            if (ocrText.trim()) {
              fullText += `\n--- Page ${pageNum} (OCR) ---\n${ocrText}\n`;
              console.log(`✅ OCR extracted ${ocrText.length} characters from page ${pageNum}`);
            }
          } catch (ocrError) {
            console.error(`❌ OCR failed for page ${pageNum}:`, ocrError);
          }
        }
      }
      
      const result: PDFParseResult = {
        text: fullText.trim(),
        pageCount: pdf.numPages,
        extractedImages
      };
      
      console.log(`🎉 PDF parsing complete! Extracted ${result.text.length} total characters`);
      return result;
      
    } catch (error) {
      console.error('❌ PDF parsing failed:', error);
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async performOCROnPage(page: any): Promise<string> {
    try {
      // Initialize OCR worker if needed
      await this.initializeOCR();
      
      // Render page to canvas
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to image data for OCR
      const imageData = canvas.toDataURL('image/png');
      
      // Perform OCR
      const { data: { text } } = await this.ocrWorker.recognize(imageData);
      
      return text;
    } catch (error) {
      console.error('OCR processing failed:', error);
      return '';
    }
  }

  async cleanup() {
    if (this.ocrWorker) {
      console.log('🧹 Cleaning up OCR worker...');
      await this.ocrWorker.terminate();
      this.ocrWorker = null;
    }
  }
}

export const pdfParserService = new PDFParserService();