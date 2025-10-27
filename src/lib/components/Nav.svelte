<script lang="ts">
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/games', label: 'Games' },
    { href: '/charts', label: 'Charts' },
    { href: '/about', label: 'About' }
  ];

  let open = false;

  const isActive = (href: string, current: string) =>
    current === href || (href !== '/' && current.startsWith(href));
</script>

<header
  class="sticky top-0 z-50 relative text-blackcurrant h-[86px] not-prose"
  style="background: var(--color-navbar-light);"
>
  <!-- multicolor strip across the top -->
  <div class="absolute top-0 left-0 w-full h-[10px] top-border"></div>

  <!-- add top padding equal to the bar height -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-[10px] h-full">
    <!-- the flex area now fills the remaining 76px -->
    <div class="flex h-[76px] items-center justify-between">
      <!-- Brand -->
      <a
        href="/"
        class="flex items-center gap-2 font-semibold text-blackcurrant hover:text-blackcurrant/80 transition-colors"
        aria-label="Board Game Library — Home"
      >
        <span>Board Game Library</span>
      </a>

      <!-- Desktop navigation -->
      <nav class="hidden md:flex items-center gap-8">
        {#each links as link}
          <a
            href={link.href}
            class="text-sm font-medium text-blackcurrant hover:text-blackcurrant/80 transition-colors
                   {isActive(link.href, $page.url.pathname)
                     ? 'font-semibold underline underline-offset-4 decoration-blackcurrant/30'
                     : ''} visited:text-blackcurrant"
            aria-current={isActive(link.href, $page.url.pathname) ? 'page' : undefined}
          >
            {link.label}
          </a>
        {/each}
      </nav>

      <!-- Mobile menu toggle -->
      <button
        class="md:hidden inline-flex items-center justify-center rounded-md border border-blackcurrant/30 text-blackcurrant px-3 py-2 text-sm hover:bg-blackcurrant/10 transition"
        aria-label="Toggle menu"
        aria-expanded={open}
        on:click={() => (open = !open)}
      >
        {#if open} ✕ {:else} ☰ {/if}
      </button>
    </div>
  </div>

  <!-- Mobile drawer -->
  {#if open}
    <div style="background: var(--color-navbar-light);">
      <div class="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-3">
        {#each links as link}
          <a
            href={link.href}
            class="py-2 text-base text-blackcurrant hover:text-blackcurrant/80 transition-colors
                   {isActive(link.href, $page.url.pathname)
                     ? 'font-semibold underline underline-offset-4 decoration-blackcurrant/30'
                     : ''} visited:text-blackcurrant"
            on:click={() => (open = false)}
            aria-current={isActive(link.href, $page.url.pathname) ? 'page' : undefined}
          >
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</header>
