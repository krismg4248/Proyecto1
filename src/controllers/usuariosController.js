import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';

const SALT_ROUNDS = 10;

export async function listar(_req, res, next) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ usuarios: data });
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, created_at, updated_at')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ usuario: data });
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const { nombre, email, password, rol, activo } = req.body;
    if (!nombre?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contrasena debe tener al menos 8 caracteres' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password_hash,
        rol: rol === 'admin' ? 'admin' : 'usuario',
        activo: activo !== false
      })
      .select('id, nombre, email, rol, activo, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya esta registrado' });
      }
      throw error;
    }

    res.status(201).json({ usuario: data });
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req, res, next) {
  try {
    const cambios = { updated_at: new Date().toISOString() };
    const { nombre, email, password, rol, activo } = req.body;

    if (nombre !== undefined) cambios.nombre = String(nombre).trim();
    if (email !== undefined) cambios.email = String(email).trim().toLowerCase();
    if (rol !== undefined) cambios.rol = rol === 'admin' ? 'admin' : 'usuario';
    if (activo !== undefined) cambios.activo = Boolean(activo);
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'La contrasena debe tener al menos 8 caracteres' });
      }
      cambios.password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(cambios)
      .eq('id', req.params.id)
      .select('id, nombre, email, rol, activo, created_at, updated_at')
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya esta registrado' });
      }
      throw error;
    }
    if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ usuario: data });
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req, res, next) {
  try {
    if (req.usuario.id === req.params.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }

    const { data, error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', req.params.id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    next(err);
  }
}
