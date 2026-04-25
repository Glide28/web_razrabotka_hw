from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class CartItemCreate(BaseModel):
    session_id: str | None = Field(default=None, alias="sessionId")
    product_id: int = Field(alias="productId", gt=0)
    quantity: int = Field(gt=0)

class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)

class CartItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    price: Decimal
    quantity: int
    line_total: Decimal

class CartResponse(BaseModel):
    session_id: str
    items: list[CartItemOut]
    total_amount: Decimal

class CustomerIn(BaseModel):
    full_name: str = Field(alias="fullName", min_length=2)
    phone: str = Field(min_length=5)
    email: EmailStr
    address: str = Field(min_length=5)
    comment: str | None = None

class CustomerOut(BaseModel):
    full_name: str
    phone: str
    email: str
    address: str

class OrderCreate(BaseModel):
    session_id: str = Field(alias="sessionId")
    customer: CustomerIn

class OrderCreateResponse(BaseModel):
    id: int
    order_number: str
    status: str
    message: str

class OrderItemOut(BaseModel):
    product_id: int
    product_name: str
    price: Decimal
    quantity: int
    line_total: Decimal

class OrderOut(BaseModel):
    id: int
    order_number: str
    status: str
    total_amount: Decimal
    customer: CustomerOut
    items: list[OrderItemOut]
    comment: str | None = None

class AdminOrderListItem(BaseModel):
    id: int
    order_number: str
    customer_name: str
    status: str
    total_amount: Decimal
    created_at: datetime

class AdminOrderListResponse(BaseModel):
    page: int
    size: int
    total: int
    items: list[AdminOrderListItem]

class StatusUpdate(BaseModel):
    status: str

class MessageResponse(BaseModel):
    message: str
