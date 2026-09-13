from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.auth.security import get_current_user
from app.schemas.cart import CartItemCreate


router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)
@router.get("/")
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Find the customer's cart
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    # 2. If cart doesn't exist, return an empty cart
    if cart is None:
        return {
            "cart_id": None,
            "user_id": current_user.id,
            "items": [],
            "total": 0
        }

    # 3. Get all items in the cart
    cart_items = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id)
        .all()
    )

    # 4. Prepare cart items
    items = []
    total = 0

    for item in cart_items:
        item_total = item.price * item.quantity
        total += item_total

        items.append({
            "id": item.id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": item.price
        })

    # 5. Return cart details
    return {
        "cart_id": cart.id,
        "user_id": current_user.id,
        "items": items,
        "total": total
    }


@router.post("/items")
def add_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Check whether the product exists and is active
    product = (
        db.query(Product)
        .filter(
            Product.id == item_data.product_id,
            Product.is_active == True
        )
        .first()
    )

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # 2. Find the customer's cart
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    # 3. Create a cart if the customer doesn't have one
    if cart is None:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    # 4. Check whether the product is already in the cart
    cart_item = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == product.id
        )
        .first()
    )

    # 5. If already exists, increase quantity
    if cart_item:
        cart_item.quantity += item_data.quantity

    # 6. Otherwise create a new cart item
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=item_data.quantity,
            price=product.price
        )

        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Product added to cart successfully",
        "cart_id": cart.id,
        "product_id": cart_item.product_id,
        "quantity": cart_item.quantity,
        "price": cart_item.price
    }

@router.put("/items/{item_id}")
def update_cart_item(
    item_id: int,
    quantity: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Find the customer's cart
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if cart is None:
        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    # 2. Find the cart item
    cart_item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id
        )
        .first()
    )

    if cart_item is None:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    # 3. Validate quantity
    if quantity < 1:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be at least 1"
        )

    # 4. Update quantity
    cart_item.quantity = quantity

    # 5. Save changes
    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Cart quantity updated successfully",
        "cart_id": cart.id,
        "item_id": cart_item.id,
        "product_id": cart_item.product_id,
        "quantity": cart_item.quantity,
        "price": cart_item.price
    }