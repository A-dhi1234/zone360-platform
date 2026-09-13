from sqlalchemy import text
from app.db.database import engine


with engine.connect() as connection:
    connection.execute(
        text("""
            ALTER TABLE payments
            ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(150);
        """)
    )
    connection.commit()

print("razorpay_order_id column added successfully!")