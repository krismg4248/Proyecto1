<script>
  import { cerrarSesion } from '../lib/sesion.js';

  let { usuario } = $props();

  const inicial = $derived((usuario?.nombre || '?').trim().charAt(0).toUpperCase());
</script>

<div class="flex min-h-screen flex-col">
  <header class="flex items-center justify-between border-b border-line px-6 py-5 sm:px-10">
    <div>
      <p class="text-[0.65rem] uppercase tracking-[0.32em] text-mist">Sistema</p>
      <p class="font-serif text-xl text-ivory">Administración</p>
    </div>
    <button
      type="button"
      class="text-[0.68rem] uppercase tracking-[0.22em] text-mist transition-colors hover:text-ivory"
      onclick={cerrarSesion}
    >
      Cerrar sesión
    </button>
  </header>

  <main class="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-20 sm:px-10">
    <span class="mb-8 block h-px w-10 bg-wine"></span>
    <p class="text-[0.7rem] uppercase tracking-[0.28em] text-mist">Sesión activa</p>
    <h1 class="mt-4 font-serif text-4xl font-medium text-ivory sm:text-5xl">
      Hola, {usuario.nombre}.
    </h1>
    <p class="mt-4 max-w-md text-sm font-light leading-7 text-mist">
      Has entrado al panel. El entorno permanece contenido: sin saturación, solo lo esencial.
    </p>

    <article class="mt-14 border border-line bg-slate/60 p-8">
      <div class="flex items-center gap-5">
        <div
          class="flex h-12 w-12 items-center justify-center border border-line font-serif text-lg text-stone"
        >
          {inicial}
        </div>
        <div>
          <p class="text-ivory">{usuario.nombre}</p>
          <p class="text-sm font-light text-mist">{usuario.email}</p>
        </div>
      </div>
      <dl class="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <dt class="text-[0.65rem] uppercase tracking-[0.2em] text-mist">Rol</dt>
          <dd class="mt-1 font-light capitalize text-stone">{usuario.rol}</dd>
        </div>
        <div>
          <dt class="text-[0.65rem] uppercase tracking-[0.2em] text-mist">Estado</dt>
          <dd class="mt-1 font-light text-stone">{usuario.activo === false ? 'Inactivo' : 'Activo'}</dd>
        </div>
      </dl>
    </article>
  </main>
</div>
