export function sinPasswordHash(usuario) {
  if (!usuario) return usuario;
  const { password_hash, ...publico } = usuario;
  return publico;
}
