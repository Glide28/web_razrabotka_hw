from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Category, Product
from ..schemas import CreateProductResponse, MessageResponse, ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/api/admin/products", tags=["Admin Products"])

def validate_category(db: Session, category_id: int) -> None:
    if not db.get(Category, category_id):
        raise HTTPException(status_code=400, detail="Категория не найдена")

@router.get("", response_model=list[ProductOut])
def admin_get_products(db: Session = Depends(get_db)):
    return db.scalars(select(Product).order_by(Product.id)).all()

@router.post("", response_model=CreateProductResponse, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    validate_category(db, payload.category_id)
    if db.scalar(select(Product).where(Product.sku == payload.sku)):
        raise HTTPException(status_code=400, detail="Товар с таким артикулом уже существует")
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id, "message": "Товар успешно создан"}

@router.put("/{product_id}", response_model=MessageResponse)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    validate_category(db, payload.category_id)
    duplicate = db.scalar(select(Product).where(Product.sku == payload.sku, Product.id != product_id))
    if duplicate:
        raise HTTPException(status_code=400, detail="Товар с таким артикулом уже существует")
    for key, value in payload.model_dump().items():
        setattr(product, key, value)
    db.commit()
    return {"message": "Товар успешно обновлен"}

@router.delete("/{product_id}", response_model=MessageResponse)
def soft_delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    product.is_active = False
    db.commit()
    return {"message": "Товар деактивирован"}
