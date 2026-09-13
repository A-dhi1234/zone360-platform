from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.customer import Customer
from app.models.user import User
from app.auth.security import get_current_user


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


# =====================================================
# GET MY PROFILE
# CUSTOMER ONLY
# =====================================================

@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    customer = (
        db.query(Customer)
        .filter(Customer.user_id == current_user.id)
        .first()
    )

    if customer is None:
        customer = Customer(
            user_id=current_user.id
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "address": customer.address,
        "city": customer.city,
        "state": customer.state,
        "pincode": customer.pincode
    }


# =====================================================
# UPDATE MY PROFILE
# CUSTOMER ONLY
# =====================================================

@router.put("/me")
def update_my_profile(
    address: str | None = None,
    city: str | None = None,
    state: str | None = None,
    pincode: str | None = None,
    phone: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    customer = (
        db.query(Customer)
        .filter(Customer.user_id == current_user.id)
        .first()
    )

    if customer is None:
        customer = Customer(
            user_id=current_user.id
        )

        db.add(customer)

    if address is not None:
        customer.address = address

    if city is not None:
        customer.city = city

    if state is not None:
        customer.state = state

    if pincode is not None:
        customer.pincode = pincode

    if phone is not None:
        current_user.phone = phone

    db.commit()
    db.refresh(customer)

    return {
        "message": "Customer profile updated successfully"
    }