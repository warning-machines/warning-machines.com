/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { Article } from '@/types';

type ArticlePageProps = {
  article?: Article;
};

export function ArticlePage({ article }: ArticlePageProps) {
  if (!article) {
    return (
      <main className="section blog">
        <div className="section__header">
          <h1>Article not found</h1>
          <p className="section__lede">The article you’re looking for doesn’t exist.</p>
          <Link className="link" href="/blog">Back to blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section blog">
      <div className="section__header">
        <div className="section__header-content">
          <h1>{article.title}</h1>
          <p className="section__lede">{article.summary}</p>
        </div>
        {article.heroImage ? (
          <img className="article__hero" src={article.heroImage} alt={article.imageAlt} />
        ) : null}
        <div className="gradient"></div>
      </div>
      <article className="article__body">
      <p className="eyebrow">Blog</p>
        {article.bodyContent ? (
          article.bodyContent
        ) : article.body ? (
          <p>{article.body}</p>
        ) : (
          <p>More details coming soon.</p>
        )}
      </article>
      <div className="blog__actions">
        <Link className="link" href="/blog">Back to blog</Link>
      </div>
    </main>
  );
}

