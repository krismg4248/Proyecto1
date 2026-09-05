import { writable } from 'svelte/store';

function leerUsuario() {
  try {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const usuario = writable(leerUsuario());

export function guardarSesion({ token, usuario: datos }) {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(datos));
  usuario.set(datos);
}

export function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  usuario.set(null);
}
