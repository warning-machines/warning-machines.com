/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { Article } from '@/types';

type BlogPageProps = {
  articles: Article[];
};

export function BlogPage({ articles }: BlogPageProps) {
  return (
    <main className="section blog">
      <div className="section__header">
        <div className="section__header-content">
          <h1>Insights from the shop floor</h1>
          <p className="section__lede">Explore how we build, validate, and ship machines across industries.</p>
        </div>
      </div>
      <div className="blog__grid">
        {articles.map((article) => (
          <article key={article.id} className="card card--article blog__card">
            {article.heroImage ? (
              <img src={article.heroImage} alt={article.imageAlt} className="card__image" />
            ) : null}
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <div className="blog__actions">
              <Link className="link" href={`/${article.id}`}>Read more</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

