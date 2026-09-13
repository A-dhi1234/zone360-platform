from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    short_name: str
    category: str
    description: str
    price: int
    image: str | None = None
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    short_name: str | None = None
    category: str | None = None
    description: str | None = None
    price: int | None = None
    image: str | None = None
    is_active: bool | None = None


class ProductResponse(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)