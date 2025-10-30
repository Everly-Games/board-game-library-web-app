<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon-light.svg" media="(prefers-color-scheme: light)" />
  <link rel="icon" type="image/svg+xml" href="/favicon-dark.svg" media="(prefers-color-scheme: dark)" />
  <!-- safari -->
  <link rel="icon" type="image/png" href="/favicon-light.png" media="(prefers-color-scheme: light)">
  <link rel="icon" type="image/png" href="/favicon-dark.png" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#A8A397" />
</svelte:head>

<!-- Sticky header on all pages -->
<Nav />

<!-- Page content area -->
<main class="min-h-[calc(100vh-4rem)]">
  {@render children?.()}
</main>
