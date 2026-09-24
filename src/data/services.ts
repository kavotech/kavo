export type CategoryKey = 'websites' | 'software' | 'growth';

export interface ServiceCategory {
  key: CategoryKey;
  name: string;
  number: string;
  summary: string;
  intro: string;
  theme: 'theme-light' | 'theme-dark' | 'theme-volt' | 'theme-bone' | 'theme-cobalt';
  accent: string;
}

export interface Service {
  slug: string;
  name: string;
  category: CategoryKey;
  short: string;
  headline: string;
  intro: string;
  benefits: { title: string; text: string }[];
  approach: { title: string; text: string }[];
  deliverables: string[];
  related: string[];
}

export const categories: ServiceCategory[] = [
  {
    key: 'websites',
    name: 'Websites',
    number: '01',
    summary: 'Beautiful, fast and scalable websites built to turn attention into action.',
    intro:
      'From a sharp first impression to a full online store, we design and engineer websites that load fast, rank well and make it easy for people to say yes.',
    theme: 'theme-light',
    accent: '#d8ff3e',
  },
  {
    key: 'software',
    name: 'Software',
    number: '02',
    summary: 'Apps, dashboards and digital platforms engineered around real business needs.',
    intro:
      'Mobile apps, web applications and internal tools that remove friction from how your business runs — designed for the people who use them every day.',
    theme: 'theme-dark',
    accent: '#2a36ff',
  },
  {
    key: 'growth',
    name: 'Growth',
    number: '03',
    summary: 'Digital marketing, search and online strategy designed to help businesses grow.',
    intro:
      'Search, paid media, social and strategy that put your business in front of the right people — and keep improving once they arrive.',
    theme: 'theme-volt',
    accent: '#ff6b4a',
  },
];

