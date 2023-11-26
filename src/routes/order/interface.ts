export interface IOrder {
  quantity?: number;
  productId: string;
}

export interface IOrderResponse {
  message: string;
  data?: any;
}
