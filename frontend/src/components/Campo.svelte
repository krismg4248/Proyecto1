<script>
  let {
    etiqueta,
    tipo = 'text',
    valor = $bindable(''),
    autocomplete = 'off',
    placeholder = ' '
  } = $props();
</script>

<label class="block">
  <span class="mb-1 block text-[0.68rem] font-light uppercase tracking-[0.22em] text-mist">
    {etiqueta}
  </span>
  <input
    class="field"
    type={tipo}
    bind:value={valor}
    {autocomplete}
    {placeholder}
    required
  />
</label>
