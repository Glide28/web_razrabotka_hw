from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import asc, desc, func, or_, select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Category, Product
from ..schemas import CategoryOut, ProductListResponse, ProductOut

router = APIRouter(tags=["Products"])

@router.get("/api/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.scalars(select(Category).order_by(Category.name)).all()

@router.get("/api/products", response_model=ProductListResponse)
def get_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    categoryId: int | None = None,
    minPrice: float | None = None,
    maxPrice: float | None = None,
    baseType: str | None = None,
    sortBy: str = Query("price", pattern="^(price|name|id)$"),
    sortDir: str = Query("asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    stmt = select(Product).where(Product.is_active.is_(True))

    if search:
        like = f"%{search.strip()}%"
        stmt = stmt.where(or_(Product.name.ilike(like), Product.sku.ilike(like)))
    if categoryId:
        stmt = stmt.where(Product.category_id == categoryId)
    if minPrice is not None:
        stmt = stmt.where(Product.price >= minPrice)
    if maxPrice is not None:
        stmt = stmt.where(Product.price <= maxPrice)
    if baseType:
        stmt = stmt.where(Product.base_type == baseType)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = db.scalar(count_stmt) or 0

    sort_column = {"price": Product.price, "name": Product.name, "id": Product.id}[sortBy]
    stmt = stmt.order_by(desc(sort_column) if sortDir == "desc" else asc(sort_column))
    stmt = stmt.offset((page - 1) * size).limit(size)

    return {"page": page, "size": size, "total": total, "items": db.scalars(stmt).all()}

@router.get("/api/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product
