import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  products = signal<Product[]>([]);
  cart = signal<Cart>({ items: [] });

  cartItems = computed(() => this.cart().items);

  totalItemsCount = computed(() =>
    this.cart().items.reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cart().items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  constructor() {
    this.loadProducts();
    this.loadCart();
  }

  loadProducts() {
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Failed to load products', err)
    });
  }

  loadCart() {
    this.http.get<Cart>(`${this.apiUrl}/cart`).subscribe({
      next: (data) => this.cart.set(data),
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  addToCart(product: Product) {
    const currentItems = this.cart().items;
    const existingItem = currentItems.find(i => i.product_id === product._id);
    const newQuantity = (existingItem ? existingItem.quantity : 0) + 1;

    const payload: CartItem = {
      product_id: product._id || '',
      name: product.name,
      price: product.price,
      quantity: newQuantity,
      image_url: product.image_url
    };

    this.http.post<Cart>(`${this.apiUrl}/cart/items`, payload).subscribe({
      next: (updatedCart) => this.cart.set(updatedCart),
      error: (err) => console.error('Failed to add to cart', err)
    });
  }

  updateQuantity(productId: string, newQuantity: number) {
    const existingItem = this.cart().items.find(i => i.product_id === productId);
    if (!existingItem) return;

    const payload: CartItem = {
      ...existingItem,
      quantity: newQuantity
    };

    this.http.post<Cart>(`${this.apiUrl}/cart/items`, payload).subscribe({
      next: (updatedCart) => this.cart.set(updatedCart),
      error: (err) => console.error('Failed to update quantity', err)
    });
  }

  getProductQuantityInCart(productId: string): number {
    const item = this.cart().items.find(i => i.product_id === productId);
    return item ? item.quantity : 0;
  }

  clearCart() {
    this.http.delete<Cart>(`${this.apiUrl}/cart`).subscribe({
      next: (updatedCart) => this.cart.set(updatedCart),
      error: (err) => console.error('Failed to clear cart', err)
    });
  }
}