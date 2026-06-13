from pydantic import BaseModel, Field, EmailStr


class UserCreate(BaseModel):
    email: str = Field(pattern=r"^[\w\.\-]+@[\w\.\-]+\.\w+$")
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=100)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRefresh(BaseModel):
    refresh_token: str
