import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { Product } from './models/cart.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  cartService = inject(CartService);

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
}