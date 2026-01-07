

import { ArticlePage } from '@/components/blog/ArticlePage';
import Link from 'next/link';

import { OurProjects } from './projects';
import { Technologies } from './technologies';

export const dynamic = 'force-static';

import './firmware.css';

function FirmwareContent() {
    return (
        <article className="article__body">
            <Technologies />

            <Link style={{margin: '20px 50px', textAlign: 'center'}} className="button button--primary" href="/quote-form">Need firmware for you device?</Link>

            <OurProjects />

            <Link style={{margin: '20px 50px', textAlign: 'center'}} className="button button--primary" href="/quote-form">Let's turn your idea into reality!</Link>
        </article>
    );
}

export default function FirmwareServicePage() {
    return <main className="section blog service-page">
        <div className="section__header">
            <div className="section__header-content">
                <h1>Firmware development for smart devices</h1>
                <p className="section__lede">
                    Our expirienced team of firmware engineers develops sophisticated embedded systems for IoT, robotics and other applications.
                </p>
            </div>
            <img className="article__hero" src='/images/articles/firmware.png' alt='Firmware development for smart devices' />
            <div className="gradient"></div>
        </div>
        <FirmwareContent />
    </main>
}

