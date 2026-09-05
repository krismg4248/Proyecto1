<script>
  import Auth from './pages/Auth.svelte';
  import Panel from './pages/Panel.svelte';
  import { usuario } from './lib/sesion.js';
</script>

<div class="grain"></div>

{#if $usuario}
  <Panel usuario={$usuario} />
{:else}
  <Auth />
{/if}
