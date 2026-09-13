from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.lead import router as leads_router
from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.customer import router as customer_router

from app.api.routes.product import router as product_router
from app.api.routes.cart import router as cart_router
from app.api.routes.order import router as order_router
from app.api.routes.payment import router as payment_router
app = FastAPI(
    title="Zone 360 Platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://zone360-platform.vercel.app",
        
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(leads_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(customer_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(payment_router)

@app.get("/")
def home():
    return {"message": "Welcome to Zone 360"}