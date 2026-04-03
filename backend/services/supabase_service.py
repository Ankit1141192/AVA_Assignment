import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseService:
    def __init__(self):
        url: str = os.getenv("Supabase_URL")
        key: str = os.getenv("Supabase_Anon_Key")
        if not url or "your-supabase-url" in url:
            # Note: The app will fail if these are placeholders
            print("Supabase credentials not configured correctly.")
            self.client = None
        else:
            self.client: Client = create_client(url, key)

    async def upload_file(self, file_name: str, file_content: bytes, mime_type: str):
        """
        Uploads a file to Supabase Storage in the 'invoices' bucket.
        Returns the public URL of the uploaded file.
        """
        if not self.client: return None
        
        # Ensure the bucket is 'invoices'
        try:
            # Upload to 'invoices' bucket
            storage = self.client.storage.from_("invoices")
            storage.upload(file_name, file_content, {"content-type": mime_type})
            
            # Get public URL
            response = storage.get_public_url(file_name)
            return response
        except Exception as e:
            print(f"Supabase Storage Upload Error: {e}")
            return None

    def save_invoice(self, invoice_data: dict):
        """
        Saves the structured invoice data to the 'invoices' table.
        """
        if not self.client: return None
        
        try:
            # Prepare data for insertion
            record = {
                "vendor_name": invoice_data.get("vendor_name"),
                "invoice_number": invoice_data.get("invoice_number"),
                "invoice_date": invoice_data.get("invoice_date"),
                "total_amount": invoice_data.get("total_amount"),
                "currency": invoice_data.get("currency"),
                "json_data": invoice_data, # Store the full object
                "file_url": invoice_data.get("file_url")
            }
            
            response = self.client.table("invoices").insert(record).execute()
            return response.data
        except Exception as e:
            print(f"Supabase DB Insert Error: {e}")
            return None

    def get_all_invoices(self):
        """
        Fetches all invoices ordered by newest first.
        """
        if not self.client: return []
        try:
            response = self.client.table("invoices").select("*").order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            print(f"Supabase DB Fetch Error: {e}")
            return []

    def get_analytics(self):
        """
        Aggregates metrics for the dashboard.
        """
        if not self.client: return {}
        try:
            # Fetch all data
            data = self.get_all_invoices()
            
            total_spend = sum(item.get("total_amount", 0) for item in data)
            invoice_count = len(data)
            unique_vendors = len(set(item.get("vendor_name") for item in data))
            
            # Simple aggregation by category if exists in json_data
            # We'll return the list and let frontend handle trends for now
            return {
                "total_spend": total_spend,
                "invoice_count": invoice_count,
                "vendor_count": unique_vendors,
                "invoices": data
            }
        except Exception as e:
            print(f"Analytics aggregation error: {e}")
            return {}

supabase_service = SupabaseService()
