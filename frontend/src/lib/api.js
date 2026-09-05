const API = '/api';

async function pedir(ruta, opciones = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(opciones.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${ruta}`, { ...opciones, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'No se pudo completar la solicitud');
  }
  return data;
}

export function login(email, password) {
  return pedir('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function registrar({ nombre, email, password }) {
  return pedir('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password })
  });
}

export function perfil() {
  return pedir('/auth/me');
}
