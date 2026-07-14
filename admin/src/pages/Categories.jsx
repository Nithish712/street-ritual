import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      if (data.data) {
        setCategories(data.data.data || []);
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name, slug });
      setName('');
      setSlug('');
      fetchCategories();
    } catch (err) {
      alert('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;

  return (
    <div className="admin-content">
      <div className="admin-table-header" style={{ marginBottom: '24px', borderRadius: '4px' }}>
        <h2 className="admin-table-title">Product Categories</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* ADD CATEGORY FORM */}
        <div className="admin-table-wrap" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>Add Category</h3>
          <form onSubmit={handleAdd} className="form-group">
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%' }}
                placeholder="e.g. Accessories"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Slug (URL)</label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%' }}
                placeholder="e.g. accessories"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Category</button>
          </form>
        </div>

        {/* LIST CATEGORIES */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
