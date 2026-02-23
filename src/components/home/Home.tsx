import { ContactForm } from './ContactForm';
import { Hero } from './Hero';
import { LogoStrip } from './LogoStrip';
import { ServiceGrid } from './ServiceGrid';
import type { SiteContent } from '@/types';
import './home.css';

export function HomePage(props: {content: SiteContent}) {
    const { content } = props;

    return <main className="home-page">
        <Hero hero={content.hero} />
        <ServiceGrid />
        <LogoStrip />
        <ContactForm />
    </main>
}