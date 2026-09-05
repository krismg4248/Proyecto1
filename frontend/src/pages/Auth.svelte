<script>
  import Campo from '../components/Campo.svelte';
  import { login, registrar } from '../lib/api.js';
  import { guardarSesion } from '../lib/sesion.js';

  let modo = $state('entrar');
  let nombre = $state('');
  let email = $state('');
  let password = $state('');
  let confirmar = $state('');
  let error = $state('');
  let cargando = $state(false);

  function cambiarModo(siguiente) {
    modo = siguiente;
    error = '';
  }

  async function enviar(evento) {
    evento.preventDefault();
    error = '';

    if (modo === 'registro' && password !== confirmar) {
      error = 'Las contraseñas no coinciden.';
      return;
    }

    cargando = true;
    try {
      const data =
        modo === 'entrar'
          ? await login(email, password)
          : await registrar({ nombre, email, password });
      guardarSesion(data);
    } catch (err) {
      error = err.message;
    } finally {
      cargando = false;
    }
  }
</script>

<div class="relative flex min-h-screen">
  <aside
    class="relative hidden w-[42%] flex-col justify-between overflow-hidden border-r border-line px-12 py-14 lg:flex xl:px-16"
    style="background: linear-gradient(165deg, #141416 0%, #0c0c0d 58%, #1a1013 100%);"
  >
    <div
      class="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full opacity-30"
      style="background: radial-gradient(circle, #4c242e 0%, transparent 70%);"
    ></div>

    <p class="text-[0.7rem] font-light uppercase tracking-[0.38em] text-mist">Sistema</p>

    <div class="relative max-w-sm">
      <span class="mb-8 block h-px w-10 bg-wine"></span>
      <h1 class="font-serif text-5xl font-medium leading-[1.12] text-ivory xl:text-[3.35rem]">
        Administración
        <span class="italic text-stone">serena.</span>
      </h1>
      <p class="mt-8 max-w-[17.5rem] text-sm font-light leading-7 text-mist">
        Un espacio contenido, sin ruido visual. Entra o crea tu cuenta para continuar.
      </p>
    </div>

    <p class="text-[0.68rem] font-light tracking-[0.16em] text-mist/80">
      Acceso restringido · 2026
    </p>
  </aside>

  <main class="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
    <div class="w-full max-w-[24rem]">
      <div class="mb-12 lg:hidden">
        <span class="mb-5 block h-px w-8 bg-wine"></span>
        <h1 class="font-serif text-4xl text-ivory">Administración</h1>
      </div>

      <div class="mb-10 flex gap-8 text-[0.72rem] uppercase tracking-[0.22em]">
        <button
          type="button"
          class="pb-1 transition-colors {modo === 'entrar'
            ? 'border-b border-wine text-ivory'
            : 'text-mist hover:text-stone'}"
          onclick={() => cambiarModo('entrar')}
        >
          Entrar
        </button>
        <button
          type="button"
          class="pb-1 transition-colors {modo === 'registro'
            ? 'border-b border-wine text-ivory'
            : 'text-mist hover:text-stone'}"
          onclick={() => cambiarModo('registro')}
        >
          Registro
        </button>
      </div>

      <h2 class="font-serif text-3xl font-medium text-ivory">
        {modo === 'entrar' ? 'Bienvenido de nuevo' : 'Crear una cuenta'}
      </h2>
      <p class="mt-2 text-sm font-light text-mist">
        {modo === 'entrar'
          ? 'Introduce tus credenciales para acceder.'
          : 'Completa los datos. La contraseña se guarda cifrada.'}
      </p>

      <form class="mt-10 space-y-7" onsubmit={enviar}>
        {#if modo === 'registro'}
          <Campo etiqueta="Nombre" bind:valor={nombre} autocomplete="name" placeholder="Tu nombre" />
        {/if}

        <Campo
          etiqueta="Correo"
          tipo="email"
          bind:valor={email}
          autocomplete="email"
          placeholder="correo@dominio.com"
        />
        <Campo
          etiqueta="Contraseña"
          tipo="password"
          bind:valor={password}
          autocomplete={modo === 'entrar' ? 'current-password' : 'new-password'}
          placeholder="Mínimo 8 caracteres"
        />

        {#if modo === 'registro'}
          <Campo
            etiqueta="Confirmar contraseña"
            tipo="password"
            bind:valor={confirmar}
            autocomplete="new-password"
            placeholder="Repite la contraseña"
          />
        {/if}

        {#if error}
          <p class="text-sm font-light text-wine-soft" role="alert">{error}</p>
        {/if}

        <button
          type="submit"
          disabled={cargando}
          class="mt-2 w-full bg-wine-deep py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-wine disabled:opacity-50"
        >
          {cargando ? 'Un momento…' : modo === 'entrar' ? 'Acceder' : 'Registrarme'}
        </button>
      </form>
    </div>
  </main>
</div>
