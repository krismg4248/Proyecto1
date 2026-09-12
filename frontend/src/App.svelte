<script>
  import Auth from './pages/Auth.svelte';
  import Panel from './pages/Panel.svelte';
  import Home from './pages/Home.svelte';
  import { usuario } from './lib/sesion.js';

  let pagina = $state('inicio');
</script>

{#if pagina === 'auth' && !$usuario}
  <Auth onvolver={() => (pagina = 'inicio')} />
{:else if pagina === 'panel' && $usuario}
  <Panel usuario={$usuario} onvolver={() => (pagina = 'inicio')} />
{:else}
  <Home
    usuario={$usuario}
    onacceder={() => (pagina = $usuario ? 'panel' : 'auth')}
  />
{/if}
