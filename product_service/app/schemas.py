from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str | None = None

class ProductBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: str = Field(min_length=2, max_length=255)
    sku: str = Field(min_length=2, max_length=100)
    category_id: int = Field(alias="categoryId", gt=0)
    description: str | None = None
    base_type: str | None = Field(default=None, alias="baseType")
    power_watts: int | None = Field(default=None, alias="powerWatts", ge=0)
    color_temperature: int | None = Field(default=None, alias="colorTemperature", ge=0)
    voltage: int | None = Field(default=None, ge=0)
    price: Decimal = Field(gt=0)
    stock_quantity: int = Field(alias="stockQuantity", ge=0)
    image_url: str | None = Field(default=None, alias="imageUrl")
    is_active: bool = Field(default=True, alias="isActive")

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int

class ProductListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    name: str
    sku: str
    category_id: int = Field(alias="categoryId")
    price: Decimal
    stock_quantity: int = Field(alias="stockQuantity")
    is_active: bool = Field(alias="isActive")

class ProductListResponse(BaseModel):
    page: int
    size: int
    total: int
    items: list[ProductListItem]

class MessageResponse(BaseModel):
    message: str

class CreateProductResponse(BaseModel):
    id: int
    message: str
