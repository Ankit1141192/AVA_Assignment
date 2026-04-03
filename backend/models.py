from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class InvoiceItem(BaseModel):
    description: str
    quantity: float
    unit_price: float
    total: float

class InvoiceData(BaseModel):
    vendor_name: str
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    total_amount: float
    currency: str = "USD"
    tax_amount: Optional[float] = 0.0
    items: List[InvoiceItem] = []
    category: Optional[str] = "General"

class InvoiceRecord(BaseModel):
    id: str
    file_url: str
    vendor_name: str
    invoice_date: Optional[str]
    total_amount: float
    currency: str
    json_data: dict
    created_at: str

class AnalyticsSummary(BaseModel):
    total_spend: float
    invoice_count: int
    vendor_count: int
    monthly_trends: List[dict]
    vendor_breakdown: List[dict]
