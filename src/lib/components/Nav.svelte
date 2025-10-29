<script lang="ts">
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: 'Top Games' },
    { href: '/trending', label: 'Trending Games' },
    { href: '/news', label: 'News' },
    { href: '/scoreboard', label: 'Scoreboard' },
    { href: '/library', label: 'My Library' }
  ];

  let open = false;
  let searchQuery = '';
  const placeholder = 'Board Game';

  const isActive = (href: string, current: string) =>
    current === href || (href !== '/' && current.startsWith(href));

  function clearSearch() {
    searchQuery = '';
  }
</script>

<header
  class="sticky top-0 z-50 relative text-blackcurrant not-prose transition-all duration-300
         h-[86px] max-[930px]:h-[55px]"
  style="background: var(--color-navbar-light);"
>
  <!-- Multicolor top border (10px → 6px with animation) -->
  <div class="absolute top-0 left-0 w-full h-[10px] top-border transition-all duration-300 max-[930px]:h-[6px]"></div>

  <!-- Inner container (padding shrinks with bar) -->
  <div
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full
           pt-[10px] max-[930px]:pt-[5px]
           transition-all duration-300"
  >
    <div
      class="flex items-center justify-between gap-4 h-[76px] max-[930px]:h-[50px]
             transition-all duration-300"
    >
      <!-- Left: logo + links -->
      <div class="flex items-center gap-1 sm:gap-2 md:gap-8">
        <!-- Brand -->
        <a
          href="/"
          class="flex items-center gap-2 font-semibold text-xl max-[930px]:text-lg
                 text-blackcurrant hover:text-blackcurrant transition-colors
                 transition-all duration-300"
        >

        <img
            src="/logo.svg"
            alt="Board Game Library Logo"
            class="h-10 max-[930px]:h-7 w-auto -translate-y-[3px] transition-all duration-300"
          />
        </a>

        <!-- Desktop navigation (progressively hides) -->
        <nav class="flex items-center gap-8 max-[930px]:gap-6 text-lg max-[930px]:text-base font-medium pt-[2px] transition-all duration-300">
          <a
            href="/"
            class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[600px]:hidden max-[700px]:text-base"
          >Top Games</a>

          <a
            href="/trending"
            class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/trending', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[700px]:hidden max-[900px]:text-base"
          >Trending Games</a>

          <a
            href="/news"
            class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/news', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[900px]:hidden max-[900px]:text-base"
          >News</a>

          <a
            href="/scoreboard"
            class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/scoreboard', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[1050px]:hidden max-[1050px]:text-base"
          >Scoreboard</a>

          <a
            href="/library"
            class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/library', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[1100px]:hidden max-[1100px]:text-base"
          >My Library</a>
        </nav>
      </div>

      <!-- Right: Search + Profile (always visible) -->
        <div class="flex items-center gap-5 h-[40px] max-[930px]:h-[36px] max-[930px]:gap-3 transition-all duration-300 max-[930px]:flex-1 max-[930px]:min-w-0">
        <!-- Search -->
        <div class="relative flex items-center h-[40px] w-[280px] transition-all duration-300 max-[930px]:h-[30px] max-[930px]:w-auto max-[930px]:flex-1 max-[930px]:min-w-0 max-[930px]:max-w-[720px]">          <img src="/images/search.svg" alt="Search" class="absolute left-3 h-4 w-4 pointer-events-none opacity-70 max-[930px]:h-3.5 max-[930px]:w-3.5" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder={placeholder}
            class="h-full w-full rounded-full border border-blackcurrant bg-white text-blackcurrant
                   placeholder-blackcurrant/60 pl-9 pr-9 text-base max-[930px]:text-sm leading-none box-border
                   outline-none focus:outline-none focus:border-fancy-blue-dark
                   focus:ring-2 focus:ring-fancy-blue-dark/30 transition-all duration-300
                   max-[930px]:pl-8 max-[930px]:pr-8"
          />
          {#if searchQuery}
            <button
              type="button"
              on:click={clearSearch}
              class="absolute right-3 p-1 hover:scale-110 transition-transform max-[930px]:right-2"
              aria-label="Clear search"
            >
              <img src="/images/close.svg" alt="Clear" class="h-4 w-4 opacity-70 hover:opacity-100 max-[930px]:h-3.5 max-[930px]:w-3.5" />
            </button>
          {/if}
        </div>

        <!-- Profile -->
        <a
          href="/account"
          class="flex items-center h-[55px] w-[55px] max-[930px]:h-[41px] max-[930px]:w-[41px]
                 group relative shrink-0 transition-all duration-300"
          aria-label="Account"
        >
          <div
            class="h-full w-full bg-no-repeat bg-center bg-contain focus:outline-none focus:border-fancy-blue-dark
                   focus:ring-2 focus:ring-fancy-blue-dark/30 transition-all duration-300"
            style="background-image: url('/images/account.svg');"
          />
        </a>

        <!-- Hamburger (aligned with profile icon) -->
        <button
        class="hidden max-[1100px]:inline-flex items-center justify-center 
                h-[30px] w-[30px] rounded-md 
                border border-blackcurrant text-blackcurrant leading-[0.9]
                hover:bg-blackcurrant/10 transition"
        style="border-width: 1px;"
        aria-label="Toggle menu"
        aria-expanded={open}
        on:click={() => (open = !open)}
        >
        {#if open}
            <img src="/images/close.svg" alt="Close menu" class="h-[16px] w-[16px]" />
        {:else}
            <img src="/images/menu.svg" alt="Open menu" class="h-[16px] w-[16px]" />
        {/if}
        </button>

      </div>
    </div>
  </div>

  <!-- Mobile drawer -->
  {#if open}
    <div style="background: var(--color-navbar-light);">
      <div class="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-3">
        {#each links as link}
          <a
            href={link.href}
            class="py-2 text-base text-blackcurrant hover:text-blackcurrant transition-colors
                   {isActive(link.href, $page.url.pathname)
                     ? 'font-semibold underline underline-offset-4 decoration-blackcurrant/30'
                     : ''}"
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
