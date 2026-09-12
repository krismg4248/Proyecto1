<script>
  import Mouse3D from '../components/Mouse3D.svelte';

  let { onacceder, usuario } = $props();
  let linea = $state('perifericos');
  let faqAbierto = $state(-1);
  const acento = $derived(linea === 'perifericos' ? '#9a4450' : '#722f37');

  const catalogo = [
    ['GPUs', 'Tarjetas listas para 1440p y 4K.'],
    ['Procesadores', 'Ryzen y Core para render y juego.'],
    ['Memoria', 'Kits DDR5 de baja latencia.'],
    ['Almacenamiento', 'NVMe Gen4 y Gen5.'],
    ['Periféricos', 'Mice, teclados y audio.'],
    ['Gabinetes', 'Flujo de aire y cableado limpio.']
  ];

  const faqs = [
    ['¿Envían a todo el país?', 'Sí. Pedidos antes de las 14:00 salen el mismo día hábil. Tracking en el correo de compra.'],
    ['¿Los componentes tienen garantía?', 'Todos incluyen garantía de fabricante. Teclados y mice, 2 años con nosotros.'],
    ['¿Arman PCs a medida?', 'Sí. Eliges piezas en catálogo y nosotros montamos, testeamos y enviamos el rig sellado.'],
    ['¿Puedo devolverlo?', '30 días si el empaque y los sellos siguen intactos. Accesorios abiertos: 14 días.'],
    ['¿Hay stock limitado?', 'Las series especiales se agotan. El resto se reabastece cada semana.']
  ];
</script>

<div class="bg-ink text-ivory">
  <header class="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-ink/70 px-5 py-4 backdrop-blur-sm sm:px-10">
    <a href="#top" class="display text-2xl tracking-[0.12em] sm:text-3xl">CRIMSON</a>
    <nav class="hidden items-center gap-8 text-[0.72rem] font-medium uppercase tracking-[0.18em] md:flex">
      <a href="#catalogo">Componentes</a>
      <a href="#accesorios">Accesorios</a>
      <a href="#faqs">Faqs</a>
    </nav>
    <button type="button" class="rounded-full border border-wine-soft/50 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.16em]" onclick={onacceder}>
      {usuario ? 'Panel' : 'Acceder'}
    </button>
  </header>

  <section id="top" class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#722f3755,transparent_58%)]"></div>
    <div class="absolute inset-0">
      <Mouse3D acento={acento} />
    </div>
    <div class="pointer-events-none relative z-10 mt-16 flex flex-col items-center px-6 text-center">
      <h1 class="display text-6xl leading-none sm:text-8xl md:text-[7.2rem]">HARDWARE</h1>
      <p class="mt-2 text-[0.7rem] uppercase tracking-[0.35em] text-stone">Componentes, accesorios y rigs</p>
      <div class="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3">
        <a href="#catalogo" class="btn-gold">Ver componentes</a>
        <a href="#accesorios" class="btn-violet">Ver accesorios</a>
      </div>
    </div>
  </section>

  <section id="catalogo" class="scroll-mt-24 mx-auto max-w-5xl px-6 py-24 text-center">
    <p class="text-sm uppercase tracking-[0.28em] text-wine-soft">Propuesta de valor</p>
    <h2 class="display mt-4 text-4xl sm:text-6xl">Todo el PC. Una sola mesa.</h2>
    <p class="mx-auto mt-6 max-w-xl text-sm leading-7 text-mist">
      Vendemos GPUs, CPUs, RAM, almacenamiento, periféricos y gabinetes. Piezas curadas, stock real y envío rápido — el mismo corte visual, ahora para tu setup.
    </p>
    <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each catalogo as [nombre, detalle]}
        <article class="border border-line bg-charcoal/80 px-6 py-8 text-left">
          <h3 class="display text-2xl">{nombre}</h3>
          <p class="mt-2 text-sm leading-6 text-mist">{detalle}</p>
        </article>
      {/each}
    </div>
  </section>

  <section id="accesorios" class="scroll-mt-24 border-y border-line bg-charcoal px-6 py-24">
    <div class="mx-auto max-w-3xl text-center">
      <p class="text-sm uppercase tracking-[0.28em] text-wine-soft">Accesorios</p>
      <h2 class="display mt-4 text-4xl sm:text-5xl">Mice, teclados y audio que aguantan horas</h2>
      <p class="mx-auto mt-6 max-w-xl text-sm leading-7 text-mist">
        Periféricos de alto rendimiento: sensores precisos, switches firmes y headsets con micrófono claro. Elige línea y el 3D cambia el acento.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" class="btn-gold" onclick={() => (linea = 'perifericos')}>Periféricos</button>
        <button type="button" class="btn-violet" onclick={() => (linea = 'componentes')}>Componentes</button>
      </div>
    </div>
  </section>

  <section class="px-6 py-24 text-center">
    <p class="text-sm uppercase tracking-[0.28em] text-wine-soft">Cuenta</p>
    <h2 class="display mt-4 text-4xl sm:text-5xl">Pedidos, armado y seguimiento</h2>
    <p class="mx-auto mt-6 max-w-xl text-sm leading-7 text-mist">
      Entra para guardar tu carrito, ver órdenes y solicitar un PC a medida con las piezas del catálogo.
    </p>
    <button type="button" class="btn-gold mt-10" onclick={onacceder}>
      {usuario ? 'Ir al panel' : 'Crear cuenta'}
    </button>
  </section>

  <section id="faqs" class="mx-auto max-w-2xl scroll-mt-24 px-6 pb-28">
    <h2 class="display mb-8 text-center text-4xl">Antes de comprar</h2>
    {#each faqs as [q, a], i}
      <button type="button" class="w-full border-t border-line py-5 text-left" onclick={() => (faqAbierto = faqAbierto === i ? -1 : i)}>
        <span class="flex justify-between gap-4 text-sm">{q} <span class="text-mist">{faqAbierto === i ? '−' : '+'}</span></span>
        {#if faqAbierto === i}
          <p class="mt-3 text-sm leading-6 text-mist">{a}</p>
        {/if}
      </button>
    {/each}
    <div class="border-t border-line"></div>
  </section>

  <footer class="border-t border-line px-6 py-12 text-center text-xs text-mist">
    <p class="display text-xl text-ivory">CRIMSON</p>
    <p class="mt-2">Componentes y accesorios para PC · 2026</p>
  </footer>
</div>
