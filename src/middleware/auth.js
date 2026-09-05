import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { sinPasswordHash } from '../utils/usuario.js';

function extraerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7).trim();
}

export async function autenticar(req, res, next) {
  try {
    const token = extraerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Token no enviado. Use Authorization: Bearer <token>' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', payload.sub)
      .maybeSingle();

    if (error) throw error;
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario no valido o inactivo' });
    }

    req.usuario = sinPasswordHash(usuario);
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token invalido o expirado' });
    }
    next(err);
  }
}

export function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ error: 'Se requiere rol de administrador' });
  }
  next();
}
