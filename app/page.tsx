'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AIContent {
  headline: string;
  subheadline: string;
  cta: string;
  faqs: string[];
  whatsapp_message: string;
  offer_highlight?: string;
  usp_statement?: string;
  generated_image_url?: string;
  generated_video_url?: string;
  seo_meta?: { title?: string; description?: string; };
}

export default function Home() {
  const [content, setContent] = useState<AIContent | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Read the search keyword from URL (?keyword=...)
  function getKeywordFromUrl() {
    if (typeof window === 'undefined') return 'villa renovation';
    const params = new URLSearchParams(window.location.search);
    return params.get('keyword') || 'villa renovation';
  }

  useEffect(() => {
    const fetchAIContent = async () => {
      setLoading(true);
      try {
        const keyword = getKeywordFromUrl();
        const res = await fetch(
          `https://ai-landingpage-backend1.onrender.com/generate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: keyword, model: 'gpt-4o', temperature: 0.7, max_tokens: 800 }),
          }
        );
        if (!res.ok) throw new Error('Failed to load content');
        const data = await res.json();
        // Accept both "content" (new API) or flat
        setContent(data.content || data);
      } catch (err: any) {
        setError('Could not load content. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchAIContent();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div className="hero"><div className="card">Loading your luxury experience...</div></div>;
  if (error || !content) return <div className="hero"><div className="card">{error || "Error loading page."}</div></div>;

  return (
    <div className="hero">
      <div className="card">
        <img src="/logo.svg" width={64} height={64} alt="Unicorn Renovations Logo" style={{marginBottom:'1rem'}} />
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: ".5rem" }}>
          {content.headline}
        </h1>
        <h2 style={{ color: "#7a53fa", fontWeight: 700, fontSize: "1.5rem" }}>
          {content.subheadline}
        </h2>
        {content.generated_image_url && (
          <img
            src={content.generated_image_url}
            className="img-luxury"
            alt="Luxury Interior"
            loading="lazy"
          />
        )}
        <p style={{ fontWeight: 600, fontSize: "1.1rem", margin: "2rem 0 1.2rem 0" }}>
          {content.usp_statement || ""}
        </p>
        <div style={{ fontWeight: 700, color: "#a675fb", marginBottom: "0.8rem" }}>
          {content.offer_highlight || ""}
        </div>
        <a
          className="cta-btn"
          href={`https://wa.me/971501234567?text=${encodeURIComponent(content.whatsapp_message)}`}
          target="_blank"
          rel="noopener"
        >
          {content.cta}
        </a>

        <ul className="faq-list">
          {content.faqs?.map((faq, i) => (
            <li key={i}>{faq}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
