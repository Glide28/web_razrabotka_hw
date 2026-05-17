from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from ..auth import ADMIN_PASSWORD, ADMIN_USERNAME, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    if payload.username != ADMIN_USERNAME or payload.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        )

    token = create_access_token(
        {
            "sub": payload.username,
            "role": "admin",
        }
    )

    return {
        "accessToken": token,
        "tokenType": "bearer",
    }