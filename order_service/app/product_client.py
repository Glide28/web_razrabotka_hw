import os
from decimal import Decimal
from typing import Any
import requests
from fastapi import HTTPException

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8001")

# Учебный fallback нужен, чтобы Order Service можно было показать в Postman даже без запущенного Product Service.
FALLBACK_PRODUCTS: dict[int, dict[str, Any]] = {
    1: {"id": 1, "name": "Светодиодная лампа A60 12W E27", "price": "199.99", "stockQuantity": 120},
    2: {"id": 2, "name": "Светодиодная лампа C37 8W E14", "price": "149.99", "stockQuantity": 85},
    3: {"id": 3, "name": "Светодиодная лампа G45 10W E27", "price": "169.99", "stockQuantity": 90},
}

def get_product(product_id: int) -> dict[str, Any]:
    try:
        response = requests.get(f"{PRODUCT_SERVICE_URL}/api/products/{product_id}", timeout=2)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Товар не найден")
        response.raise_for_status()
        return response.json()
    except HTTPException:
        raise
    except requests.RequestException:
        product = FALLBACK_PRODUCTS.get(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Товар не найден")
        return product

def normalize_product(product: dict[str, Any]) -> tuple[str, Decimal, int]:
    name = product.get("name")
    price = Decimal(str(product.get("price")))
    stock = int(product.get("stockQuantity", product.get("stock_quantity", 0)))
    return name, price, stock
