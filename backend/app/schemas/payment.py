from pydantic import BaseModel


class PaymentCreate(BaseModel):
    order_id: int
    payment_method: str


class PaymentResponse(BaseModel):
    payment_id: int
    order_id: int
    user_id: int
    amount: int
    payment_method: str
    payment_status: str
    transaction_id: str | None

class PaymentVerify(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str