<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <!-- Use static file reference instead of import -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="alternate icon" href="/favicon.ico" />
  <meta name="theme-color" content="#A8A397" />
</svelte:head>

<!-- Sticky header on all pages -->
<Nav />

<!-- Page content area -->
<main class="min-h-[calc(100vh-4rem)]">
  {@render children?.()}
</main>
