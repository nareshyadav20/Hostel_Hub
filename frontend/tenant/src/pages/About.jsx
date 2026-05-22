import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, Users, ShieldCheck, Heart, Sparkles, TrendingUp,
  ChevronLeft, Phone, Mail, MapPin, Star
} from 'lucide-react';
import './About.css';

const testimonials = [
  {
    name: 'Ananya R.',
    role: 'Resident, Koramangala',
    text: '"Livora is not just a place to stay — it\'s a place to belong. The community, amenities and 24/7 support are truly world-class!"',
    rating: 5,
  },
  {
    name: 'Aarav M.',
    role: 'Software Engineer, Bengaluru',
    text: '"I\'ve lived across 3 Livora properties. The quality and community vibe is absolutely unmatched. I wouldn\'t live anywhere else."',
    rating: 5,
  },
  {
    name: 'Priya S.',
    role: 'Product Manager, Hyderabad',
    text: '"Raised a maintenance request at 11pm — fixed by morning. Never had this experience anywhere else. Livora sets the gold standard."',
    rating: 5,
  },
];

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page-elite">



      <main>

        {/* ─── 1. HERO ─── */}
        <section className="about-hero-section">
          <div className="about-container about-hero-grid">

            <div className="about-hero-left">
              <div className="about-badge-modern">
                <Sparkles size={15} /> Since 2024
              </div>
              <h1 className="about-title-hero">
                Redefining Modern Living,<br />
                <span className="text-primary-gradient">One Stay at a Time.</span>
              </h1>
              <p className="about-subtitle-hero">
                Finding quality, safe, and community-driven accommodation shouldn't be hard.
                We combine technology with high-touch hospitality to create seamless living experiences.
              </p>

              <div className="about-hero-stats">
                <div className="stat-card-glass">
                  <div className="stat-val">10k+</div>
                  <div className="stat-lbl">Happy Residents</div>
                </div>
                <div className="stat-card-glass">
                  <div className="stat-val">50+</div>
                  <div className="stat-lbl">Properties</div>
                </div>
                <div className="stat-card-glass">
                  <div className="stat-val">4.9★</div>
                  <div className="stat-lbl">Avg. Rating</div>
                </div>
              </div>
            </div>

            <div className="about-hero-right">
              <div className="hero-image-wrapper">
                <div className="hero-glow-blob" />
                <img
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200"
                  alt="Modern Hostel Room"
                  className="hero-main-img"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ─── 2. TRUST STRIP ─── */}
        <div className="about-trust-strip">
          <div className="about-container trust-inner">
            {[
              'Zero Brokerage',
              'Verified Properties',
              '24/7 Dedicated Support',
              'Flexible Rent Plans',
              'Transparent Pricing',
            ].map((item) => (
              <div className="trust-item" key={item}>
                <div className="trust-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ─── 3. MISSION ─── */}
        <section className="about-mission-section">
          <div className="about-container about-mission-grid">

            <div className="mission-content">
              <span className="section-eyebrow">Our Purpose</span>
              <h2 className="section-title">The Livora Mission</h2>
              <p className="section-subtitle">
                To build a network of premium spaces that prioritize your comfort,
                peace of mind, and personal growth.
              </p>

              <div className="mission-points">
                <div className="mission-point-item">
                  <div className="point-icon-circle"><CheckCircle size={24} /></div>
                  <div className="point-text">
                    <h4>Quality First, Always</h4>
                    <p>Every property is meticulously hand-picked, verified, and maintained to hotel-like standards every single day.</p>
                  </div>
                </div>

                <div className="mission-point-item">
                  <div className="point-icon-circle"><Users size={24} /></div>
                  <div className="point-text">
                    <h4>Community at Our Core</h4>
                    <p>We foster environments that connect people, encourage networking, and build lifelong friendships beyond just accommodation.</p>
                  </div>
                </div>

                <div className="mission-point-item">
                  <div className="point-icon-circle"><Star size={24} /></div>
                  <div className="point-text">
                    <h4>Premium at Every Level</h4>
                    <p>From our app to our interiors, we obsess over delivering a genuinely premium experience at every single touchpoint.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mission-image-col">
              <img
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000"
                alt="Livora Community Space"
                className="mission-tall-img"
              />
            </div>

          </div>
        </section>

        {/* ─── 4. CORE VALUES ─── */}
        <section className="about-values-section">
          <div className="about-container">
            <div className="values-header">
              <span className="section-eyebrow">What We Stand For</span>
              <h2 className="section-title text-center" style={{ marginBottom: 14 }}>Our Core Values</h2>
              <p className="section-subtitle text-center mx-auto" style={{ maxWidth: 560, marginBottom: 0 }}>
                Four pillars that guide every decision we make and every experience we build.
              </p>
            </div>

            <div className="values-grid-4">
              <div className="value-glass-card">
                <div className="value-icon-bg"><Sparkles size={28} /></div>
                <h4>Excellence</h4>
                <p>We never settle for "good enough". We strive for excellence in every detail of your stay, every single day.</p>
              </div>

              <div className="value-glass-card">
                <div className="value-icon-bg"><ShieldCheck size={28} /></div>
                <h4>Trust & Safety</h4>
                <p>Transparency and reliability are the absolute cornerstones of our relationship with every resident we serve.</p>
              </div>

              <div className="value-glass-card">
                <div className="value-icon-bg"><Heart size={28} /></div>
                <h4>Community</h4>
                <p>We believe in the power of human connection. Shared spaces that naturally bring extraordinary people together.</p>
              </div>

              <div className="value-glass-card">
                <div className="value-icon-bg"><TrendingUp size={28} /></div>
                <h4>Growth</h4>
                <p>We design environments that actively foster personal and professional growth for every member of our community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. TESTIMONIALS ─── */}
        <section className="about-testimonials">
          <div className="about-container">
            <span className="section-eyebrow">Resident Stories</span>
            <h2 className="section-title" style={{ marginBottom: 4 }}>What Our Residents Say</h2>
            <p className="section-subtitle" style={{ maxWidth: 500, marginBottom: 0 }}>
              Loved by thousands of professionals and students who call Livora home.
            </p>

            <div className="testi-grid">
              {testimonials.map((t, i) => (
                <div className="testi-card" key={i}>
                  <div className="testi-stars">{'★'.repeat(t.rating)}</div>
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-author">
                    <div className="testi-avatar">{t.name[0]}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 6. CTA BANNER ─── */}
        <section className="about-cta-section">
          <div className="about-container">
            <div className="cta-premium-strip">
              <div className="cta-text">
                <h2>Ready to experience Livora?</h2>
                <p>Join thousands of happy residents living their best life.</p>
              </div>
              <button className="cta-primary-btn" onClick={() => navigate('/search')}>
                Explore Properties →
              </button>
            </div>
          </div>
        </section>

      </main>



    </div>
  );
};

export default About;
