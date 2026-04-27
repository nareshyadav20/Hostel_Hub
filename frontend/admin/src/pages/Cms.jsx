import React, { useState } from 'react';
import { Layout, Image, FileText, ChevronRight, Save, Eye, Plus } from 'lucide-react';

const pages = [
  { name: 'Home Landing', lastEdit: '2h ago', status: 'Published' },
  { name: 'FAQ / Support', lastEdit: '5 days ago', status: 'Published' },
  { name: 'Privacy Policy', lastEdit: 'Oct 20, 2024', status: 'Draft' },
];

const banners = [
  { title: 'New Year Special', size: '1200×400', active: true },
  { title: 'Referral Program', size: '1200×400', active: false },
];

const Cms = () => {
  const [activeTab, setActiveTab] = useState('Pages');
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [headline, setHeadline] = useState('Find Luxury Living That Fits Your Budget');
  const [meta, setMeta] = useState("HostelHub is India's leading platform for verified, high-quality hostels.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = ['Pages', 'App Banners', 'SEO Settings'];

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      <div className="page-header">
        <div>
          <h1>Content Management</h1>
          <p>Administer landing pages, banners, and global text assets.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '12px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="btn"
            style={{
              background: activeTab === t ? '#7c3aed' : 'transparent',
              color: activeTab === t ? '#fff' : '#64748b',
              border: 'none',
              fontWeight: activeTab === t ? 700 : 500,
              padding: '0.5rem 1.2rem',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {activeTab === 'Pages' && pages.map((page, i) => (
            <div
              key={i}
              onClick={() => setSelectedPage(page)}
              className="card"
              style={{ cursor: 'pointer', border: selectedPage.name === page.name ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(255,255,255,0.07)', padding: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <FileText size={16} color={selectedPage.name === page.name ? '#7c3aed' : '#475569'} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{page.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>{page.lastEdit}</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#475569" />
              </div>
            </div>
          ))}

          {activeTab === 'App Banners' && banners.map((b, i) => (
            <div key={i} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <Image size={16} color="#475569" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>{b.size}</div>
                  </div>
                </div>
                <span className={`badge ${b.active ? 'badge-success' : 'badge-danger'}`}>{b.active ? 'Live' : 'Off'}</span>
              </div>
            </div>
          ))}

          {activeTab === 'SEO Settings' && (
            <div className="card" style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              Global SEO Defaults
            </div>
          )}

          <button className="btn btn-secondary" style={{ borderStyle: 'dashed' }}>
            <Plus size={16} /> New Entry
          </button>
        </div>

        <div className="card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <h3 style={{ margin: 0 }}>Editing: {selectedPage.name}</h3>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>Changes apply instantly on save.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button className="btn btn-secondary"><Eye size={16} /> Preview</button>
              <button className="btn btn-primary" onClick={handleSave}>{saved ? '✓ Saved!' : <><Save size={16} /> Save</>}</button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hero Headline</label>
            <input className="form-input" style={{ fontSize: '1.1rem', fontWeight: 700 }} value={headline} onChange={e => setHeadline(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Meta Description (SEO)</label>
            <textarea className="form-input" rows={3} style={{ resize: 'none' }} value={meta} onChange={e => setMeta(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Body Content</label>
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', fontSize: '0.85rem', color: '#64748b', minHeight: '200px', fontFamily: 'monospace' }}>
              # Welcome Section<br /><br />
              [Component: StatisticsGrid]<br />
              [Component: FeaturedHostels]<br />
              [Component: MobileAppBanner]<br /><br />
              ### Call to Action<br />
              Join 15,000+ satisfied residents today.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cms;
