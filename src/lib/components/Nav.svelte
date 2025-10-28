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
  class="sticky top-0 z-50 relative text-blackcurrant not-prose"
  style="background: var(--color-navbar-light); height: 86px;"
>
  <!-- Multicolor top border -->
  <div class="absolute top-0 left-0 w-full h-[10px] top-border"></div>

  <!-- Inner container -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full pt-[10px]">
    <div class="flex h-[76px] items-center justify-between gap-4">
      <!-- Left: logo + links -->
      <div class="flex items-center gap-6 sm:gap-10">
        <!-- Brand -->
        <a
          href="/"
          class="flex items-center gap-2 font-semibold text-xl text-blackcurrant hover:text-blackcurrant transition-colors"
        >
          <img
            src="/logo.svg"
            alt="Board Game Library Logo"
            class="h-10 w-auto -translate-y-[3px]"
          />
        </a>

        <!-- Desktop navigation (hide at 1030px and below) -->
<nav class="flex items-center gap-8 text-lg font-medium pt-[2px]">
  <!-- Top Games → stays until 660px -->
  <a
    href="/"
    class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
           hover:border-blackcurrant hover:text-blackcurrant
           {isActive('/', $page.url.pathname)
             ? 'font-semibold border-blackcurrant text-blackcurrant'
             : 'border-transparent'}
           max-[660px]:hidden"
  >
    Top Games
  </a>

  <!-- Trending Games → hides at 780px -->
  <a
    href="/trending"
    class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
           hover:border-blackcurrant hover:text-blackcurrant
           {isActive('/trending', $page.url.pathname)
             ? 'font-semibold border-blackcurrant text-blackcurrant'
             : 'border-transparent'}
           max-[780px]:hidden"
  >
    Trending Games
  </a>

  <!-- News → hides at 900px -->
  <a
    href="/news"
    class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
           hover:border-blackcurrant hover:text-blackcurrant
           {isActive('/news', $page.url.pathname)
             ? 'font-semibold border-blackcurrant text-blackcurrant'
             : 'border-transparent'}
           max-[900px]:hidden"
  >
    News
  </a>

  <!-- Scoreboard → hides at 1030px -->
  <a
    href="/scoreboard"
    class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
           hover:border-blackcurrant hover:text-blackcurrant
           {isActive('/scoreboard', $page.url.pathname)
             ? 'font-semibold border-blackcurrant text-blackcurrant'
             : 'border-transparent'}
           max-[1030px]:hidden"
  >
    Scoreboard
  </a>

  <!-- My Library → hides earliest (optional) -->
  <a
    href="/library"
    class="relative pb-[2px] text-blackcurrant font-medium text-lg transition-colors border-b-4
           hover:border-blackcurrant hover:text-blackcurrant
           {isActive('/library', $page.url.pathname)
             ? 'font-semibold border-blackcurrant text-blackcurrant'
             : 'border-transparent'}
           max-[1030px]:hidden"
  >
    My Library
  </a>
</nav>

      </div>

      <!-- Right: Search + Profile (always visible) -->
      <div class="flex items-center gap-5 h-[40px]">
        <!-- Search (fixed width) -->
        <div class="relative flex items-center h-[40px] w-[220px]">
          <img
            src="/images/search.svg"
            alt="Search"
            class="absolute left-3 h-4 w-4 pointer-events-none opacity-70"
          />
<input
  type="text"
  bind:value={searchQuery}
  placeholder={placeholder}
  class="h-[40px] w-full rounded-full border border-blackcurrant bg-white text-blackcurrant
         placeholder-blackcurrant/60 pl-9 pr-9 text-base leading-none box-border
         outline-none focus:outline-none focus:border-fancy-blue-dark
         focus:ring-2 focus:ring-fancy-blue-dark/30"
/>

          {#if searchQuery}
            <button
              type="button"
              on:click={clearSearch}
              class="absolute right-3 p-1 hover:scale-110 transition-transform"
              aria-label="Clear search"
            >
              <img
                src="/images/close.svg"
                alt="Clear"
                class="h-4 w-4 opacity-70 hover:opacity-100"
              />
            </button>
          {/if}
        </div>

        <!-- Profile icon (50px, animated hover) -->
        <a
          href="/account"
          class="flex items-center h-[56px] w-[56px] group relative shrink-0"
          aria-label="Account"
        >
          <div
            class="h-[56px] w-[56px] bg-no-repeat bg-center bg-contain transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3"
            style="background-image: url('/images/account.svg');"
          />
        </a>

        <!-- Hamburger (show at 1030px and below) -->
            <button
            class="hidden max-[1030px]:inline-flex items-center justify-center 
                    h-[40px] w-[40px] rounded-md 
                    border border-blackcurrant text-blackcurrant text-[22px] leading-[0.9]
                    hover:bg-blackcurrant/10 transition translate-y-[-1px]"
            style="border-width: 1.5px;"
            aria-label="Toggle menu"
            aria-expanded={open}
            on:click={() => (open = !open)}
            >
            {#if open} ✕ {:else} ☰ {/if}
            </button>



      </div>
    </div>
  </div>

  <!-- Mobile drawer (links list) -->
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
