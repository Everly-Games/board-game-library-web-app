<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <!-- safari -->
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta name="theme-color" content="#A8A397" />
</svelte:head>

<!-- Page wrapper -->
<div class="flex min-h-screen flex-col">
  <!-- Header -->
  <Nav />

  <!-- Main content grows -->
  <main class="flex-1">
    {@render children?.()}
  </main>

  <!-- Footer -->
  <footer
    class="flex items-center justify-center h-[72px] border-t border-dusty-hallway text-blackcurrant text-center"
  >
    <div class="space-x-1">
      &copy;
      <a href="https://everlygames.com/" class="hover:opacity-70">
        Everly Games LLC
      </a>
      •
      <a
        href="https://docs.boardgamelibrary.com/privacy-policy/"
        class="hover:opacity-70"
      >
        Privacy
      </a>
      •
      <a
        href="https://docs.boardgamelibrary.com/terms/"
        class="hover:opacity-70"
      >
        Terms
      </a>
    </div>
  </footer>
</div>
