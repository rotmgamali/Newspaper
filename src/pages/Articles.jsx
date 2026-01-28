import React from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const Articles = () => {
    // Group articles by category
    const categories = [...new Set(articles.map(a => a.category))];

    return (
        <main className="container articles-page">
            <div className="page-header">
                <span className="section-label">Archive Registry</span>
                <h2>The Library of Civics</h2>
                <p className="subtitle">All categories visible at a glance. Select a piece to begin.</p>
            </div>

            <div className="compact-magazine-grid">
                {categories.map(cat => (
                    <section key={cat} className="compact-category-col">
                        <div className="category-mini-header">
                            <span className="cat-dot"></span>
                            <h3>{cat}</h3>
                        </div>
                        <div className="compact-article-list">
                            {articles.filter(a => a.category === cat).map(article => (
                                <Link to={`/article/${article.id}`} key={article.id} className="compact-card-link">
                                    <article className="mini-article-card">
                                        <div className="mini-card-thumb">
                                            <img src={article.image} alt="" />
                                        </div>
                                        <div className="mini-card-text">
                                            <h4>{article.title}</h4>
                                            <span className="mini-author">by {article.author}</span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                            {/* Placeholder for "More in Category" if needed */}
                            <Link to={`/category/${cat}`} className="view-cat-all">View All in {cat} &rarr;</Link>
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
};

export default Articles;
