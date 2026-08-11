import os
from contextlib import asynccontextmanager
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import AsyncMongoClient
from beanie import init_beanie

from models import Product, Cart, CartItem

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DB_NAME")

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncMongoClient(MONGO_URL)
    await init_beanie(
        database=client[DATABASE_NAME],
        document_models=[Product, Cart]
    )
    yield

app = FastAPI(title="Shopping Cart API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/products", response_model=List[Product])
async def get_products():
    return await Product.find_all().to_list()

@app.post("/api/seed-products")
async def seed_products():
    if await Product.count() > 0:
        return {"message": "Products already seeded"}
    
    sample_products = [
    Product(
        name="Waffle with Berries",
        price=6.50,
        category="Waffle",
        image_url="https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop"
    ),
    Product(
        name="Vanilla Bean Crème Brûlée",
        price=7.00,
        category="Crème Brûlée",
        image_url="https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500&auto=format&fit=crop"
    ),
    Product(
        name="Macaron Mix of Five",
        price=8.00,
        category="Macaron",
        image_url="https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&auto=format&fit=crop"
    ),
    Product(
        name="Classic Tiramisu",
        price=5.50,
        category="Tiramisu",
        image_url="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop"
    ),
]
    await Product.insert_many(sample_products)
    return {"message": "Products seeded successfully"}

@app.get("/api/cart", response_model=Cart)
async def get_cart():
    cart = await Cart.find_one()
    if not cart:
        cart = Cart(items=[])
        await cart.insert()
    return cart

@app.post("/api/cart/items", response_model=Cart)
async def add_or_update_cart_item(item: CartItem):
    cart = await Cart.find_one()
    if not cart:
        cart = Cart(items=[])
        await cart.insert()
    
    existing_item = next((i for i in cart.items if i.product_id == item.product_id), None)
    
    if existing_item:
        if item.quantity <= 0:
            cart.items = [i for i in cart.items if i.product_id != item.product_id]
        else:
            existing_item.quantity = item.quantity
    else:
        if item.quantity > 0:
            cart.items.append(item)
            
    await cart.save()
    return cart

@app.delete("/api/cart", response_model=Cart)
async def clear_cart():
    cart = await Cart.find_one()
    if cart:
        cart.items = []
        await cart.save()
    else:
        cart = Cart(items=[])
        await cart.insert()
    return cart