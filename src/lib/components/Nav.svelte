<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  const links = [
    { href: '/profile', label: 'Gaming Profile' },
    { href: '/top', label: 'Top Games' },
    { href: '/trending', label: 'Trending Games' },
    { href: '/community', label: 'Community' },
    { href: '/library', label: 'My Library' },
    { href: '/drop', label: 'Daily Drop' },
    { href: '/profile/settings', label: 'Settings' },
    { href: '/logout', label: 'Log Out' }
  ];

  let open = false;
  let searchQuery = '';
  const placeholder = 'Board Game';

  // 🔐 Logged-in state (adjust `user` if your data shape is different)
  let isLoggedIn = false;
  $: isLoggedIn = Boolean($page.data?.user);

  const isActive = (href: string, current: string) => {
    // Top Games: treat "/" as Top when logged OUT
    if (href === '/top') {
      return (!isLoggedIn && current === '/') || current === '/top';
    }

    // Trending Games: treat "/" as Trending when logged IN
    if (href === '/trending') {
      return (isLoggedIn && current === '/') || current === '/trending';
    }

    // Gaming Profile: only highlight exactly "/profile"
    if (href === '/profile') {
      return current === '/profile';
    }

    // Everyone else: exact match OR "section" match (e.g. /library, /library/123)
    return current === href || current.startsWith(href + '/');
  };

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
         h-[86px] max-[1055px]:h-[71px]"
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
      class="flex items-center justify-between gap-4 h-[76px] max-[1055px]:h-[66px]
             transition-all duration-300"
    >
      <!-- Left: logo + links -->
      <div class="flex items-center gap-0 sm:gap-6 md:gap-6">
        <!-- Brand (Home) -->
        <a
          href={isLoggedIn ? '/trending' : '/top'}
          class="flex items-center gap-2 font-semibold text-xl max-[1055px]:text-lg
                 text-blackcurrant hover:text-blackcurrant transition-all duration-300"
        >
          <img
            src="/logo.svg"
            alt="Board Game Library Logo"
            class="h-9 max-[1055px]:h-8 w-auto -translate-y-[1px] transition-all duration-300"
            width="62"
            height="46"
          />
        </a>

        <!-- Desktop navigation -->
        <nav
          class="flex items-center gap-8 max-[1055px]:gap-6 text-lg max-[1055px]:text-base
                 font-medium pt-[2px] transition-all duration-300"
        >
          <a
            href="/top"
            class="nav-link relative pb-[2px] text-blackcurrant transition-colors border-b-4
                   hover:border-blackcurrant hover:text-blackcurrant
                   {isActive('/top', $page.url.pathname)
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

            <a
              href="/drop"
              class="px-3 py-[8px] text-xs font-medium rounded-full select-none font-mono leading-none
                     bg-reading-chair-brown/15 text-dusty-hallway-very-dark"
              aria-label="Time until the next Daily Drop"
            >
              {countdown}
            </a>
          </div>
        </nav>
      </div>

      <!-- Right: Search + Profile + Hamburger -->
      <div
        class="flex items-center gap-5 h-[40px] max-[875px]:h-[42px]
               max-[875px]:gap-3 transition-transform duration-300
               max-[875px]:flex-1 max-[875px]:min-w-0"
      >
        <!-- Search -->
        <div
          class="relative flex items-center h-[40px] w-[280px]
                 transition-transform duration-300 max-[875px]:h-[40px]
                 max-[875px]:w-auto max-[875px]:flex-1 max-[875px]:min-w-0
                 max-[875px]:max-w-[720px] gap-0"
        >
          <img
            src="/images/search.svg"
            alt="Search"
            class="absolute left-4 h-4 w-4 pointer-events-none opacity-70
                   max-[875px]:h-4 max-[875px]:w-4"
          />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder={placeholder}
            class="h-full w-full rounded-full border border-blackcurrant bg-white text-blackcurrant
                   placeholder-blackcurrant/60 pl-11 pr-9 text-base leading-none box-border
                   outline-none focus:outline-none focus:border-fancy-blue-dark
                   focus:ring-2 focus:ring-fancy-blue-dark/30 transition-transform duration-300
                   max-[875px]:text-[17px] max-[875px]:pl-10 max-[875px]:pr-8 font-medium"
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
                class="h-4 w-4 opacity-70 hover:opacity-100
                      max-[875px]:h-4 max-[875px]:w-4"
              />
            </button>
          {/if}
        </div>

        <!-- Profile (desktop icon) -->
        <a
          href="/profile"
          class="flex items-center h-[40px] w-[40px] max-[1055px]:h-[36px] max-[1055px]:w-[36px]
                 group relative shrink-0 transition-all duration-300
                 max-[1225px]:hidden max-[1225px]:text-base"
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
            type="button"
            class="hidden max-[1225px]:inline-flex items-center justify-center h-[42px] w-[42px]
                    rounded-md text-blackcurrant leading-[0.9]
                    hover:bg-blackcurrant/10 transition border border-blackcurrant"
            aria-label="Toggle menu"
            aria-expanded={open}
            on:click={() => (open = !open)}
          >
          {#if open}
            <img src="/images/close.svg" alt="Close menu" class="h-[18px] w-[18px]" />
          {:else}
            <img src="/images/menu.svg" alt="Open menu" class="h-[18px] w-[18px]" />
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

              <a
                href="/drop"
                class="px-3 py-[8px] text-xs font-medium rounded-full select-none font-mono leading-none
                       bg-reading-chair-brown/15 text-dusty-hallway-very-dark"
                aria-label="Time until the next Daily Drop"
              >
                {countdown}
              </a>
            </div>
          {:else}
            {#if link.href === '/profile'}
              <!-- Profile + Settings pill -->
              <div class="py-2">
                <div
                  class="flex items-center justify-between gap-4 px-5 py-4 rounded-[5px]
                         bg-dusty-hallway/50 border border-dusty-hallway-dark"
                >
                  <!-- Left: Gaming Profile -->
                  <a
                    href="/profile"
                    class="flex items-center gap-2 text-blackcurrant transition-colors
                           {isActive('/profile', $page.url.pathname)
                             ? 'font-semibold underline underline-offset-4 decoration-blackcurrant/30'
                             : ''}"
                    on:click={() => (open = false)}
                    aria-current={isActive('/profile', $page.url.pathname) ? 'page' : undefined}
                  >
                    <img
                      src="/images/account.svg"
                      alt=""
                      class="h-8 w-8 brightness-0"
                      aria-hidden="true"
                    />
                    <span>{link.label}</span>
                  </a>

                  <!-- Right: Settings -->
                  <a
                    href="/profile/settings"
                    class="flex items-center gap-2 text-sm text-blackcurrant justify-end transition-colors
                           {isActive('/profile/settings', $page.url.pathname)
                             ? 'font-semibold underline underline-offset-4 decoration-blackcurrant/30'
                             : ''}"
                    on:click={() => (open = false)}
                    aria-current={isActive('/profile/settings', $page.url.pathname) ? 'page' : undefined}
                  >
                    <img
                      src="/images/settings.svg"
                      alt=""
                      class="h-5 w-5 brightness-0"
                      aria-hidden="true"
                    />
                    <span>Settings</span>
                  </a>
                </div>
              </div>

            {:else if link.href === '/profile/settings'}
              <!-- Settings is rendered inside the Profile pill above, so skip here -->

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
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</header>
