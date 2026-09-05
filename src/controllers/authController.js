import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { sinPasswordHash } from '../utils/usuario.js';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRA = '8h';

function crearToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRA }
  );
}

function validarRegistro({ nombre, email, password }) {
  if (!nombre?.trim()) return 'El nombre es obligatorio';
  if (!email?.trim()) return 'El email es obligatorio';
  if (!password || password.length < 8) {
    return 'La contrasena debe tener al menos 8 caracteres';
  }
  return null;
}

export async function registrar(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;
    const mensaje = validarRegistro({ nombre, email, password });
    if (mensaje) return res.status(400).json({ error: mensaje });

    const rolFinal = rol === 'admin' ? 'admin' : 'usuario';
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password_hash,
        rol: rolFinal
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya esta registrado' });
      }
      throw error;
    }

    const usuario = sinPasswordHash(data);
    res.status(201).json({
      mensaje: 'Usuario registrado',
      usuario,
      token: crearToken(usuario)
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contrasena son obligatorios' });
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error) throw error;
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }
    if (!usuario.activo) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const publico = sinPasswordHash(usuario);
    res.json({
      mensaje: 'Inicio de sesion correcto',
      usuario: publico,
      token: crearToken(publico)
    });
  } catch (err) {
    next(err);
  }
}

export function perfil(req, res) {
  res.json({ usuario: req.usuario });
}
