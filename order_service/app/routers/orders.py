from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from ..database import get_db
from ..models import CartItem, Customer, Order, OrderItem
from ..product_client import get_product, normalize_product
from ..schemas import OrderCreate, OrderCreateResponse, OrderOut

router = APIRouter(prefix="/api/orders", tags=["Orders"])

def make_order_number(order_id: int) -> str:
    return f"ORD-2026-{order_id:06d}"

def order_to_response(order: Order) -> dict:
    return {
        "id": order.id,
        "order_number": order.order_number,
        "status": order.status,
        "total_amount": order.total_amount,
        "customer": {
            "full_name": order.customer.full_name,
            "phone": order.customer.phone,
            "email": order.customer.email,
            "address": order.customer.address,
        },
        "items": [
            {
                "product_id": item.product_id,
                "product_name": item.product_name,
                "price": item.price,
                "quantity": item.quantity,
                "line_total": item.line_total,
            }
            for item in order.items
        ],
        "comment": order.comment,
    }

@router.post("", response_model=OrderCreateResponse, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    cart_items = db.scalars(select(CartItem).where(CartItem.session_id == payload.session_id).order_by(CartItem.id)).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Корзина пуста или данные клиента некорректны")

    total = Decimal("0.00")
    prepared_items = []
    for cart_item in cart_items:
        product = get_product(cart_item.product_id)
        product_name, actual_price, stock = normalize_product(product)
        if cart_item.quantity > stock:
            raise HTTPException(status_code=400, detail=f"Недостаточный остаток товара: {product_name}")
        line_total = actual_price * cart_item.quantity
        total += line_total
        prepared_items.append((cart_item.product_id, product_name, actual_price, cart_item.quantity, line_total))

    customer = Customer(
        full_name=payload.customer.full_name,
        phone=payload.customer.phone,
        email=str(payload.customer.email),
        address=payload.customer.address,
    )
    db.add(customer)
    db.flush()

    order = Order(order_number="TEMP", customer_id=customer.id, status="NEW", total_amount=total, comment=payload.customer.comment)
    db.add(order)
    db.flush()
    order.order_number = make_order_number(order.id)

    for product_id, product_name, price, quantity, line_total in prepared_items:
        db.add(OrderItem(order_id=order.id, product_id=product_id, product_name=product_name, price=price, quantity=quantity, line_total=line_total))

    for cart_item in cart_items:
        db.delete(cart_item)

    db.commit()
    db.refresh(order)
    return {"id": order.id, "order_number": order.order_number, "status": order.status, "message": "Заказ успешно создан"}

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.scalar(
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.customer), selectinload(Order.items))
    )
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order_to_response(order)
