from sqlalchemy import Column, Integer, String, Text, Boolean

from app.db.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    short_name = Column(String(100), nullable=False)

    category = Column(String(100), nullable=False)

    description = Column(Text, nullable=False)

    price = Column(Integer, nullable=False)

    image = Column(String(255), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)