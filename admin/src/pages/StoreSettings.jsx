import { useState, useEffect } from 'react';
import { getStoreSettings, updateStoreSettings, uploadImage } from '../api';

export default function StoreSettings() {
  const [settings, setSettings] = useState({
    hero_title_line_1: '',
    hero_title_line_2: '',
    hero_subtitle: '',
    hero_bg_url: '',
    marquee_text: '',
    about_img_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ hero: false, about: false });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await getStoreSettings();
      if (data.data) {
        setSettings((prev) => ({ ...prev, ...data.data }));
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

  const handleFileUpload = async (e, field, loadingKey) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [loadingKey]: true }));
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);
      if (res.data && res.data.url) {
        const updatedSettings = { ...settings, [field]: res.data.url };
        setSettings(updatedSettings);
        // Auto-save to database so it reflects on user side immediately
        await updateStoreSettings(updatedSettings);
        alert('Image uploaded & saved successfully! Please REFRESH your storefront to see the changes.');
      } else {
        alert('Upload returned no URL. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(prev => ({ ...prev, [loadingKey]: false }));
    }
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
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Hero Background Image</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" name="hero_bg_url" value={settings.hero_bg_url} onChange={handleChange} className="form-input" style={{ flex: 1 }} placeholder="Image URL..." />
                <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                  {uploading.hero ? 'Uploading...' : 'Upload File'}
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_bg_url', 'hero')} />
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">About Section Image</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" name="about_img_url" value={settings.about_img_url} onChange={handleChange} className="form-input" style={{ flex: 1 }} placeholder="Image URL..." />
                <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                  {uploading.about ? 'Uploading...' : 'Upload File'}
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'about_img_url', 'about')} />
                </label>
              </div>
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
