export interface Faq { topic: string; q: string; a: string }

export const faqs: Faq[] = [
  { topic: 'Orders', q: 'How do I track my order?', a: 'Open My orders from your account menu and tap Track order. You will see each stage from order placed to delivered, and you get a notification whenever the status changes.' },
  { topic: 'Payments', q: 'What payment methods are accepted?', a: 'At checkout you can pay with GCash, a credit or debit card, or cash on meetup at a Laced Up hub. You can set a preferred method under Account settings, then Payment methods.' },
  { topic: 'Payments', q: 'Why is my payment held in escrow?', a: 'Escrow protects both sides. We hold your payment until you confirm the pair arrived as described, then release it to the seller. If something is wrong, open a dispute before confirming.' },
  { topic: 'Orders', q: 'How does authentication work?', a: 'Every pair is checked by our team before it ships, including materials, stitching, labels, and condition. Pairs that fail are not sent, and the buyer is refunded.' },
  { topic: 'Selling', q: 'What fee does Laced Up charge sellers?', a: 'Sellers pay a commission of 9 percent of the final sale price, taken from the payout. Buyers pay a ₱90 service fee per order. Fees are shown before you confirm any listing or purchase.' },
  { topic: 'Selling', q: 'How do I list a pair?', a: 'Choose Sell a pair, search for the model, add photos, set the size and condition, then set your price. Your listing goes live right away, and you manage offers and orders from your seller dashboard.' },
  { topic: 'Shipping', q: 'How long does shipping take?', a: 'Sellers ship within 48 hours of payment. After that, Standard delivery takes 3 to 5 days and Express takes 1 to 2 days. You can also pick up at a Laced Up hub for free.' },
  { topic: 'Returns', q: 'Can I return a pair?', a: 'Yes, within 3 days of delivery if the pair fails authentication or does not match the listing. Open your order, choose Request return, and the seller reviews your request.' },
  { topic: 'Returns', q: 'How do I request a refund?', a: 'Refunds start with a return request or a dispute on your order. Once the return is approved and the pair is inspected, the refund is issued to your original payment method.' },
  { topic: 'Orders', q: 'How do I reset my password?', a: 'On the sign in page choose Forgot password, enter your email, and we will send a reset link. You can also change your password anytime under Account settings, then Security.' },
];