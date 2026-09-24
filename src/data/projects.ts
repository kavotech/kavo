import type { ImageMetadata } from 'astro';
import breezyeeLogo from '../assets/clients/logo4.png';

export type WorkFilter = 'websites' | 'apps' | 'platforms' | 'growth';
export type VisualKind = 'phone' | 'browser' | 'shop' | 'dashboard' | 'editorial';

export interface Project {
  slug: string;
  name: string;
  /** Primary discipline shown on cards */
  category: string;
  filters: WorkFilter[];
  tags: string[];
  /** Year of delivery — left undefined where not confirmed */
  year?: number;
  summary: string;
  location?: string;
  overview: string;
  challenge: string;
  approach: string;
  solution: string;
  features: { title: string; text: string }[];
  technologies: string[];
  outcome: string;
  services: string[];
  visual: {
    kind: VisualKind;
    /** Background of the cinematic frame */
    bg: string;
    /** Accent used inside the mock interface */
    accent: string;
    /** Secondary tone used inside the mock interface */
    tone: string;
    /** Text colour on the frame background */
    ink: string;
    logo?: ImageMetadata;
    /** Short strap shown inside the mock UI */
    strap: string;
  };
}

export const workFilters: { key: 'all' | WorkFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'websites', label: 'Websites' },
  { key: 'apps', label: 'Apps' },
  { key: 'platforms', label: 'Platforms' },
  { key: 'growth', label: 'Brand & Growth' },
];

