<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import Nav from '$lib/components/Nav.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<!-- Sticky header on all pages -->
<Nav />

<!-- Page content area -->
<main class="min-h-[calc(100vh-4rem)]"> 
  {@render children?.()}
</main>
