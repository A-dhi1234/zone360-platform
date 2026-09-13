from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.payment import Payment
from app.models.order import Order
from app.models.user import User
from app.auth.security import get_current_user
from app.schemas.payment import PaymentCreate, PaymentVerify
from app.services.razorpay_service import (
    create_razorpay_order,
    verify_razorpay_payment,
    verify_razorpay_webhook,
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post("/")
def create_payment(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(
            Order.id == payment_data.order_id,
            Order.user_id == current_user.id
        )
        .first()
    )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    existing_payment = (
        db.query(Payment)
        .filter(Payment.order_id == order.id)
        .first()
    )

    if existing_payment:
        raise HTTPException(
            status_code=400,
            detail="Payment already exists for this order"
        )

    try:
        razorpay_order = create_razorpay_order(
            amount=order.total_amount,
            receipt=f"zone360_order_{order.id}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Razorpay order creation failed: {str(e)}"
        )

    payment = Payment(
        order_id=order.id,
        user_id=current_user.id,
        amount=order.total_amount,
        payment_method=payment_data.payment_method,
        payment_status="pending",
        razorpay_order_id=razorpay_order["id"]
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "message": "Razorpay order created successfully",
        "payment_id": payment.id,
        "order_id": payment.order_id,
        "amount": payment.amount,
        "payment_method": payment.payment_method,
        "payment_status": payment.payment_status,
        "razorpay_order_id": payment.razorpay_order_id,
        "razorpay_amount": razorpay_order["amount"],
        "razorpay_currency": razorpay_order["currency"]
    }


@router.post("/verify")
def verify_payment(
    payment_data: PaymentVerify,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.razorpay_order_id == payment_data.razorpay_order_id,
            Payment.user_id == current_user.id
        )
        .first()
    )

    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    try:
        verify_razorpay_payment(
            razorpay_order_id=payment_data.razorpay_order_id,
            razorpay_payment_id=payment_data.razorpay_payment_id,
            razorpay_signature=payment_data.razorpay_signature
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Payment verification failed"
        )

    payment.payment_status = "paid"
    payment.transaction_id = payment_data.razorpay_payment_id

    order = (
        db.query(Order)
        .filter(Order.id == payment.order_id)
        .first()
    )

    if order:
        order.status = "confirmed"

    db.commit()
    db.refresh(payment)

    return {
        "message": "Payment verified successfully",
        "payment_id": payment.id,
        "order_id": payment.order_id,
        "payment_status": payment.payment_status,
        "transaction_id": payment.transaction_id,
        "order_status": order.status if order else None
    }


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    webhook_body = await request.body()

    webhook_signature = request.headers.get(
        "X-Razorpay-Signature"
    )

    if not webhook_signature:
        raise HTTPException(
            status_code=400,
            detail="Missing Razorpay webhook signature"
        )

    try:
        verify_razorpay_webhook(
            webhook_body.decode("utf-8"),
            webhook_signature
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid webhook signature"
        )

    event = await request.json()

    event_name = event.get("event")

    if event_name == "payment.captured":
        payment_entity = (
            event.get("payload", {})
            .get("payment", {})
            .get("entity", {})
        )

        razorpay_payment_id = payment_entity.get("id")
        razorpay_order_id = payment_entity.get("order_id")

        if razorpay_payment_id and razorpay_order_id:

            payment = (
                db.query(Payment)
                .filter(
                    Payment.razorpay_order_id == razorpay_order_id
                )
                .first()
            )

            if payment:

                payment.payment_status = "paid"
                payment.transaction_id = razorpay_payment_id

                order = (
                    db.query(Order)
                    .filter(Order.id == payment.order_id)
                    .first()
                )

                if order:
                    order.status = "confirmed"

                db.commit()

    return {
        "message": "Webhook received successfully"
    }