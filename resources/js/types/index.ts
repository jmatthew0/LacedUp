export interface Sneaker {
  slug: string; name: string; category: string; seller: string; rating: number;
  price: number; condition: string; sizes: number[]; image: string;
}
export interface Seller {
  handle: string; name: string; bio: string; sales: number; rating: number; onTime: number;
}
export interface HeroSlide {
  badge: string; title: string; blurb: string; price: number; slug: string; image: string;
}
