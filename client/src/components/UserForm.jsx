import { useState, useEffect } from 'react';

const empty = { fullName: '', email: '', phone: '' };

export default function UserForm({ onSubmit, editingUser, onCancelEdit }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingUser) setForm(editingUser);
    else setForm(empty);
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(form);
      setForm(empty);
    } catch (err) {
      setError(err.message || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{editingUser ? 'Editar usuario' : 'Registrar usuario'}</h2>

      <div className="grid">
        <label>
          Nombre completo
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Jane Doe"
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@mail.com"
            required
          />
        </label>
        <label>
          Teléfono
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="777-123-4567"
            required
          />
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="submit">{editingUser ? 'Guardar cambios' : 'Crear'}</button>
        {editingUser && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
