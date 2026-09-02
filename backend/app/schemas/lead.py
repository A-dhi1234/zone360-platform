from pydantic import BaseModel, EmailStr
from typing import Optional


class LeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    source: str
    product_interest: Optional[str] = None
    notes: Optional[str] = None