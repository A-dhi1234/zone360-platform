from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.product import Product
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)
from app.auth.security import get_current_admin


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# =====================================================
# GET ALL PRODUCTS
# PUBLIC
# =====================================================

@router.get(
    "/",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):
    products = (
        db.query(Product)
        .filter(Product.is_active == True)
        .all()
    )

    return products


# =====================================================
# GET SINGLE PRODUCT
# PUBLIC
# =====================================================

@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.is_active == True
        )
        .first()
    )

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# =====================================================
# CREATE PRODUCT
# ADMIN ONLY
# =====================================================

@router.post(
    "/",
    response_model=ProductResponse
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    new_product = Product(
        name=product.name,
        short_name=product.short_name,
        category=product.category,
        description=product.description,
        price=product.price,
        image=product.image,
        is_active=product.is_active,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# =====================================================
# UPDATE PRODUCT
# ADMIN ONLY
# =====================================================

@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = product_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product


# =====================================================
# DELETE PRODUCT
# ADMIN ONLY
# =====================================================

@router.delete(
    "/{product_id}"
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Soft delete
    product.is_active = False

    db.commit()

    return {
        "message": "Product deleted successfully"
    }

@router.delete(
    "/{product_id}"
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.is_active = False

    db.commit()

    return {
        "message": "Product deleted successfully"
    }