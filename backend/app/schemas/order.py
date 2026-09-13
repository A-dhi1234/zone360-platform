from pydantic import BaseModel


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: int


class OrderResponse(BaseModel):
    order_id: int
    user_id: int
    total_amount: int
    status: str
    items: list[OrderItemResponse]

class OrderStatusUpdate(BaseModel):
    status: str    