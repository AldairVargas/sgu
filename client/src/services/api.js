// Construye la URL base a partir de variables de Vite
const HOST = import.meta.env.VITE_API_HOST ?? 'localhost';
const PORT = import.meta.env.VITE_API_PORT ?? '8081';
const BASE = import.meta.env.VITE_API_BASE ?? '/sgu-api'; // <-- ojo aquí

export const API_URL = `http://${HOST}:${PORT}${BASE}`;

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    let error = text;
    try { error = JSON.parse(text); } catch {}
    throw new Error(error?.error || res.statusText);
  }
  return res.status !== 204 ? res.json() : null;
}

export const api = {
  listUsers: () => fetch(`${API_URL}/api/users`).then(handle),
  createUser: (payload) =>
    fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),
  deleteUser: (id) =>
    fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' }).then(handle),
  updateUser: (id, payload) =>
    fetch(`${API_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),
};
