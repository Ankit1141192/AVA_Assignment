import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API")
if not api_key:
    raise ValueError("GEMINI_API key not found in environment variables.")

genai.configure(api_key=api_key)

class GeminiService:
    def __init__(self):
        # We use gemini-1.5-flash for speed and multi-modal capabilities
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    async def extract_invoice_data(self, file_content: bytes, mime_type: str):
        """
        Extracts structured JSON data from an invoice image or PDF.
        """
        
        prompt = """
        You are an expert invoice processing AI. Analyze the provided document and extract the following information in valid JSON format.
        
        Required fields:
        - vendor_name (string)
        - invoice_number (string, if available)
        - invoice_date (string, YYYY-MM-DD format if possible)
        - total_amount (number)
        - currency (string, e.g., USD, INR, EUR)
        - tax_amount (number, if available)
        - category (string, e.g., Food, Tech, Utilities, Travel)
        - items (array of objects with: description, quantity, unit_price, total)

        Handle noisy OCR output or missing fields gracefully. If a field is missing, use null or 0 for numbers.
        Return ONLY the raw JSON object.
        """
        
        # Determine if it's an image or PDF for Gemini
        # Gemini 1.5 can handle bytes directly if we wrap them properly
        
        response = self.model.generate_content([
            prompt,
            {
                "mime_type": mime_type,
                "data": file_content
            }
        ])
        
        # Extract JSON from response
        try:
            # Clean possible markdown if present
            text = response.text.replace('```json', '').replace('```', '').strip()
            data = json.loads(text)
            return data
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            return {
                "vendor_name": "Unknown",
                "invoice_date": None,
                "total_amount": 0.0,
                "currency": "USD",
                "items": [],
                "error": "Failed to parse structured data"
            }

gemini_service = GeminiService()
