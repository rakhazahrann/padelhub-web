export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'EXPIRED';

export type PaymentMethod =
  | 'QRIS'
  | 'VIRTUAL_ACCOUNT'
  | 'E_WALLET'
  | 'CASH'
  | 'DEBIT'
  | 'TRANSFER';

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  adminFee: number;
  totalAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  virtualAccountNumber?: string;
  paidAt?: string;
  expiredAt?: string;
  createdAt: string;
};
