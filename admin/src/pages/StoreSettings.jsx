import { useState, useEffect } from 'react';
import { getStoreSettings, updateStoreSettings } from '../api';

export default function StoreSettings() {
  const [settings, setSettings] = useState({
    hero_title_line_1: '',
    hero_title_line_2: '',
    hero_subtitle: '',
    hero_bg_url: '',
    marquee_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await getStoreSettings();
      if (data.data && data.data.data) {
        setSettings((prev) => ({ ...prev, ...data.data.data }));
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStoreSettings(settings);
      alert('Settings saved successfully! Refresh your storefront to see changes.');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;

  return (
    <div className="admin-content">
      <div className="admin-table-header" style={{ marginBottom: '24px', borderRadius: '4px' }}>
        <h2 className="admin-table-title">Storefront Settings</h2>
      </div>

      <div className="admin-table-wrap" style={{ padding: '32px', maxWidth: '800px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Homepage Hero Text</h3>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Hero Title (Line 1)</label>
              <input type="text" name="hero_title_line_1" value={settings.hero_title_line_1} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Hero Title (Line 2) [Italics]</label>
              <input type="text" name="hero_title_line_2" value={settings.hero_title_line_2} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Hero Subtitle</label>
              <textarea name="hero_subtitle" value={settings.hero_subtitle} onChange={handleChange} className="form-input" rows="3" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-2)', paddingTop: '24px' }}>
            <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Images</h3>
            <div className="form-group">
              <label className="form-label">Hero Background Image URL (Leave blank for dark gradient)</label>
              <input type="text" name="hero_bg_url" value={settings.hero_bg_url} onChange={handleChange} className="form-input" placeholder="https://images.unsplash.com/..." />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-2)', paddingTop: '24px' }}>
            <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Scrolling Marquee</h3>
            <div className="form-group">
              <label className="form-label">Marquee Text</label>
              <input type="text" name="marquee_text" value={settings.marquee_text} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '16px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
