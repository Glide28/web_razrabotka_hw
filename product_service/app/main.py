from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, SessionLocal, engine
from .routers import admin_products, products
from .seed import seed_data

app = FastAPI(title="Product Service API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "ok", "service": "product-service"}

app.include_router(products.router)
app.include_router(admin_products.router)
