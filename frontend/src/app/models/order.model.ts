export interface Order {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  itemsSnapshot: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}