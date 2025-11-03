<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  const links = [
    { href: '/', label: 'Top Games' },
    { href: '/trending', label: 'Trending Games' },
    { href: '/news', label: 'News' },
    { href: '/scoreboard', label: 'Scoreboard' },
    { href: '/library', label: 'My Library' },
    { href: '/drop', label: 'Daily Drop' }
  ];

  let open = false;
  let searchQuery = '';
  const placeholder = 'Board Game';

  const isActive = (href: string, current: string) =>
    current === href || (href !== '/' && current.startsWith(href));

  function clearSearch() {
    searchQuery = '';
  }

  // Countdown logic
  let timer: ReturnType<typeof setInterval> | undefined;

  function getNextNoonET(): Date {
    const nowUtcMs = Date.now();
    const now = new Date(nowUtcMs);

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(now);
    const get = (type: string) =>
      Number(parts.find((p) => p.type === type)?.value ?? 0);

    const year = get('year');
    const month = get('month');
    const day = get('day');
    const hour = get('hour');
    const minute = get('minute');
    const second = get('second');

    const estNow = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    let targetEst = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    if (hour >= 12) {
      targetEst = new Date(Date.UTC(year, month - 1, day + 1, 12, 0, 0));
    }

    const diffMs = targetEst.getTime() - estNow.getTime();
    return new Date(nowUtcMs + diffMs);
  }

  function computeCountdown(): string {
    const target = getNextNoonET();
    const diff = target.getTime() - Date.now();

    if (diff <= 0) {
      return '0 minutes';
    }

    const totalMinutes = Math.floor(diff / (1000 * 60));

    if (totalMinutes <= 120) {
      return `${totalMinutes} minutes`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      return `in ${hours} hour${hours === 1 ? '' : 's'}`;
    }
  }

  let countdown: string = computeCountdown();

  function updateCountdown() {
    countdown = computeCountdown();
  }

  onMount(() => {
    timer = setInterval(updateCountdown, 60 * 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  });
</script>

<header
  class="sticky top-0 z-50 relative text-blackcurrant not-prose transition-all duration-300
         h-[86px] max-[1055px]:h-[61px]"
  style="
    background: var(--color-navbar-light);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  "
>
  <!-- Multicolor top border -->
  <div
    class="absolute top-0 left-0 w-full h-[10px] top-border transition-all duration-300 max-[1055px]:h-[6px]"
  ></div>

  <!-- Inner container -->
  <div
    class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 h-full
           pt-[10px] max-[1055px]:pt-[5px] transition-all duration-300"
  >
    <div
      class="flex items-center justify-between gap-4 h-[76px] max-[1055px]:h-[56px]
             transition-all duration-300"
    >
      <!-- Left: logo + links -->
      <div class="flex items-center gap-0 sm:gap-6 md:gap-6">
        <!-- Brand -->
        <a
          href="/"
          class="flex items-center gap-2 font-semibold text-xl max-[1055px]:text-lg
                 text-blackcurrant hover:text-blackcurrant transition-all duration-300"
        >
          <img
            src="/logo.svg"
            alt="Board Game Library Logo"
            class="h-9 max-[1055px]:h-6 w-auto -translate-y-[1px] transition-all duration-300"
            width="37"
            height="40"
          />
        </a>

        <!-- Desktop navigation -->
        <nav
          class="flex items-center gap-8 max-[1055px]:gap-6 text-lg max-[1055px]:text-base
                 font-medium pt-[2px] transition-all duration-300"
        >
          <a
            href="/"
            class="nav-link relative pb-[2px] text-blackcurrant transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[650px]:hidden max-[900px]:text-base"
          >
            Top Games
          </a>

          <a
            href="/trending"
            class="nav-link relative pb-[2px] text-blackcurrant transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/trending', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[650px]:hidden max-[900px]:text-base"
          >
            Trending Games
          </a>

          <a
            href="/community"
            class="nav-link relative pb-[2px] text-blackcurrant transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/community', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[800px]:hidden max-[800px]:text-base"
          >
            Community
          </a>

          <!-- My Library now falls off later than Daily Drop -->
          <a
            href="/library"
            class="nav-link relative pb-[2px] text-blackcurrant transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/library', $page.url.pathname)
                     ? 'font-semibold border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[950px]:hidden max-[950px]:text-base"
          >
            My Library
          </a>

          <!-- Daily Drop + Capsule Countdown (desktop) -->
          <div class="flex items-center gap-3 max-[1225px]:hidden">
            <a
              href="/drop"
              class="nav-link relative pb-[2px] text-blackcurrant transition-colors border-b-4
                     hover:border-blackcurrant hover:text-blackcurrant
                     {isActive('/drop', $page.url.pathname)
                       ? 'font-semibold border-blackcurrant text-blackcurrant'
                       : 'border-transparent'}
                     max-[1225px]:text-base"
            >
              Daily Drop
            </a>

            <span
              class="px-3 py-[8px] text-xs font-medium rounded-full select-none font-mono leading-none
                     bg-dusty-hallway/50 text-dusty-hallway-very-dark"
            >
              {countdown}
            </span>
          </div>
        </nav>
      </div>

      <!-- Right: Search + Profile + Hamburger -->
      <div
        class="flex items-center gap-5 h-[40px] max-[875px]:h-[36px]
               max-[875px]:gap-3 transition-transform duration-300
               max-[875px]:flex-1 max-[875px]:min-w-0"
      >
        <!-- Search -->
        <div
          class="relative flex items-center h-[40px] w-[280px]
                 transition-transform duration-300 max-[875px]:h-[34px]
                 max-[875px]:w-auto max-[875px]:flex-1 max-[875px]:min-w-0
                 max-[875px]:max-w-[720px] gap-0"
        >
          <img
            src="/images/search.svg"
            alt="Search"
            class="absolute left-3 h-4 w-4 pointer-events-none opacity-70 max-[875px]:h-4 max-[875px]:w-4"
          />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder={placeholder}
            class="h-full w-full rounded-full border border-blackcurrant bg-white text-blackcurrant
                   placeholder-blackcurrant/60 pl-9 pr-9 text-base leading-none box-border
                   outline-none focus:outline-none focus:border-fancy-blue-dark
                   focus:ring-2 focus:ring-fancy-blue-dark/30 transition-transform duration-300
                   max-[875px]:text-[14px] max-[875px]:pl-8 max-[875px]:pr-8"
          />
          {#if searchQuery}
            <button
              type="button"
              on:click={clearSearch}
              class="absolute right-3 p-1 hover:scale-110 transition-transform max-[875px]:right-2"
              aria-label="Clear search"
            >
              <img
                src="/images/close.svg"
                alt="Clear"
                class="h-4 w-4 opacity-70 hover:opacity-100 max-[875px]:h-4 max-[875px]:w-4"
              />
            </button>
          {/if}
        </div>

        <!-- Profile -->
        <a
          href="/profile"
          class="flex items-center h-[40px] w-[40px] max-[1055px]:h-[36px] max-[1055px]:w-[36px]
                 group relative shrink-0 transition-all duration-300"
          aria-label="Profile"
        >
          <div
            class="h-full w-full bg-no-repeat bg-center bg-contain transition-all duration-300
                   focus:outline-none focus:border-fancy-blue-dark
                   focus:ring-2 focus:ring-fancy-blue-dark/30"
            style="background-image: url('/images/account.svg');"
          ></div>
        </a>

        <!-- Hamburger -->
        <button
          class="hidden max-[1225px]:inline-flex items-center justify-center h-[36px] w-[36px]
                  rounded-md text-blackcurrant leading-[0.9]
                  hover:bg-blackcurrant/10 transition"
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
      <div class="mx-auto max-w-[1440px] px-4 py-3 flex flex-col gap-3">
        {#each links as link}
          {#if link.href === '/drop'}
            <div class="flex items-center justify-between py-2">
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

              <!-- Capsule countdown (mobile) -->
              <span
                class="px-3 py-[8px] text-xs font-medium rounded-full select-none font-mono leading-none
                       bg-dusty-hallway/50 text-dusty-hallway-very-dark"
              >
                {countdown}
              </span>
            </div>
          {:else}
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
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</header>
