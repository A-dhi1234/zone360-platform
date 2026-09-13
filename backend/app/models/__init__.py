from app.db.database import Base, engine

from app.models.customer import Customer
from app.models.lead import Lead
from app.models.role import Role
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    create_tables()