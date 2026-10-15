/**
 * Kavo Technologies pricing. Edit prices here — every page reads from this file.
 * Website, design and analytics prices are carried over from the previous
 * Kavo pricing page. `startingFrom` drives the "Packages from just £15" message.
 */
export const startingFrom = 15;
export const currency = '£';

export interface Package {
  name: string;
  price: string;
  note?: string;
  popular?: boolean;
  features: string[];
  cta: { label: string; href: string };
}

const whatsapp = (pkg: string) =>
  `https://wa.me/447418356179?text=${encodeURIComponent(`Hi Kavo Technologies, I'm interested in the ${pkg} package.`)}`;

export const websitePackages: Package[] = [
  {
    name: 'Starter Website',
    price: '£25–£80',
    note: 'One-off',
    features: ['Up to 5 pages', 'Mobile responsive', 'Free domain included', 'Basic SEO setup', 'Contact form'],
    cta: { label: 'Get started', href: whatsapp('Starter Website') },
  },
  {
    name: 'E-commerce Website',
    price: '£125–£200',
    note: 'One-off',
    popular: true,
    features: ['Full online store', 'Shopify / WooCommerce', 'Payment integration', 'Product management', 'Free domain included'],
    cta: { label: 'Get started', href: whatsapp('E-commerce Website') },
  },
  {
    name: 'Business Website',
    price: '£150–£200',
    note: 'One-off',
    features: ['Unlimited pages', 'Advanced SEO', 'Custom features', 'Free domain included', 'Priority support'],
    cta: { label: 'Get started', href: whatsapp('Business Website') },
  },
];

export const extraPackages: { group: string; items: { name: string; price: string }[]; cta: Package['cta'] }[] = [
  {
    group: 'Design',
    items: [
      { name: 'Basic — flyers, thumbnails', price: '£25' },
      { name: 'Standard', price: '£50' },
      { name: 'Premium', price: '£80' },
    ],
    cta: { label: 'Request a quote', href: '/contact' },
  },
  {
    group: 'Social media',
    items: [
      { name: 'Management', price: 'Quote' },
      { name: 'Analytics', price: '£10/mo' },
    ],
    cta: { label: 'Request a quote', href: '/contact' },
  },
];

export const pricingPromises = [
  `Packages from just ${currency}${startingFrom}`,
  'Free domain included',
  'No hidden fees',
  'Fast turnaround',
  'Pay in stages on bigger projects',
  'UK & Uganda',
];
