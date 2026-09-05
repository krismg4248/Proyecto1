import { supabase } from '../config/supabase.js';

function camposEmpleado(body) {
  const out = {};
  const permitidos = ['nombre', 'apellido', 'email', 'puesto', 'telefono', 'salario', 'fecha_ingreso', 'activo'];
  for (const campo of permitidos) {
    if (body[campo] !== undefined) out[campo] = body[campo];
  }
  if (out.email) out.email = String(out.email).trim().toLowerCase();
  return out;
}

export async function listar(_req, res, next) {
  try {
    const { data, error } = await supabase
      .from('empleados')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ empleados: data });
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('empleados')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ empleado: data });
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const payload = camposEmpleado(req.body);
    if (!payload.nombre?.trim() || !payload.apellido?.trim()) {
      return res.status(400).json({ error: 'nombre y apellido son obligatorios' });
    }

    const { data, error } = await supabase
      .from('empleados')
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya esta registrado' });
      }
      throw error;
    }

    res.status(201).json({ empleado: data });
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req, res, next) {
  try {
    const payload = camposEmpleado(req.body);
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('empleados')
      .update(payload)
      .eq('id', req.params.id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya esta registrado' });
      }
      throw error;
    }
    if (!data) return res.status(404).json({ error: 'Empleado no encontrado' });

    res.json({ empleado: data });
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('empleados')
      .delete()
      .eq('id', req.params.id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Empleado no encontrado' });

    res.json({ mensaje: 'Empleado eliminado' });
  } catch (err) {
    next(err);
  }
}