export const projects: Project[] = [
  {
    slug: 'breezyee-go',
    name: 'Breezyee Go',
    category: 'Mobile App',
    filters: ['apps', 'platforms'],
    tags: ['Mobile App', 'UX/UI', 'Platform Development'],
    summary: 'Mobile marketplace connecting customers with young workers and removal services.',
    overview:
      'Breezyee Go is a mobile marketplace that lets customers book help with removals, deliveries and everyday jobs — and gives young workers a straightforward way to find paid work nearby.',
    challenge:
      'A two-sided marketplace has to earn trust from both sides at once. Customers need to feel confident about who is turning up; workers need jobs that are clear, fairly described and easy to accept. All of it had to feel simple on a phone.',
    approach:
      'We mapped the customer and worker journeys side by side, identifying every moment where one side waits on the other. That shaped a shared job model, clear status updates and an onboarding flow that asks only for what is needed, when it is needed.',
    solution:
      'A cross-platform app built with React Native and Expo, backed by Supabase for authentication and real-time data, with Stripe handling payments. Customers post and track jobs; workers browse, accept and update them — each side seeing exactly what they need.',
    features: [
      { title: 'Job posting in minutes', text: 'A guided flow that captures the essentials — what, where, when — without long forms.' },
      { title: 'Real-time status', text: 'Both sides see job progress update live, from accepted to complete.' },
      { title: 'Worker profiles', text: 'Clear profiles and verification steps that help customers book with confidence.' },
      { title: 'Secure payments', text: 'In-app payments so money changes hands safely and transparently.' },
    ],
    technologies: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL', 'Stripe'],
    outcome:
      'A launch-ready marketplace product with a single codebase for iOS and Android, a scalable backend and a design system that makes new job types straightforward to add.',
    services: ['mobile-app-development', 'ui-ux', 'web-applications'],
    visual: { kind: 'phone', bg: '#2ec4b6', accent: '#7b3fe4', tone: '#e8fffb', ink: '#0d0d0f', logo: breezyeeLogo, strap: 'Help is on the way' },
  },
  {
    slug: 'rm-mangoes',
    name: 'RM Mangoes',
    category: 'E-commerce',
    filters: ['websites', 'growth'],
    tags: ['E-commerce', 'Web Design', 'Social Media'],
    summary: 'A bright, appetite-led online store for a fresh mango supplier.',
    overview:
      'RM Mangoes needed a way to sell seasonal fresh fruit online with the same warmth and energy as the product itself.',
    challenge:
      'Fresh produce is seasonal, perishable and bought on impulse. The store had to communicate freshness and availability at a glance, and make ordering quick enough to catch that impulse.',
    approach:
      'We led with colour and product, keeping navigation minimal and bringing availability, box sizes and delivery information right up front. Content was designed to be shared, so the store and social channels work together.',
    solution:
      'A mobile-first e-commerce build with clear product boxes, simple variants and a short checkout, supported by social-ready visual assets.',
    features: [
      { title: 'Seasonal merchandising', text: 'Highlight what is available now and let customers know what is coming next.' },
      { title: 'Box-based ordering', text: 'Simple box sizes replace confusing weight options.' },
      { title: 'Fast checkout', text: 'A short, mobile-friendly path from product to payment.' },
      { title: 'Social-ready visuals', text: 'A visual system that carries across the store and social media.' },
    ],
    technologies: ['E-commerce platform', 'Payments', 'Responsive design', 'Analytics'],
    outcome:
      'A vibrant storefront that is easy for the team to update through the season, and a consistent look across web and social.',
    services: ['ecommerce', 'web-design', 'social-media'],
    visual: { kind: 'shop', bg: '#ffb627', accent: '#1f7a3a', tone: '#fff4d6', ink: '#0d0d0f', strap: 'Fresh from the source' },
  },
  {
    slug: 'kampala-diplomatic-international-school',
    name: 'Kampala Diplomatic International School',
    category: 'Website',
    filters: ['websites'],
    tags: ['Web Design', 'Web Development', 'Content Strategy'],
    location: 'Kampala, Uganda',
    summary: 'A confident, welcoming digital home for an international school community.',
    overview:
      'An international school website designed to speak to prospective families, current parents and staff — each with very different needs.',
    challenge:
      'School websites often become dumping grounds for notices. The goal was a site that first sells the experience of the school to new families, while still giving the existing community quick access to what they need.',
    approach:
      'We separated audiences early: an inspiring, image-led admissions journey for prospective families, and a fast, practical layer of links and updates for current parents and staff.',
    solution:
      'A responsive, easy-to-edit website with clear admissions pathways, academic programme pages, news and events, and prominent contact routes.',
    features: [
      { title: 'Admissions journey', text: 'A step-by-step path from first visit to enquiry.' },
      { title: 'Programme pages', text: 'Clear, structured content for each stage of learning.' },
      { title: 'News & events', text: 'An editable feed that keeps the community informed.' },
      { title: 'Quick links', text: 'Fast access for parents and staff to the essentials.' },
    ],
    technologies: ['Responsive build', 'CMS', 'SEO foundations', 'Analytics'],
    outcome:
      'A modern, trustworthy web presence that reflects the school’s international character and is simple for staff to keep current.',
    services: ['web-design', 'web-development', 'school-management-systems'],
    visual: { kind: 'editorial', bg: '#15235c', accent: '#f2c14e', tone: '#e9edff', ink: '#ffffff', strap: 'Learning without borders' },
  },
  {
    slug: 'moonstone-advocates',
    name: 'Moonstone Advocates',
    category: 'Website',
    filters: ['websites', 'growth'],
    tags: ['Web Design', 'Brand Presence', 'SEO'],
    summary: 'A calm, authoritative website for a law firm built on trust.',
    overview:
      'Moonstone Advocates wanted a website that communicates expertise and discretion, and makes it easy for prospective clients to take the first step.',
    challenge:
      'Legal services are high-stakes decisions. Visitors need reassurance and clarity quickly, without being overwhelmed by jargon or walls of text.',
    approach:
      'We built a restrained, editorial visual language — generous whitespace, strong typography and a clear hierarchy of practice areas — with contact options always within reach.',
    solution:
      'A fast, search-friendly website with practice area pages, firm profile and a straightforward consultation enquiry flow.',
    features: [
      { title: 'Practice areas', text: 'Each area explained clearly, with a direct route to enquire.' },
      { title: 'Editorial design', text: 'Typography-led layouts that feel considered and credible.' },
      { title: 'Consultation enquiries', text: 'A simple, reassuring enquiry form.' },
      { title: 'Search foundations', text: 'Structured content and metadata to help clients find the firm.' },
    ],
    technologies: ['Responsive build', 'SEO foundations', 'Structured data'],
    outcome:
      'A credible digital front door that reflects the firm’s professionalism and gives clients a clear path to get in touch.',
    services: ['web-design', 'seo', 'website-maintenance'],
    visual: { kind: 'editorial', bg: '#231b33', accent: '#d9d3ff', tone: '#f4f1ff', ink: '#ffffff', strap: 'Counsel you can trust' },
  },
  {
    slug: 'hauseworks',
    name: 'Hauseworks',
    category: 'Website & Booking',
    filters: ['websites', 'growth'],
    tags: ['Web Design', 'Booking Journey', 'Google Business'],
    summary: 'A clean, conversion-focused website for a home services brand.',
    overview:
      'Hauseworks needed a website that makes a professional first impression and turns local searches into booked jobs.',
    challenge:
      'Home-services customers compare quickly and decide on trust. The site had to show quality work, explain services simply and make requesting a quote effortless on mobile.',
    approach:
      'We structured the site around services and service areas, placed quote requests at every natural decision point, and paired the website with a properly optimised Google Business Profile.',
    solution:
      'A mobile-first website with service pages, a streamlined quote and booking request journey, and local search foundations.',
    features: [
      { title: 'Service pages', text: 'Clear descriptions of each service and what to expect.' },
      { title: 'Quote requests', text: 'A short, friendly form optimised for phones.' },
      { title: 'Local visibility', text: 'Google Business Profile and on-page local SEO.' },
      { title: 'Proof of work', text: 'Project imagery layouts ready for before-and-after showcases.' },
    ],
    technologies: ['Responsive build', 'Forms & automation', 'Local SEO'],
    outcome:
      'A professional online presence built to convert local interest into enquiries, with a structure that grows as services expand.',
    services: ['web-development', 'booking-systems', 'google-business'],
    visual: { kind: 'browser', bg: '#e2673f', accent: '#0d0d0f', tone: '#fff1ea', ink: '#0d0d0f', strap: 'Homes, handled.' },
  },
  {
    slug: 'punjab-exotic-foods',
    name: 'Punjab Exotic Foods',
    category: 'E-commerce',
    filters: ['websites', 'growth'],
    tags: ['E-commerce', 'Product Catalogue', 'Google Ads'],
    summary: 'A rich, flavour-first online presence for a speciality food supplier.',
    overview:
      'Punjab Exotic Foods supplies speciality ingredients and foods. They needed a digital storefront that does justice to the product range and is easy to browse.',
    challenge:
      'A broad catalogue can quickly become overwhelming. Customers needed to find products fast, while the brand needed to feel as vibrant as the food.',
    approach:
      'We organised the range into intuitive categories, introduced a warm, spice-inspired palette, and designed product cards that surface the details customers care about.',
    solution:
      'A responsive product catalogue and ordering experience, ready to support paid search campaigns that drive customers to the most popular ranges.',
    features: [
      { title: 'Browsable catalogue', text: 'Clear categories and filters across the range.' },
      { title: 'Product detail', text: 'Consistent product information and imagery layouts.' },
      { title: 'Campaign landing pages', text: 'Pages designed to pair with paid search.' },
      { title: 'Mobile ordering', text: 'A smooth path from browsing to order on any device.' },
    ],
    technologies: ['E-commerce platform', 'Payments', 'Google Ads', 'Analytics'],
    outcome:
      'A flavourful, well-organised storefront that makes a large range easy to explore and supports ongoing marketing.',
    services: ['ecommerce', 'google-ads', 'web-design'],
    visual: { kind: 'shop', bg: '#b3261e', accent: '#ffb000', tone: '#fff3e6', ink: '#ffffff', strap: 'Taste the difference' },
  },
  {
    slug: 'voltex-construction',
    name: 'Voltex Construction',
    category: 'Website',
    filters: ['websites', 'growth'],
    tags: ['Web Design', 'Web Development', 'SEO'],
    summary: 'A bold, industrial website for a construction company.',
    overview:
      'Voltex Construction wanted a website with the same strength and precision as the projects they deliver.',
    challenge:
      'Construction clients want evidence of capability and reliability. The site needed to present services and projects with impact, and make tender or quote enquiries simple.',
    approach:
      'A high-contrast, industrial visual system with bold typography and a project-led structure. Services and sectors are clearly separated so commercial and residential clients each find their way.',
    solution:
      'A fast, responsive website with service and project showcases, a clear enquiry route, and search foundations for local and regional visibility.',
    features: [
      { title: 'Project showcase', text: 'Image-led layouts for completed work.' },
      { title: 'Services & sectors', text: 'Structured content for different client types.' },
      { title: 'Enquiry route', text: 'A straightforward way to request a quote or discuss a tender.' },
      { title: 'Local SEO', text: 'Built to be found in the regions they serve.' },
    ],
    technologies: ['Responsive build', 'SEO foundations', 'Structured data'],
    outcome:
      'A confident, high-impact site that positions the company as a serious, capable partner.',
    services: ['web-design', 'web-development', 'seo'],
    visual: { kind: 'browser', bg: '#ffd400', accent: '#0d0d0f', tone: '#1c1c1c', ink: '#0d0d0f', strap: 'Built with precision' },
  },
  {
    slug: 'oasis-school-management',
    name: 'Oasis School Management',
    category: 'Platform',
    filters: ['platforms', 'apps'],
    tags: ['Web Application', 'Dashboards', 'School Systems'],
    summary: 'A school management platform bringing admissions, records and fees into one place.',
    overview:
      'Oasis School Management is a web platform that helps schools manage students, attendance, fees and communication without juggling spreadsheets and paper.',
    challenge:
      'School administration spans many roles and repetitive tasks. The system had to be powerful enough for administrators yet simple enough for teachers and parents to pick up with minimal training.',
    approach:
      'We designed around roles — administrator, teacher, parent — giving each a focused dashboard and only the tools they need. Common tasks were reduced to as few steps as possible.',
    solution:
      'A secure, role-based web application with modules for admissions, student records, attendance, fees and reporting, backed by a relational database and a component-driven interface.',
    features: [
      { title: 'Role-based dashboards', text: 'Focused views for administrators, teachers and parents.' },
      { title: 'Student records', text: 'Secure profiles with academic and contact information.' },
      { title: 'Attendance & fees', text: 'Quick daily registers and clear fee tracking.' },
      { title: 'Reports', text: 'Exportable reports that replace manual spreadsheets.' },
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs'],
    outcome:
      'A single, organised system that reduces administrative workload and keeps the whole school community better informed.',
    services: ['school-management-systems', 'business-dashboards', 'web-applications'],
    visual: { kind: 'dashboard', bg: '#0f5c45', accent: '#d8ff3e', tone: '#eaf7f1', ink: '#ffffff', strap: 'Your school, organised' },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const projectsBySlugs = (slugs: string[]) =>
  slugs.map((s) => getProject(s)).filter((p): p is Project => Boolean(p));