export const services: Service[] = [
  /* ---------------------------------------------------------------- Websites */
  {
    slug: 'web-design',
    name: 'Website Design',
    category: 'websites',
    short: 'Distinctive, conversion-focused website design.',
    headline: 'Websites that look the part and work even harder.',
    intro:
      'We design websites that make a confident first impression and guide visitors towards the action that matters — an enquiry, a booking, a purchase. Every layout is built on your brand, your audience and a clear commercial goal.',
    benefits: [
      { title: 'Built around your goal', text: 'Every page has a job. We design the journey to the enquiry, booking or sale first, then make it beautiful.' },
      { title: 'Distinctive, not templated', text: 'Bespoke layouts and art direction that feel like your brand — never a theme with your logo dropped in.' },
      { title: 'Mobile first', text: 'Most visitors arrive on a phone. We design for small screens first and scale up with intent.' },
      { title: 'Accessible by default', text: 'Clear contrast, readable type and keyboard-friendly interfaces so the site works for everyone.' },
    ],
    approach: [
      { title: 'Discovery', text: 'We map your audience, competitors and goals, and agree the pages and content that matter.' },
      { title: 'Structure', text: 'Sitemaps and wireframes define hierarchy and flow before visual design begins.' },
      { title: 'Visual design', text: 'High-fidelity designs across desktop and mobile, refined together in short feedback loops.' },
      { title: 'Handover', text: 'A documented design system, ready for development and easy to extend later.' },
    ],
    deliverables: ['Sitemap & wireframes', 'Responsive UI design', 'Design system', 'Interactive prototype', 'Content guidance', 'Developer handover'],
    related: ['moonstone-advocates', 'kampala-diplomatic-international-school', 'voltex-construction'],
  },
  {
    slug: 'web-development',
    name: 'Website Development',
    category: 'websites',
    short: 'Fast, secure, scalable builds on modern tech.',
    headline: 'Engineered for speed, built to scale.',
    intro:
      'We turn designs into fast, secure and maintainable websites using modern frameworks. Clean code, strong performance and an editing experience your team will actually enjoy.',
    benefits: [
      { title: 'Performance obsessed', text: 'Lean pages, optimised images and modern hosting so the site feels instant on any connection.' },
      { title: 'Easy to manage', text: 'Content editing set up around how your team works, so updates never need a developer.' },
      { title: 'SEO foundations', text: 'Semantic markup, metadata, structured data and sitemaps built in from day one.' },
      { title: 'Secure & reliable', text: 'Sensible hosting, HTTPS, form protection and monitoring as standard.' },
    ],
    approach: [
      { title: 'Architecture', text: 'We choose the right stack for your content, integrations and budget.' },
      { title: 'Build', text: 'Component-based development with weekly previews on a live staging link.' },
      { title: 'Quality', text: 'Cross-device, accessibility and performance testing before anything goes live.' },
      { title: 'Launch', text: 'Domain, hosting, redirects and analytics handled so launch day is uneventful.' },
    ],
    deliverables: ['Front-end development', 'CMS setup', 'Forms & integrations', 'Performance optimisation', 'Hosting & deployment', 'Analytics setup'],
    related: ['kampala-diplomatic-international-school', 'hauseworks', 'rm-mangoes'],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    category: 'websites',
    short: 'Online stores that make buying effortless.',
    headline: 'Online stores that make buying effortless.',
    intro:
      'We design and build e-commerce experiences that showcase products beautifully and remove every unnecessary step between browsing and checkout — on Shopify, WooCommerce or a custom stack.',
    benefits: [
      { title: 'Friction-free checkout', text: 'Short, trustworthy checkout flows with the payment methods your customers expect.' },
      { title: 'Products that sell', text: 'Photography-led layouts, clear pricing and helpful detail that answer questions before they are asked.' },
      { title: 'Simple to run', text: 'Stock, orders and promotions managed from one place, without spreadsheets.' },
      { title: 'Ready to grow', text: 'Built to plug into marketing, reviews, delivery and accounting tools as you scale.' },
    ],
    approach: [
      { title: 'Catalogue planning', text: 'We structure categories, variants and filters around how customers shop.' },
      { title: 'Store design', text: 'Product, collection and checkout journeys designed mobile-first.' },
      { title: 'Build & integrate', text: 'Platform setup, payments, shipping rules and integrations.' },
      { title: 'Launch & optimise', text: 'Tracking in place from day one so we can keep improving conversion.' },
    ],
    deliverables: ['Store design', 'Shopify / WooCommerce / custom build', 'Payment integration', 'Product setup', 'Shipping & tax rules', 'Conversion tracking'],
    related: ['rm-mangoes', 'punjab-exotic-foods'],
  },
  {
    slug: 'ui-ux',
    name: 'UI/UX Design',
    category: 'websites',
    short: 'Interfaces people understand instantly.',
    headline: 'Interfaces people understand instantly.',
    intro:
      'Good products feel obvious. We research, map and prototype user journeys, then design interfaces that make complex tasks feel simple — for websites, apps and internal tools alike.',
    benefits: [
      { title: 'Evidence over opinion', text: 'Decisions grounded in user research, analytics and testing — not guesswork.' },
      { title: 'Fewer build surprises', text: 'Clickable prototypes validate ideas before engineering time is spent.' },
      { title: 'Consistent systems', text: 'Reusable components and patterns keep products coherent as they grow.' },
      { title: 'Inclusive design', text: 'Accessibility considered from the first sketch, not bolted on at the end.' },
    ],
    approach: [
      { title: 'Research', text: 'Interviews, audits and analytics to understand real behaviour.' },
      { title: 'Journeys', text: 'User flows and information architecture that remove dead ends.' },
      { title: 'Prototype', text: 'Interactive prototypes tested with real users.' },
      { title: 'Design system', text: 'A component library ready for developers and future features.' },
    ],
    deliverables: ['UX audit', 'User flows', 'Wireframes', 'High-fidelity UI', 'Prototypes', 'Component library'],
    related: ['breezyee-go', 'oasis-school-management'],
  },
  {
    slug: 'website-maintenance',
    name: 'Website Maintenance',
    category: 'websites',
    short: 'Care plans that keep your site sharp.',
    headline: 'Keep your website fast, secure and current.',
    intro:
      'A website is never finished. Our care plans cover updates, backups, monitoring, content changes and small improvements, so your site keeps performing long after launch.',
    benefits: [
      { title: 'Always up to date', text: 'Platform, plugin and dependency updates applied and tested safely.' },
      { title: 'Protected', text: 'Backups, uptime monitoring and security checks as standard.' },
      { title: 'A team on call', text: 'Content edits and fixes handled quickly by people who know your site.' },
      { title: 'Continuous improvement', text: 'Regular reviews of speed, SEO and conversion with practical next steps.' },
    ],
    approach: [
      { title: 'Audit', text: 'We review your current site, hosting and risks.' },
      { title: 'Stabilise', text: 'Fix urgent issues and put monitoring and backups in place.' },
      { title: 'Maintain', text: 'Scheduled updates and a simple way to request changes.' },
      { title: 'Improve', text: 'Periodic recommendations to keep the site ahead.' },
    ],
    deliverables: ['Updates & patching', 'Backups', 'Uptime monitoring', 'Content changes', 'Performance reviews', 'Priority support'],
    related: ['moonstone-advocates', 'voltex-construction'],
  },

  /* ---------------------------------------------------------------- Software */
  {
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    category: 'software',
    short: 'iOS and Android apps people keep opening.',
    headline: 'Mobile apps people actually keep.',
    intro:
      'We design and build cross-platform mobile apps with React Native and Expo — one codebase, native feel on iOS and Android, and a backend ready to scale with your users.',
    benefits: [
      { title: 'One codebase, two platforms', text: 'React Native lets us ship to iOS and Android together, faster and more affordably.' },
      { title: 'Native-feeling UX', text: 'Smooth gestures, sensible navigation and offline-aware design.' },
      { title: 'Real backends', text: 'Authentication, payments, notifications and data built on proven infrastructure.' },
      { title: 'Store-ready', text: 'We guide you through App Store and Google Play submission and updates.' },
    ],
    approach: [
      { title: 'Product definition', text: 'We shape the MVP — the smallest version that proves real value.' },
      { title: 'UX & UI', text: 'Flows and screens designed and prototyped on real devices.' },
      { title: 'Build', text: 'Iterative development with test builds on your phone every sprint.' },
      { title: 'Release & iterate', text: 'Store launch, analytics and a roadmap for what comes next.' },
    ],
    deliverables: ['Product strategy', 'App UX/UI', 'React Native / Expo build', 'Backend & APIs', 'Payments & notifications', 'Store submission'],
    related: ['breezyee-go'],
  },
  {
    slug: 'web-applications',
    name: 'Web Applications & Custom Platforms',
    category: 'software',
    short: 'Custom platforms built around your operations.',
    headline: 'Custom platforms, built around how you work.',
    intro:
      'When off-the-shelf software gets in the way, we build web applications around your processes — portals, marketplaces, client areas and workflow tools that scale with the business.',
    benefits: [
      { title: 'Fits your process', text: 'Software shaped around your workflows, not the other way round.' },
      { title: 'Secure by design', text: 'Role-based access, audit trails and sensible data handling.' },
      { title: 'Integrated', text: 'Connects with the payment, accounting and communication tools you already use.' },
      { title: 'Yours to own', text: 'Documented, maintainable code with no lock-in.' },
    ],
    approach: [
      { title: 'Process mapping', text: 'We document how work actually happens today and where it breaks.' },
      { title: 'Architecture', text: 'Data models, permissions and integrations planned up front.' },
      { title: 'Iterative build', text: 'Working software early, refined with real users.' },
      { title: 'Rollout', text: 'Migration, training and support as your team adopts the platform.' },
    ],
    deliverables: ['Discovery & specification', 'Platform architecture', 'Full-stack development', 'Integrations & APIs', 'Admin tooling', 'Training & support'],
    related: ['oasis-school-management', 'breezyee-go'],
  },
  {
    slug: 'business-dashboards',
    name: 'Business Dashboards',
    category: 'software',
    short: 'Live data, clearly presented.',
    headline: 'See your whole business at a glance.',
    intro:
      'We bring data from sales, operations and marketing into clear, live dashboards — so decisions are made on today’s numbers, not last month’s spreadsheet.',
    benefits: [
      { title: 'One source of truth', text: 'Data from multiple systems combined into a single, reliable view.' },
      { title: 'Designed for decisions', text: 'The right metrics, in the right order, for each role.' },
      { title: 'Always current', text: 'Automated syncing replaces manual exports and copy-paste.' },
      { title: 'Access controlled', text: 'Everyone sees what they need — and nothing they shouldn’t.' },
    ],
    approach: [
      { title: 'Metrics workshop', text: 'We agree the questions the dashboard must answer.' },
      { title: 'Data plumbing', text: 'Connect sources and build a clean, trustworthy data model.' },
      { title: 'Visual design', text: 'Charts and layouts designed for clarity on desktop and mobile.' },
      { title: 'Adoption', text: 'Training and refinements as your team starts using it daily.' },
    ],
    deliverables: ['KPI definition', 'Data integrations', 'Dashboard UI', 'Role-based access', 'Automated reporting', 'Documentation'],
    related: ['oasis-school-management'],
  },
  {
    slug: 'booking-systems',
    name: 'Booking Systems',
    category: 'software',
    short: 'Bookings, scheduling and payments in one flow.',
    headline: 'Bookings that run themselves.',
    intro:
      'Online booking, scheduling and payment systems that fill your calendar while you sleep — with reminders, deposits and admin tools that cut out the back-and-forth.',
    benefits: [
      { title: '24/7 bookings', text: 'Customers book when it suits them, on any device.' },
      { title: 'Fewer no-shows', text: 'Automated confirmations, reminders and optional deposits.' },
      { title: 'Payments built in', text: 'Take deposits or full payment securely at the point of booking.' },
      { title: 'Simple admin', text: 'Manage availability, staff and bookings from one clear screen.' },
    ],
    approach: [
      { title: 'Rules & availability', text: 'We map your services, durations, staff and capacity.' },
      { title: 'Customer journey', text: 'A short, mobile-first booking flow designed to convert.' },
      { title: 'Build & integrate', text: 'Calendars, payments and notifications connected.' },
      { title: 'Launch', text: 'Testing with real bookings and staff training.' },
    ],
    deliverables: ['Booking flow design', 'Availability engine', 'Payments & deposits', 'Email & SMS reminders', 'Admin dashboard', 'Calendar sync'],
    related: ['hauseworks', 'breezyee-go'],
  },
  {
    slug: 'school-management-systems',
    name: 'School Management Systems',
    category: 'software',
    short: 'Admissions, records and fees in one place.',
    headline: 'Run your school from one clear platform.',
    intro:
      'We build school management systems that bring admissions, student records, attendance, fees and parent communication together — designed for administrators, teachers and families.',
    benefits: [
      { title: 'Less admin', text: 'Automate repetitive tasks such as fee reminders, reports and attendance.' },
      { title: 'Connected community', text: 'Parents, staff and administrators on the same page.' },
      { title: 'Secure records', text: 'Role-based access to sensitive student information.' },
      { title: 'Works everywhere', text: 'Responsive design for office desktops and parents’ phones alike.' },
    ],
    approach: [
      { title: 'School workflows', text: 'We learn how admissions, terms and fees work in your school.' },
      { title: 'Modules', text: 'Prioritise the modules that remove the most admin first.' },
      { title: 'Build & migrate', text: 'Develop the platform and bring existing records across.' },
      { title: 'Training', text: 'Hands-on onboarding for staff at every level.' },
    ],
    deliverables: ['Admissions module', 'Student records', 'Attendance', 'Fees & invoicing', 'Parent portal', 'Reports'],
    related: ['oasis-school-management', 'kampala-diplomatic-international-school'],
  },

  /* ------------------------------------------------------------------ Growth */
  {
    slug: 'seo',
    name: 'SEO',
    category: 'growth',
    short: 'Be found by people already searching.',
    headline: 'Be found by the people already looking.',
    intro:
      'Search engine optimisation that combines technical health, useful content and local visibility — so the customers already searching for what you do find you first.',
    benefits: [
      { title: 'Technical foundations', text: 'Speed, indexing, structured data and site architecture fixed properly.' },
      { title: 'Content that ranks', text: 'Pages and articles built around what your customers actually search for.' },
      { title: 'Local visibility', text: 'Stronger presence in map results and local searches.' },
      { title: 'Clear reporting', text: 'Plain-English reporting on rankings, traffic and enquiries.' },
    ],
    approach: [
      { title: 'Audit', text: 'A technical and content audit with prioritised fixes.' },
      { title: 'Keyword strategy', text: 'Research into intent, competition and opportunity.' },
      { title: 'Optimise', text: 'On-page, technical and content improvements delivered in sprints.' },
      { title: 'Measure', text: 'Track progress and double down on what works.' },
    ],
    deliverables: ['Technical SEO audit', 'Keyword research', 'On-page optimisation', 'Content plan', 'Local SEO', 'Monthly reporting'],
    related: ['moonstone-advocates', 'voltex-construction'],
  },
  {
    slug: 'google-business',
    name: 'Google Business',
    category: 'growth',
    short: 'Own your local search presence.',
    headline: 'Show up when locals search.',
    intro:
      'We set up and optimise your Google Business Profile so you appear in local searches and on Maps with accurate information, strong visuals and a steady flow of genuine reviews.',
    benefits: [
      { title: 'Appear on Maps', text: 'An optimised profile that surfaces for nearby, high-intent searches.' },
      { title: 'Accurate everywhere', text: 'Hours, services and contact details consistent across the web.' },
      { title: 'Review strategy', text: 'Simple processes to ask happy customers for honest reviews.' },
      { title: 'Fresh content', text: 'Regular posts and photos that keep your profile active.' },
    ],
    approach: [
      { title: 'Claim & verify', text: 'We set up or recover your profile and verify ownership.' },
      { title: 'Optimise', text: 'Categories, services, photos and descriptions completed properly.' },
      { title: 'Stay active', text: 'Posting and review-response routines put in place.' },
      { title: 'Report', text: 'Insight into calls, direction requests and views.' },
    ],
    deliverables: ['Profile setup', 'Category & service optimisation', 'Photo guidance', 'Review process', 'Post schedule', 'Performance insights'],
    related: ['hauseworks', 'voltex-construction'],
  },
  {
    slug: 'google-ads',
    name: 'Google Ads',
    category: 'growth',
    short: 'Paid search that pays its way.',
    headline: 'Paid search that earns its keep.',
    intro:
      'We plan, build and manage Google Ads campaigns focused on enquiries and sales, not vanity clicks — with clear tracking so you always know what your budget is doing.',
    benefits: [
      { title: 'Intent-led targeting', text: 'Budget focused on searches that signal real buying intent.' },
      { title: 'Conversion tracking', text: 'Calls, forms and purchases tracked properly from day one.' },
      { title: 'Landing pages that convert', text: 'Ads and pages designed together for consistency.' },
      { title: 'Continuous tuning', text: 'Regular optimisation of keywords, bids and creative.' },
    ],
    approach: [
      { title: 'Strategy', text: 'Goals, budgets and audiences agreed up front.' },
      { title: 'Build', text: 'Campaign structure, ad copy and tracking set up.' },
      { title: 'Launch', text: 'Careful launch with close monitoring in the first weeks.' },
      { title: 'Optimise', text: 'Ongoing testing and transparent reporting.' },
    ],
    deliverables: ['Campaign strategy', 'Account setup', 'Ad copy', 'Conversion tracking', 'Landing page advice', 'Monthly reporting'],
    related: ['rm-mangoes', 'punjab-exotic-foods'],
  },
  {
    slug: 'social-media',
    name: 'Social Media',
    category: 'growth',
    short: 'Content and campaigns with personality.',
    headline: 'Social that sounds like you.',
    intro:
      'Strategy, content and management for the platforms your customers actually use — building a recognisable voice and a community that turns into customers.',
    benefits: [
      { title: 'A clear voice', text: 'Tone, visual style and content pillars that feel unmistakably yours.' },
      { title: 'Consistent output', text: 'Planned calendars so you never scramble for a post.' },
      { title: 'Designed to stop the scroll', text: 'Graphics, short-form video concepts and captions built for each platform.' },
      { title: 'Insight-led', text: 'Analytics that show what resonates, so we can do more of it.' },
    ],
    approach: [
      { title: 'Audit', text: 'Review your channels, competitors and audience.' },
      { title: 'Strategy', text: 'Pillars, formats and a posting rhythm agreed together.' },
      { title: 'Create', text: 'Content designed, written and scheduled.' },
      { title: 'Grow', text: 'Community management and monthly insight.' },
    ],
    deliverables: ['Channel audit', 'Content strategy', 'Post design', 'Content calendar', 'Community management', 'Analytics reporting'],
    related: ['rm-mangoes', 'hauseworks'],
  },
  {
    slug: 'digital-strategy',
    name: 'Digital Strategy',
    category: 'growth',
    short: 'A clear plan for your digital next steps.',
    headline: 'Know exactly what to build next.',
    intro:
      'We help businesses decide where to invest online — from choosing the right platform to planning a product roadmap — so every pound spent on digital has a clear purpose.',
    benefits: [
      { title: 'Clarity', text: 'A prioritised plan everyone in the business understands.' },
      { title: 'Right-sized solutions', text: 'Honest advice on what to build, buy or skip.' },
      { title: 'Joined-up thinking', text: 'Website, software and marketing planned as one system.' },
      { title: 'Measurable', text: 'Clear goals and measures so progress is visible.' },
    ],
    approach: [
      { title: 'Listen', text: 'Stakeholder interviews and a review of your current tools.' },
      { title: 'Analyse', text: 'Audience, competitor and technology analysis.' },
      { title: 'Plan', text: 'A phased roadmap with priorities, budgets and owners.' },
      { title: 'Support', text: 'We stay on hand to help you deliver it.' },
    ],
    deliverables: ['Stakeholder workshops', 'Digital audit', 'Competitor review', 'Technology recommendations', 'Roadmap', 'Measurement plan'],
    related: ['oasis-school-management', 'breezyee-go'],
  },
];

export const servicesByCategory = (key: CategoryKey) => services.filter((s) => s.category === key);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getCategory = (key: CategoryKey) => categories.find((c) => c.key === key)!;
