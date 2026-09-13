import os

import razorpay
from dotenv import load_dotenv

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise RuntimeError(
        "Razorpay credentials are missing from .env"
    )

client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)


def create_razorpay_order(
    amount: int,
    receipt: str
):
    amount_in_paise = amount * 100

    data = {
        "amount": amount_in_paise,
        "currency": "INR",
        "receipt": receipt,
    }

    razorpay_order = client.order.create(
        data=data
    )

    return razorpay_order


def verify_razorpay_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str
):
    data = {
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": razorpay_payment_id,
        "razorpay_signature": razorpay_signature,
    }

    return client.utility.verify_payment_signature(data)


def verify_razorpay_webhook(
    webhook_body: str,
    webhook_signature: str
):
    if not RAZORPAY_WEBHOOK_SECRET:
        raise RuntimeError(
            "Razorpay webhook secret is not configured"
        )

    return client.utility.verify_webhook_signature(
        webhook_body,
        webhook_signature,
        RAZORPAY_WEBHOOK_SECRET
    )