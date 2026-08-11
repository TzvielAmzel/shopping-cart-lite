from beanie import Document
from pydantic import BaseModel, Field
from typing import List

class Product(Document):
    name: str
    price: float
    image_url: str
    category: str

    class Settings:
        name = "products"

class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str
    quantity: int = 1

class Cart(Document):
    items: List[CartItem] = []

    class Settings:
        name = "carts"