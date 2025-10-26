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
  class="sticky top-0 z-50 text-blackcurrant"
  style="background: var(--color-navbar-light); height: 80px;"
>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-[80px] items-center justify-between">
      <!-- Brand -->
      <a href="/" class="flex items-center gap-2 font-semibold hover:opacity-80">
        <span>Board Game Library</span>
      </a>

      <!-- Desktop navigation -->
      <nav class="hidden md:flex items-center gap-8">
        {#each links as link}
          <a
            href={link.href}
            class="text-sm font-medium transition-colors hover:opacity-70
                   {isActive(link.href, $page.url.pathname)
                     ? 'font-semibold opacity-100'
                     : 'opacity-80'}"
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
    <div class="md:hidden" style="background: var(--color-navbar-light);">
      <div class="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-3">
        {#each links as link}
          <a
            href={link.href}
            class="py-2 text-base transition-colors
                   {isActive(link.href, $page.url.pathname)
                     ? 'font-semibold text-blackcurrant'
                     : 'text-blackcurrant/80 hover:text-blackcurrant'}"
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
