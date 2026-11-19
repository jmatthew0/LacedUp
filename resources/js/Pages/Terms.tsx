import LegalLayout, { Section } from '@/Components/LegalLayout';

const sections: Section[] = [
  { id: 'who-we-are', title: 'Who we are', body: 'Laced Up is an online marketplace that connects buyers with independent sellers of sneakers. We are not the seller of listed pairs, but we provide authentication, escrow payments, and dispute support as part of the service.' },
  { id: 'eligibility', title: 'Eligibility and accounts', body: 'You must be at least 18 years old to buy or sell. You agree to provide accurate information, keep your sign-in details private, and tell us promptly if you believe your account has been accessed without permission.' },
  { id: 'listings', title: 'Listings and sellers', body: 'Sellers must provide accurate photos, sizes, and condition descriptions, including any flaws. Sellers agree to ship within 48 hours of payment and to use the tracking details provided by Laced Up.' },
  { id: 'authentication', title: 'Authentication and escrow', body: 'Pairs are checked by our team before they ship. Buyer payments are held in escrow and released to the seller once the buyer confirms delivery or the review window closes without a dispute.' },
  { id: 'fees', title: 'Fees and payouts', body: 'Sellers pay a commission of 9 percent of the final sale price. Buyers pay a service fee of ₱90 per order, plus shipping. Payouts are sent to a verified GCash account or bank account. Fees are shown before you confirm any listing or purchase.' },
  { id: 'returns', title: 'Returns and disputes', body: 'Buyers may return a pair within 3 days of delivery if it fails authentication or does not match the listing. Disputes are reviewed within 24 hours. Refunds are issued to the original payment method after inspection.' },
  { id: 'prohibited', title: 'Prohibited conduct', body: 'You may not list counterfeit goods, misrepresent condition, take payment outside the platform to avoid fees or protection, harass other users, or post misleading content. We may remove listings and suspend accounts that break these rules.' },
  { id: 'ip', title: 'Intellectual property', body: 'The Laced Up name, logo, and site design belong to Laced Up. Photos and descriptions you upload remain yours, but you grant us a license to display them on the platform to promote your listings.' },
  { id: 'governing-law', title: 'Governing law and contact', body: 'These terms are governed by the laws of the Republic of the Philippines. For questions about these terms, contact legal@lacedup.ph.' },
];

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="November 19, 2026" sections={sections} summary={[
      'Laced Up connects buyers with independent sellers. Every pair is checked before it ships.',
      'Payments are held in escrow until you confirm delivery.',
      'Keep all payments and messages on the platform. Off-platform deals are not covered.',
    ]} />
  );
}