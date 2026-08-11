import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { Product, CartItem } from './models/cart.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  cartService = inject(CartService);

  isModalOpen = signal(false);
  confirmedItems = signal<CartItem[]>([]);
  confirmedTotal = signal<number>(0);

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  incrementQuantity(productId: string) {
    const currentQty = this.cartService.getProductQuantityInCart(productId);
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  decrementQuantity(productId: string) {
    const currentQty = this.cartService.getProductQuantityInCart(productId);
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  removeFromCart(productId: string) {
    this.cartService.updateQuantity(productId, 0);
  }

  confirmOrder() {
    this.confirmedItems.set([...this.cartService.cartItems()]);
    this.confirmedTotal.set(this.cartService.totalPrice());
    this.isModalOpen.set(true);
    this.cartService.clearCart();
  }

  startNewOrder() {
    this.isModalOpen.set(false);
    this.confirmedItems.set([]);
    this.confirmedTotal.set(0);
  }
}