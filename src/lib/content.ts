import type { Article, Hero, Service, SiteContent, Slide } from '@/types';

export const hero: Hero = {
  headline: 'From concept to reality',
  subheadline: "Let's bring your idea to life",
  ctaPrimary: 'Send',
  ctaSecondary: 'Request demo',
};

export const capabilities: Service[] = [
  { id: 'pcb', title: 'PCB & Firmware', description: 'Custom PCB design, firmware and validation.' },
  { id: 'cnc', title: 'CNC Machining', description: 'Precision parts, prototypes, and low-volume production.' },
  { id: 'printing', title: '3D Printing', description: 'Rapid prototypes using FDM, SLA, and SLS.' },
  { id: 'moulding', title: 'Injection Moulding', description: 'Fast tooling and short-run plastic parts.' },
  { id: 'hardware', title: 'Hardware Design', description: 'End-to-end device design and integration.' },
  { id: 'software', title: 'Software Design', description: 'Embedded, web, and cloud integration support.' },
];

export const highlights: string[] = [
  'Integrated hardware development services',
  'Rapid prototyping to scalable production',
  'Low-volume manufacturing and validation',
];

export const articles: Article[] = [
  {
    id: 'firmware',
    title: 'The Hidden Engine Behind Every Smart Product',
    headTitle: 'Firmware for Prototypes: Guide to Smart Product Development',
    summary: 'Why firmware is the backbone of smart products and how to build it right from day one.',
    imageAlt: 'Close-up of a green PCB with firmware tools.',
    heroImage: '/images/articles/firmware.png',
  },
  {
    id: 'healthcare-mvp-prototyping',
    title: 'From Care to Cure: Craft Your Health MVP Story!',
    headTitle: 'Build Your healthcare MVP prototyping fast and easy',
    summary: 'A practical guide to prototyping healthcare products quickly while staying compliance-minded.',
    imageAlt: 'Medical device prototype with 3D-printed casing and PCB.',
    heroImage: '/images/articles/care-to-cure.png',
  },
  {
    id: 'build-your-product-mvp',
    title: 'From Idea to Investment: Build Your Product MVP!',
    headTitle: 'From Idea to Investment: Build Your Product MVP',
    summary: 'How to turn a spark into an investor-ready MVP with clear proof and a scale path.',
    imageAlt: 'Product MVP comparison shots.',
    heroImage: '/images/articles/idea-to-investment.png',
  },
  {
    id: 'cnc-machines-vs-3d-printer',
    title: 'CNC Machines vs 3D Printers: Which Is Better for Prototyping?',
    headTitle: 'CNC Machines vs 3D Printers | Warning Machines',
    summary: 'Choosing the right process for speed, finish, materials, and cost across prototype phases.',
    imageAlt: 'Workshop with CNC and 3D printing equipment.',
    heroImage: '/images/articles/cnc-vs-3d.png',
  },
  {
    id: 'build-my-idea',
    title: 'Build My Idea: A Guide to Turning Your Vision into Reality',
    headTitle: 'Build My Idea: top 10 guides for brilliant ideas',
    summary: 'Step-by-step approach to go from concept to validated prototype.',
    imageAlt: 'Lightbulb and prototype sketches',
    heroImage: '/images/articles/build-my-idea.png',
  },
  {
    id: 'pcb-design-mistakes',
    title: 'Top 10 Common PCB Design Mistakes and How to Avoid Them',
    headTitle: 'Top 10 PCB Design Mistakes to Avoid | Warning Machines',
    summary: 'Avoid the most frequent PCB pitfalls—from placement and grounding to DFM—and ship reliable boards.',
    imageAlt: 'PCB traces and components',
    heroImage: '/images/articles/pcb-design-mistakes.png',
  },
  {
    id: 'prototyping-2',
    title: 'CNC Machine vs. 3D Printing: Which Is Better for Prototyping?',
    headTitle: 'Prototyping: CNC Machine vs 3D Printing | Warning Machines',
    summary: 'A deep comparison of CNC machining and 3D printing across speed, materials, finish, and cost.',
    imageAlt: 'CNC machine and 3D printer side by side',
    heroImage: '/images/articles/prototyping-2.png',
  },
  {
    id: 'guide-to-cnc-machining',
    title: 'The Ultimate Guide to CNC Machining: Precision, Prototyping, and Production',
    headTitle: 'The Ultimate Guide to CNC Machining | Warning Machines',
    summary: 'Comprehensive overview of CNC processes, materials, tolerances, and best practices.',
    imageAlt: 'CNC machining guide imagery',
    heroImage: '/images/articles/the-ultimate-guide-to-cnc-machining.png',
  },
  {
    id: 'prototyping',
    title: 'Prototyping: Fast-Tracking Product Development and Innovation',
    headTitle: 'Transformative Prototyping in 30 Days | Warning Machines',
    summary: 'How modern prototyping shrinks timelines, reduces risk, and drives innovation from concept to reality.',
    imageAlt: 'Prototype parts on a workbench',
    heroImage: '/images/articles/prototyping.png',
  },
  {
    id: 'cnc-machining',
    title: 'World-Class CNC Machining & Rapid Prototyping',
    headTitle: 'Elite CNC Machining in 30 Days | Warning Machines',
    summary: 'Engineer-run CNC machining studio turning CAD concepts into production-ready metal or plastic parts in ≤30 days.',
    imageAlt: 'Close-up of a titanium impeller being milled at high RPM',
    heroImage: '/images/articles/cnc-machining.png',
  },
  {
    id: '3d-printing',
    title: '3D Printing Services: Accelerating Innovation',
    headTitle: '3D Printing & Rapid Prototyping - Warning Machines',
    summary: 'Comprehensive guide to professional 3D printing services - from rapid prototyping to production. Learn how additive manufacturing accelerates innovation in medical, automotive, aerospace, and renewable energy industries.',
    imageAlt: 'Male engineer wearing safety glasses analyzes a complex metal lattice part beside other 3D-printed prototypes in a high-tech additive manufacturing lab with 3D printing technology',
    heroImage: '/images/articles/3d-printing.png',
  },
  {
    id: 'pcb-developer',
    title: 'Key Stages for a PCB Developer: Functionality and Reliability',
    headTitle: '6 Key Stages for a PCB Developer | Warning Machines',
    summary: 'The methodical steps from schematic to final validation that make reliable PCBs.',
    imageAlt: 'Engineer working on PCB layout',
    heroImage: '/images/articles/pcb-developer.png',
  },
  {
    id: 'low-volume-manufacturing',
    title: 'Low-Volume Manufacturing: The Ideal Solution for Startups and Niche Products',
    headTitle: 'Low-Volume Manufacturing: The Ideal Solution for Startups and Niche Products | Warning Machines',
    summary: 'Why small-batch production de-risks scaling and fits niche markets.',
    imageAlt: 'Small-batch manufactured parts',
    heroImage: '/images/articles/low-volume-manufacturing.png',
  },
  {
    id: 'built-custom-electric-bike',
    title: 'Built a Custom Electric Bike from Scratch',
    headTitle: 'Custom Electric Bike Development | Prototyping under 90 days',
    summary: 'A sprint plan to design, prototype, and validate a custom e-bike in three months.',
    imageAlt: 'Electric bike prototype',
    heroImage: '/images/articles/custom-electric-bike-development.png',
  },
  {
    id: 'rapid-prototyping',
    title: 'Rapid Prototyping vs Final Production',
    headTitle: 'Rapid Prototyping vs Production | WARNING MACHINES',
    summary: 'When to pivot from prototyping to production, and how processes, cost, and quality differ.',
    imageAlt: 'Production line and prototype parts',
    heroImage: '/images/articles/rapid-prototyping-vs-production.png',
  },
  {
    id: 'hardware-product-design',
    title: 'Mistakes in Hardware Product Design',
    headTitle: '5 Hardware Product Design Mistakes | Warning Machines',
    summary: 'Common pitfalls in hardware design and how to avoid them early.',
    imageAlt: 'Hardware product design desk',
    heroImage: '/images/articles/hardware-product-design.png',
  },
  {
    id: 'how-build-a-robot',
    title: 'How Build a Robot from Scratch',
    headTitle: 'Robot Development Process | best Custom Robotics Engineering',
    summary: 'Complete guide to the robot development process - from concept to production. Learn how WARNING MACHINES transforms robotic ideas into fully functional, production-ready machines.',
    imageAlt: 'Robot Development',
    heroImage: '/images/articles/build-robot.png',
  },
];

export const slides: Slide[] = [
  {
    id: 'fast-tooling-1',
    title: 'Fast Tooling = Faster Feedback',
    description: 'Low-volume molds, printed jigs, and fixtures accelerate validation with minimal delay.',
    image: '/images/slide1.png',
  },
  {
    id: 'fast-tooling-2',
    title: 'Low-volume molds, printed jigs, fixtures',
    description: 'Iterate quickly with hybrid CNC and printed tooling tailored to your prototype runs.',
    image: '/images/slide2.png',
  },
];

export const siteContent: SiteContent = {
  hero,
  capabilities,
  highlights,
  articles,
  slides,
};

export function getArticleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export const fallbackContent = siteContent;
