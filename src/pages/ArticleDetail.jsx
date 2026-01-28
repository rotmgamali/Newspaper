import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/articles';

const ArticleDetail = () => {
    const { id } = useParams();
    const article = articles.find(a => a.id === parseInt(id)) || articles[0];

    return (
        <main className="container article-detail-page">
            <div className="article-header-detail">
                <Link to="/articles" className="category-link">{article.category}</Link>
                <h1>{article.title}</h1>
                <div className="article-meta-detail">
                    <span className="author">By {article.author}</span>
                    <span className="date">{article.date}</span>
                </div>
            </div>

            <figure className="article-main-image-container">
                <img src={article.image} alt={article.title} />
                <figcaption>{article.title} — A Common Sense 250 Perspective.</figcaption>
            </figure>

            <div className="article-body-detail">
                {article.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>
                        {idx === 0 ? <span className="first-letter">{paragraph.charAt(0)}</span> : null}
                        {idx === 0 ? paragraph.slice(1) : paragraph}
                    </p>
                ))}

                <hr className="article-separator" />
                <div className="author-bio">
                    <strong>{article.author}</strong> is a contributor to Common Sense 250, dedicated to the restoration of civic discourse in New England.
                </div>

                <div className="article-footer-cta">
                    <Link to="/about" className="gold-link">Submit a Reply to this Article &rarr;</Link>
                </div>
            </div>
        </main>
    );
};

export default ArticleDetail;
