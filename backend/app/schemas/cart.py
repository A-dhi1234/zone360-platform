from pydantic import BaseModel, Field


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: int


class CartResponse(BaseModel):
    cart_id: int
    user_id: int
    items: list[CartItemResponse]
    total: int