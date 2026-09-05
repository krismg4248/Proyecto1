-- Ejecutar en Supabase: SQL Editor > New query > Run
-- Las contrasenas se guardan ya hasheadas con Bcrypt desde Node.js (nunca en texto plano).

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null unique,
  password_hash text not null,
  rol text not null default 'usuario' check (rol in ('admin', 'usuario')),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists empleados (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  email text unique,
  puesto text,
  telefono text,
  salario numeric(12, 2),
  fecha_ingreso date,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_usuarios_email on usuarios (email);
create index if not exists idx_empleados_email on empleados (email);

-- El backend usa la service_role key, que ignora RLS.
-- Aun asi se activa RLS para que el anon key no pueda leer tablas desde el cliente.
alter table usuarios enable row level security;
alter table empleados enable row level security;
