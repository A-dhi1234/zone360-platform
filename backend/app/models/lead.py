from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    phone = Column(String(20), nullable=False, index=True)

    email = Column(String(150), nullable=True)

    company_name = Column(String(150), nullable=True)

    source = Column(String(50), nullable=False)

    product_interest = Column(String(50), nullable=True)

    status = Column(String(50), nullable=False, default="new")

    assigned_to = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
)

    assigned_user = relationship("User")

    follow_up_date = Column(DateTime
                            (timezone=True), nullable=True)

    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )