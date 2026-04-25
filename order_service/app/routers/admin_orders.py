from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload
from ..database import get_db
from ..models import Order
from ..routers.orders import order_to_response
from ..schemas import AdminOrderListResponse, MessageResponse, OrderOut, StatusUpdate

router = APIRouter(prefix="/api/admin/orders", tags=["Admin Orders"])
ALLOWED_STATUSES = {"NEW", "CONFIRMED", "IN_PROGRESS", "SHIPPED", "DELIVERED", "CANCELLED"}

@router.get("", response_model=AdminOrderListResponse)
def get_orders(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = select(Order).options(selectinload(Order.customer)).order_by(Order.created_at.desc())
    if status:
        stmt = stmt.where(Order.status == status)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    orders = db.scalars(stmt.offset((page - 1) * size).limit(size)).all()
    return {
        "page": page,
        "size": size,
        "total": total,
        "items": [
            {
                "id": order.id,
                "order_number": order.order_number,
                "customer_name": order.customer.full_name,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at,
            }
            for order in orders
        ],
    }

@router.get("/{order_id}", response_model=OrderOut)
def get_order_for_admin(order_id: int, db: Session = Depends(get_db)):
    order = db.scalar(
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.customer), selectinload(Order.items))
    )
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order_to_response(order)

@router.patch("/{order_id}/status")
def update_order_status(order_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    status = payload.status.upper()
    if status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Некорректный статус заказа")
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    order.status = status
    db.commit()
    return {"message": "Статус заказа успешно обновлен", "status": status}
