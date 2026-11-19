import CookiePrefs from '@/Components/CookiePrefs';
import LegalLayout, { Section } from '@/Components/LegalLayout';

const sections: Section[] = [
  { id: 'collect', title: 'Information we collect', body: 'We collect account details such as your name, email, and mobile number, shipping addresses, payment references from GCash, Maya, or card processors, listing photos and descriptions, messages between users, and device and usage data such as browser type and pages viewed.' },
  { id: 'use', title: 'How we use it', body: 'We use your information to run the marketplace, authenticate pairs, process payments and seller payouts, prevent fraud, send order and offer updates, and provide support. We send marketing messages only when you opt in.' },
  { id: 'sharing', title: 'Sharing', body: "Sellers receive a buyer's name and shipping address so they can deliver the pair. We also share data with couriers, payment processors, and service providers who help us operate the platform, and with authorities when the law requires it. We never sell personal data." },
  { id: 'cookies', title: 'Cookies', body: 'We use essential cookies to keep you signed in and your bag intact, preference cookies to remember settings, and analytics cookies to understand how the site is used. Choose which optional cookies you allow below.', extra: <CookiePrefs /> },
  { id: 'retention', title: 'Data retention', body: 'We keep your data while your account is active and for the period required by tax and payment rules. When that period ends, we delete or anonymize the data.' },
  { id: 'rights', title: 'Your rights', body: 'Under the Data Privacy Act of 2012 (RA 10173), you can access and correct your data, request deletion, object to certain processing, withdraw consent, and receive a copy of your data. You may also file a complaint with the National Privacy Commission.' },
  { id: 'contact', title: 'Contact us', body: 'Our data protection officer can be reached at privacy@lacedup.ph. We respond to requests within 15 business days.' },
];

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="November 19, 2026" sections={sections}
      summary={[
        'We collect only what we need to run the marketplace, authenticate pairs, and pay sellers.',
        'We never sell your personal data.',
        'You can access, correct, or delete your data, and change cookie choices at any time.',
      ]}
      sidebarExtra={
        <div className="rounded-2xl bg-ink p-4 text-white">
          <p className="text-sm font-bold">Your rights</p>
          <p className="mt-1 text-xs text-white/70">Request a copy or deletion of your data at any time.</p>
          <a href="#contact" className="mt-3 inline-block text-xs font-semibold underline">See how</a>
        </div>
      } />
  );
}