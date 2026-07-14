import { useState, useEffect } from 'react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../api';
const SIZES_BY_CAT = {
  tshirts: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shirts: ['S', 'M', 'L', 'XL', 'XXL'],
  hoodies: ['S', 'M', 'L', 'XL', 'XXL'],
  jeans: ['28', '30', '32', '34', '36', '38'],
};

const EMPTY_FORM = {
  name: '', description: '', price: '', category: 'tshirts',
  sizes: [], images: '', stock: '', active: true,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getAdminProducts(),
        getCategories()
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      category: p.category, sizes: p.sizes || [],
      images: (p.images || []).join(', '), stock: p.stock, active: p.active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      showAlert('Product deleted.');
      load();
    } catch {
      showAlert('Failed to delete.', 'error');
    }
  };

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    try {
      if (editing) {
        await updateProduct(editing.id, payload);
        showAlert('Product updated!');
      } else {
        await createProduct(payload);
        showAlert('Product created!');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to save.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const sizesForCat = SIZES_BY_CAT[form.category] || [];

  return (
    <div>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2 className="admin-table-title">Products</h2>
          <button id="add-product-btn" className="btn btn-primary" onClick={openCreate}>
            + Add Product
          </button>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="loading-spinner" /><p className="loading-text">Loading...</p></div>
        ) : products.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📦</div><p className="empty-text">No products yet</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.images?.[0] || `https://placehold.co/60x75/111/d4af37?text=SR`}
                        alt={p.name}
                        className="img-preview"
                      />
                    </td>
                    <td style={{ color: 'var(--off-white)', fontWeight: '500' }}>{p.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                    <td style={{ color: 'var(--gold)' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`badge badge-${p.active ? 'delivered' : 'cancelled'}`}>
                        {p.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          id={`edit-product-${p.id}`}
                          className="btn btn-outline btn-sm"
                          onClick={() => openEdit(p)}
                        >Edit</button>
                        <button
                          id={`delete-product-${p.id}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p.id)}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Edit Product' : 'New Product'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)} id="modal-close-btn">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="form-label">Product Name *</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. RITUAL OVERSIZED TEE" id="product-name-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-input" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value, sizes: []}))} id="product-category-select">
                      {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input className="form-input" type="number" required min="0" step="1" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="1499" id="product-price-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Quantity *</label>
                    <input className="form-input" type="number" required min="0" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} placeholder="50" id="product-stock-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={form.active} onChange={e => setForm(f => ({...f, active: e.target.value === 'true'}))} id="product-active-select">
                      <option value="true">Active (Visible)</option>
                      <option value="false">Hidden</option>
                    </select>
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Sizes</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {sizesForCat.map(size => (
                        <button
                          key={size}
                          type="button"
                          id={`size-toggle-${size}`}
                          onClick={() => toggleSize(size)}
                          style={{
                            padding: '6px 14px',
                            border: `1px solid ${form.sizes.includes(size) ? 'var(--gold)' : 'var(--gray-2)'}`,
                            background: form.sizes.includes(size) ? 'var(--gold)' : 'transparent',
                            color: form.sizes.includes(size) ? 'var(--black)' : 'var(--gray-4)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                          }}
                        >{size}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Image URLs (comma-separated)</label>
                    <input className="form-input" value={form.images} onChange={e => setForm(f => ({...f, images: e.target.value}))} placeholder="https://... , https://..." id="product-images-input" />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Product description..." id="product-desc-input" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" id="save-product-btn" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
