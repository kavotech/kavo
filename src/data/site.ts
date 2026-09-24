export const site = {
  name: 'Kavo Technologies',
  shortName: 'Kavo',
  url: 'https://kavotech.uk',
  tagline: 'Digital experiences, built differently.',
  description:
    'Kavo Technologies designs and builds websites, apps, platforms and digital experiences for ambitious businesses across the UK, Uganda and beyond.',
  email: 'info@kavotech.uk',
  phone: '+44 7418 356179',
  phoneHref: 'tel:+447418356179',
  whatsapp: 'https://wa.me/447418356179',
  hours: 'Mon – Fri, 9am – 6pm (UK)',
  location: 'London, United Kingdom',
  markets: ['United Kingdom', 'Uganda', 'Worldwide, remotely'],
  ogImage: '/public/kavologo.png',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/kavotech.uk/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/kavo-tech/' },
    { label: 'WhatsApp', href: 'https://wa.me/447418356179' },
  ],
} as const;

export const mainNav = [
  { label: 'Services', href: '/services', mega: true },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
] as const;

export const technologies = [
  { name: 'React', use: 'Interfaces' },
  { name: 'Next.js', use: 'Web platforms' },
  { name: 'React Native', use: 'Mobile apps' },
  { name: 'Expo', use: 'Mobile tooling' },
  { name: 'TypeScript', use: 'Type-safe code' },
  { name: 'Node.js', use: 'Services & APIs' },
  { name: 'Supabase', use: 'Auth & data' },
  { name: 'PostgreSQL', use: 'Databases' },
  { name: 'Stripe', use: 'Payments' },
  { name: 'REST APIs', use: 'Integrations' },
] as const;

export const processSteps = [
  {
    number: '01',
    title: 'Discover',
    text: 'We get under the skin of your business — goals, customers, constraints — and agree what success looks like before a pixel is drawn.',
    points: ['Workshops & research', 'Requirements & scope', 'Roadmap'],
  },
  {
    number: '02',
    title: 'Design',
    text: 'Journeys, wireframes and high-fidelity interfaces shaped around real users, reviewed with you in short, visible loops.',
    points: ['UX flows', 'UI design', 'Prototypes'],
  },
  {
    number: '03',
    title: 'Build',
    text: 'Clean, tested, scalable engineering. You see progress every week, not a big reveal at the end.',
    points: ['Front-end & back-end', 'Integrations', 'QA & testing'],
  },
  {
    number: '04',
    title: 'Launch',
    text: 'We handle deployment, performance, analytics and the details that make launch day calm rather than chaotic.',
    points: ['Deployment', 'Performance tuning', 'Training & handover'],
  },
  {
    number: '05',
    title: 'Grow',
    text: 'Launch is the start. We measure, iterate and market the product so it keeps earning its place in your business.',
    points: ['SEO & ads', 'Iteration', 'Ongoing support'],
  },
] as const;
