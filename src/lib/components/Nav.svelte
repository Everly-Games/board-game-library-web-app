<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  const links = [
    { href: '/login', label: 'Gaming Profile' },
    { href: '/trending', label: 'Discover' },
    { href: '/settings', label: 'Settings' },
    { href: '/community', label: 'Community' },
    { href: '/drop', label: 'Daily Drop' },
    { href: '/library', label: 'My Library' },
    { href: '/logout', label: 'Log Out' }
  ];

  let open = false;
  let searchQuery = '';
  const placeholder = 'Board Game';

  // 🔐 Logged-in state (adjust `user` if your data shape is different)
  let isLoggedIn = false;
  $: isLoggedIn = Boolean($page.data?.user);

  let profileImageUrl: string | null = null;

  $: {
    const user = $page.data?.user;
    const profile = $page.data?.profile;
    const meta: any = user?.user_metadata ?? {};

    profileImageUrl =
      profile?.avatar_url ??
      meta.avatar_url ??
      meta.picture ??
      null;
  }

  const isActive = (paths: string[], current: string) => {
    // Everyone else: exact match OR "section" match (e.g. /library, /library/123)
    return paths.some((p) => current.startsWith(p));
  };

  function clearSearch() {
    searchQuery = '';
  }

  onMount(() => {
  const handleResize = () => {
    if (window.innerWidth > 1225 && open) {
      open = false;
    }
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
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
      <div class="flex items-center gap-0 sm:gap-0 md:gap-10">
        <!-- Brand (Home) -->
        <a
          href={'/'}
          class="flex items-center gap-2 text-xl max-[1055px]:text-lg
                 text-blackcurrant hover:text-blackcurrant transition-all duration-300"
        >
        <img
          src="/logo.svg"
          alt="Board Game Library Logo"
          class="hidden sm:block w-[140px] min-w-[120px] max-w-[160px] transition-all duration-300"
          style="height: auto"
        />

        <!-- Mobile icon (shows on small screens) -->
        <img
          src="/icon.svg"
          alt="Board Game Library Icon"
          class="block sm:hidden w-[40px] h-[40px] transition-all duration-300"
        />
        </a>
        

        <!-- Desktop navigation -->
        <nav
          class="flex items-center gap-2 max-[1055px]:gap-2 text-lg max-[1055px]:text-base
                 font-normal pt-[2px] transition-all duration-300"
        >

          <a
            href="/trending"
            class="nav-link px-4 py-1 transition-colors text-blackcurrant border
                   rounded-[6px] hover:border-blackcurrant hover:text-blackcurrant
                   {isActive(['/trending', '/top'], $page.url.pathname)
                     ? 'border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[850px]:hidden max-[850px]:text-base"
          >
            Discover
          </a>

          
          <a
            href="/community"
            class="nav-link px-4 py-1 transition-colors text-blackcurrant border
                  rounded-[6px] hover:border-blackcurrant hover:text-blackcurrant
                  {isActive(['/community'], $page.url.pathname)
                    ? 'border-blackcurrant text-blackcurrant'
                    : 'border-transparent'}
                   max-[850px]:hidden max-[900px]:text-base"
          >
            Community
          </a>

          <a
            href="/drop"
            class="nav-link px-4 py-1 transition-colors text-blackcurrant border
                    rounded-[6px] hover:border-blackcurrant hover:text-blackcurrant
                    {isActive(['/drop'], $page.url.pathname)
                      ? 'border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                    max-[900px]:hidden max-[1100px]:text-base"
          >
            Daily Drop
          </a>

          <a
            href="/library"
            class="nav-link px-4 py-1 transition-colors text-blackcurrant border
                   rounded-[6px] hover:border-blackcurrant hover:text-blackcurrant
                   {isActive(['/library'], $page.url.pathname)
                     ? 'border-blackcurrant text-blackcurrant'
                     : 'border-transparent'}
                   max-[1100px]:hidden max-[1100px]:text-base"
          >
            My Library
          </a>

 
          
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
                   placeholder-dusty-hallway-dark/75 pl-11 pr-9 text-base leading-none box-border
                   outline-none focus:outline-none focus:border-fancy-blue-dark
                   focus:ring-2 focus:ring-fancy-blue-dark/30 transition-transform duration-300
                   max-[875px]:text-[17px] max-[875px]:pl-10 max-[875px]:pr-8"
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
          href="/login"
          class="flex items-center h-[40px] w-[40px] max-[1055px]:h-[36px] max-[1055px]:w-[36px]
                 group relative shrink-0 transition-all duration-300
                 max-[1225px]:hidden max-[1225px]:text-base"
          aria-label="Profile"
        >
        <div
          class={`h-full w-full bg-no-repeat bg-center bg-contain transition-all duration-300
                  focus:outline-none focus:border-fancy-blue-dark
                  focus:ring-2 focus:ring-fancy-blue-dark/30
                  ${profileImageUrl ? 'rounded-full bg-cover' : ''}`}
          style={`background-image: url('${profileImageUrl || '/images/account.svg'}');`}
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
        {#if link.href === '/login'}
          <!-- Profile + Settings pill -->
          <div class="py-2">
            <div
              class="flex items-center justify-between gap-4 px-5 py-4 rounded-[5px]
                    bg-dusty-hallway/50 border border-dusty-hallway-dark"
            >
              <!-- Left: Gaming Profile -->
              <a
                href="/login"
                class="flex items-center gap-2 text-blackcurrant transition-colors
                      {isActive(['/login'], $page.url.pathname)
                        ? 'underline underline-offset-4 decoration-blackcurrant/30'
                        : ''}"
                on:click={() => (open = false)}
              >
                <img
                  src={profileImageUrl || '/images/account.svg'}
                  alt=""
                  class={`h-8 w-8 ${profileImageUrl ? 'rounded-full object-cover' : 'brightness-0'}`}
                />
                <span>{link.label}</span>
              </a>

              <!-- Right: Settings -->
              <a
                href="/settings"
                class="flex items-center gap-2 text-sm text-blackcurrant justify-end transition-colors
                      {isActive(['/settings'], $page.url.pathname)
                        ? 'underline underline-offset-4 decoration-blackcurrant/30'
                        : ''}"
                on:click={() => (open = false)}
              >
                <img src="/images/settings.svg" alt="" class="h-5 w-5 brightness-0" />
                <span>Settings</span>
              </a>
            </div>
          </div>
        {:else if link.href === '/settings'}
          <!-- Skip settings because it’s already inside the pill -->
        {:else}
          <a
            href={link.href}
            class="py-2 text-base text-blackcurrant hover:text-blackcurrant transition-colors
                  {isActive([link.href], $page.url.pathname)
                    ? 'underline underline-offset-4 decoration-blackcurrant/30'
                    : ''}"
            on:click={() => (open = false)}
          >
            {link.label}
          </a>
        {/if}
      {/each}

      </div>
    </div>
  {/if}
</header>
<!-- Subnav -->
{#if isActive(['/top', '/trending'], $page.url.pathname) && !open}
<header
  class="sticky top-0 z-50 relative text-blackcurrant not-prose transition-all duration-300
         h-[60px] max-[1055px]:h-[50px]"
  style="
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  "
>

  <!-- Inner container -->
  <div
    class="mx-auto max-w-[1440px] text-sm px-4 sm:px-6 lg:px-8 h-full
           pt-[10px] max-[1055px]:pt-[5px] transition-all duration-300"
  >
<div class="w-full flex justify-left">
      <!-- Left: logo + links -->
      <div class="flex items-center gap-0 sm:gap-0 md:gap-10">
      

  {#if isActive(['/top', '/trending'], $page.url.pathname)}
  <nav class="flex gap-4 text-base font-normal pt-[2px] relative">
    <a
      href="/trending"
      class="relative px-4 py-1 text-blackcurrant transition-colors
             after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-17px] max-[1055px]:after:bottom-[-12px]
             after:h-[6px] after:bg-blackcurrant after:transition-all
             {isActive(['/trending'], $page.url.pathname)
               ? 'after:opacity-100'
               : 'after:opacity-0 hover:after:opacity-40'}"
    >
      Trending Games
    </a>

    <a
      href="/top"
      class="relative px-4 py-1 text-blackcurrant transition-colors
             after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-17px] max-[1055px]:after:bottom-[-12px]
             after:h-[6px] after:bg-blackcurrant after:transition-all
             {isActive(['/top'], $page.url.pathname)
               ? 'after:opacity-100'
               : 'after:opacity-0 hover:after:opacity-40'}"
    >
      Top 10 Lists
    </a>
  </nav>
{/if}


        
      </div>

</header>

<hr class="h-px bg-dusty-hallway border-0">
{/if}