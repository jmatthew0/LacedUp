export interface Sneaker {
  slug: string; name: string; category: string; seller: string; rating: number;
  price: number; condition: string; sizes: number[]; image: string;
  canMessage?: boolean;
}
export interface Seller { avatar?: string | null;
  handle: string; name: string; bio: string; sales: number; rating: number; onTime: number;
  canMessage?: boolean;
}

export interface HeroSlide {
  badge: string; title: string; blurb: string; price: number; slug: string; image: string;
}

export interface BagLine extends Sneaker { id: number; size: string | null }
export interface OrderItem {
  id: number; name: string; image: string; seller: string; condition: string; size: string | null; price: number;
  review: { rating: number; comment: string | null } | null;
}
export interface OrderData {
  code: string; status: string; stage: number; total: number; subtotal: number; shipping: number; fee: number;
  shippingMethod: string; paymentMethod: string; address: Record<string, string>; placedAt: string;
  confirmed: boolean; items: OrderItem[];
  canDispute: boolean; canReturn: boolean; disputeNote: string | null; returnNote: string | null; disputes: DisputeData[];
}
export interface DisputeData { id: number; type: 'dispute' | 'return'; status: 'open' | 'approved' | 'declined'; reason: string; response: string | null; date: string }

export interface AddressData {
  id: number; label: string; name: string; phone: string; address: string; city: string; postal: string; isDefault: boolean;
}