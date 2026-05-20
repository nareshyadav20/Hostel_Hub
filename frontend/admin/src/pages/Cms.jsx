import React, { useState, useEffect } from 'react';
import { Image, FileText, ChevronRight, Save, Eye, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

const Cms = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Pages');
  
  // Dynamic States loaded from DB
  const [pagesList, setPagesList] = useState([]);
  const [bannersList, setBannersList] = useState([]);
  const [seoSettings, setSeoSettings] = useState({ headline: '', meta: '' });
  
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  
  // Edit states for currently selected page
  const [headline, setHeadline] = useState('');
  const [meta, setMeta] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  
  // Edit states for currently selected banner
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSize, setBannerSize] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Fetch all CMS data from MongoDB
  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/cms');
        if (res.data) {
          const { pages, banners, seoSettings: seo } = res.data;
          setPagesList(pages || []);
          setBannersList(banners || []);
          setSeoSettings(seo || { headline: '', meta: '' });
          
          if (pages && pages.length > 0) {
            setSelectedPage(pages[0]);
            setHeadline(pages[0].headline || '');
            setMeta(pages[0].meta || '');
            setBodyContent(pages[0].bodyContent || '');
          }
          if (banners && banners.length > 0) {
            setSelectedBanner(banners[0]);
            setBannerTitle(banners[0].title || '');
            setBannerSize(banners[0].size || '1200×400');
            setBannerActive(banners[0].active);
          }
        }
      } catch (err) {
        console.error('Failed to load CMS data', err);
        showToast('Failed to load CMS data from server.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchCmsData();
  }, []);

  // Update lists when local inputs change
  const handleHeadlineChange = (val) => {
    setHeadline(val);
    setPagesList(prev => prev.map(p => (p._id === selectedPage?._id || p.name === selectedPage?.name) ? { ...p, headline: val, lastEdit: 'Just now' } : p));
  };

  const handleMetaChange = (val) => {
    setMeta(val);
    setPagesList(prev => prev.map(p => (p._id === selectedPage?._id || p.name === selectedPage?.name) ? { ...p, meta: val, lastEdit: 'Just now' } : p));
  };

  const handleBodyContentChange = (val) => {
    setBodyContent(val);
    setPagesList(prev => prev.map(p => (p._id === selectedPage?._id || p.name === selectedPage?.name) ? { ...p, bodyContent: val, lastEdit: 'Just now' } : p));
  };

  const handleBannerTitleChange = (val) => {
    setBannerTitle(val);
    setBannersList(prev => prev.map((b, i) => (b._id === selectedBanner?._id || i === bannersList.indexOf(selectedBanner)) ? { ...b, title: val } : b));
  };

  const handleBannerSizeChange = (val) => {
    setBannerSize(val);
    setBannersList(prev => prev.map((b, i) => (b._id === selectedBanner?._id || i === bannersList.indexOf(selectedBanner)) ? { ...b, size: val } : b));
  };

  const handleBannerActiveToggle = (val) => {
    setBannerActive(val);
    setBannersList(prev => prev.map((b, i) => (b._id === selectedBanner?._id || i === bannersList.indexOf(selectedBanner)) ? { ...b, active: val } : b));
  };

  const handleSelectPage = (page) => {
    setSelectedPage(page);
    setHeadline(page.headline || '');
    setMeta(page.meta || '');
    setBodyContent(page.bodyContent || '');
  };

  const handleSelectBanner = (banner) => {
    setSelectedBanner(banner);
    setBannerTitle(banner.title || '');
    setBannerSize(banner.size || '1200×400');
    setBannerActive(banner.active);
  };

  // Add new dynamic entries
  const handleAddNewPage = () => {
    const newPage = {
      name: `New Page ${pagesList.length + 1}`,
      lastEdit: 'Just now',
      status: 'Draft',
      headline: 'New Page Headline',
      meta: 'New SEO Meta description.',
      bodyContent: '# Welcome to the new section'
    };
    const updatedList = [...pagesList, newPage];
    setPagesList(updatedList);
    setSelectedPage(newPage);
    setHeadline(newPage.headline);
    setMeta(newPage.meta);
    setBodyContent(newPage.bodyContent);
    showToast('New Draft Page Added.', 'info');
  };

  const handleAddNewBanner = () => {
    const newBanner = {
      title: `Campaign Banner ${bannersList.length + 1}`,
      size: '1200×400',
      active: false
    };
    const updatedList = [...bannersList, newBanner];
    setBannersList(updatedList);
    setSelectedBanner(newBanner);
    setBannerTitle(newBanner.title);
    setBannerSize(newBanner.size);
    setBannerActive(newBanner.active);
    showToast('New Banner Added (Inactive).', 'info');
  };

  // Save the entire CMS configuration back to MongoDB
  const handleSave = async () => {
    try {
      setSaved(true);
      await API.put('/admin/cms', {
        pages: pagesList,
        banners: bannersList,
        seoSettings: seoSettings
      });
      showToast('CMS Configuration updated successfully.', 'success');
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save CMS config', err);
      showToast('Error syncing CMS with server.', 'danger');
      setSaved(false);
    }
  };

  const tabs = ['Pages', 'App Banners', 'SEO Settings'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group mb-6 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      
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
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {activeTab === 'Pages' && pagesList.map((page, i) => (
            <div
              key={i}
              onClick={() => handleSelectPage(page)}
              className="card"
              style={{ cursor: 'pointer', border: selectedPage?.name === page.name ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(255,255,255,0.07)', padding: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <FileText size={16} color={selectedPage?.name === page.name ? '#7c3aed' : '#475569'} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{page.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>{page.lastEdit}</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#475569" />
              </div>
            </div>
          ))}

          {activeTab === 'App Banners' && bannersList.map((b, i) => (
            <div 
              key={i} 
              onClick={() => handleSelectBanner(b)}
              className="card" 
              style={{ cursor: 'pointer', border: selectedBanner?.title === b.title ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(255,255,255,0.07)', padding: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <Image size={16} color={selectedBanner?.title === b.title ? '#7c3aed' : '#475569'} />
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

          {activeTab !== 'SEO Settings' && (
            <button 
              className="btn btn-secondary" 
              style={{ borderStyle: 'dashed', cursor: 'pointer' }}
              onClick={activeTab === 'Pages' ? handleAddNewPage : handleAddNewBanner}
            >
              <Plus size={16} /> New Entry
            </button>
          )}
        </div>

        <div className="card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <h3 style={{ margin: 0 }}>
                {activeTab === 'Pages' && `Editing Page: ${selectedPage?.name || 'None Selected'}`}
                {activeTab === 'App Banners' && `Editing Banner: ${selectedBanner?.title || 'None Selected'}`}
                {activeTab === 'SEO Settings' && 'Global Platforms SEO Defaults'}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>Changes apply instantly on save.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button className="btn btn-secondary" style={{ cursor: 'pointer' }} onClick={() => showToast('Preview generated successfully', 'success')}><Eye size={16} /> Preview</button>
              <button className="btn btn-primary" style={{ cursor: 'pointer' }} onClick={handleSave}>{saved ? '✓ Saved!' : <><Save size={16} /> Save</>}</button>
            </div>
          </div>

          {activeTab === 'Pages' && selectedPage && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div className="form-group">
                <label className="form-label">Hero Headline</label>
                <input 
                  className="form-input" 
                  style={{ fontSize: '1.1rem', fontWeight: 700 }} 
                  value={headline} 
                  onChange={e => handleHeadlineChange(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Meta Description (SEO)</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  style={{ resize: 'none' }} 
                  value={meta} 
                  onChange={e => handleMetaChange(e.target.value)} 
                />
              </div>
              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label">Body Content (Markdown)</label>
                <textarea 
                  className="form-input" 
                  rows={8} 
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }} 
                  value={bodyContent} 
                  onChange={e => handleBodyContentChange(e.target.value)} 
                />
              </div>
            </div>
          )}

          {activeTab === 'App Banners' && selectedBanner && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              <div className="form-group">
                <label className="form-label">Banner Title</label>
                <input 
                  className="form-input" 
                  value={bannerTitle} 
                  onChange={e => handleBannerTitleChange(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Banner Size</label>
                <input 
                  className="form-input" 
                  value={bannerSize} 
                  onChange={e => handleBannerSizeChange(e.target.value)} 
                />
              </div>
              <div className="form-group flex items-center gap-3">
                <label className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={bannerActive} 
                    onChange={e => handleBannerActiveToggle(e.target.checked)} 
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  Mark as Live (Active Campaign)
                </label>
              </div>
            </div>
          )}

          {activeTab === 'SEO Settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              <div className="form-group">
                <label className="form-label">Global SEO Title Template</label>
                <input 
                  className="form-input" 
                  value={seoSettings.headline} 
                  onChange={e => setSeoSettings({ ...seoSettings, headline: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Global SEO Meta Description</label>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  style={{ resize: 'none' }} 
                  value={seoSettings.meta} 
                  onChange={e => setSeoSettings({ ...seoSettings, meta: e.target.value })} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cms;
