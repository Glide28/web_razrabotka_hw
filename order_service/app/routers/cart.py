from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CartItem
from ..product_client import get_product, normalize_product
from ..schemas import CartItemCreate, CartItemUpdate, CartResponse, MessageResponse

router = APIRouter(prefix="/api/cart", tags=["Cart"])

def build_cart_response(session_id: str, db: Session) -> dict:
    items = db.scalars(select(CartItem).where(CartItem.session_id == session_id).order_by(CartItem.id)).all()
    response_items = []
    total = Decimal("0.00")
    for item in items:
        line_total = Decimal(str(item.price)) * item.quantity
        total += line_total
        response_items.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": item.product_name,
            "price": item.price,
            "quantity": item.quantity,
            "line_total": line_total,
        })
    return {"session_id": session_id, "items": response_items, "total_amount": total}

@router.get("", response_model=CartResponse)
def get_cart(sessionId: str = Query(...), db: Session = Depends(get_db)):
    return build_cart_response(sessionId, db)

@router.post("/items", status_code=201)
def add_item(payload: CartItemCreate, db: Session = Depends(get_db)):
    session_id = payload.session_id or "default_session"
    product = get_product(payload.product_id)
    product_name, price, stock = normalize_product(product)
    if payload.quantity > stock:
        raise HTTPException(status_code=400, detail="Недостаточный остаток товара")

    existing = db.scalar(select(CartItem).where(CartItem.session_id == session_id, CartItem.product_id == payload.product_id))
    if existing:
        existing.quantity += payload.quantity
        cart_item = existing
    else:
        cart_item = CartItem(session_id=session_id, product_id=payload.product_id, product_name=product_name, price=price, quantity=payload.quantity)
        db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return {"message": "Товар добавлен в корзину", "cartItemId": cart_item.id}

@router.put("/items/{cart_item_id}", response_model=MessageResponse)
def update_item(cart_item_id: int, payload: CartItemUpdate, db: Session = Depends(get_db)):
    item = db.get(CartItem, cart_item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Позиция корзины не найдена")
    _, _, stock = normalize_product(get_product(item.product_id))
    if payload.quantity > stock:
        raise HTTPException(status_code=400, detail="Недостаточный остаток товара")
    item.quantity = payload.quantity
    db.commit()
    return {"message": "Количество товара обновлено"}

@router.delete("/items/{cart_item_id}", response_model=MessageResponse)
def delete_item(cart_item_id: int, db: Session = Depends(get_db)):
    item = db.get(CartItem, cart_item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Позиция корзины не найдена")
    db.delete(item)
    db.commit()
    return {"message": "Товар удален из корзины"}
