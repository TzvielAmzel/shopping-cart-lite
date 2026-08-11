export interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  description?: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Cart {
  _id?: string;
  user_id?: string;
  items: CartItem[];
}