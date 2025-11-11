<script lang="ts">
  export let data;

  const { profile, countries, genders, email, emailVerified } = data;

  let first_name: string = profile.first_name ?? '';
  let last_name: string = profile.last_name ?? '';
  let country_code: string = profile.country_code ?? '';
  let gender: string = profile.gender ?? '';
  let birth_year: string = profile.birth_year ? String(profile.birth_year) : '';
  let is_over_18: boolean = profile.is_over_18 ?? false;
</script>

<svelte:head>
  <title>Settings • Board Game Library</title>
</svelte:head>

<section class="max-w-xl mx-auto px-4 py-8 space-y-6">
  <h1 class="text-2xl font-semibold mb-2">Settings</h1>

  <div class="text-sm text-gray-600 space-y-0.5">
    <div><span class="font-medium">Email:</span> {email}</div>
    <div>
      <span class="font-medium">Verified:</span>
      {emailVerified ? ' Yes' : ' No'}
    </div>
  </div>

  {#if data.error}
    <p class="text-sm text-red-600">{data.error}</p>
  {/if}
  {#if data.success}
    <p class="text-sm text-green-600">Profile updated.</p>
  {/if}

  <form method="POST" class="space-y-5">
    <!-- First & Last Name -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1" for="first_name">
          First name
        </label>
        <input
          id="first_name"
          name="first_name"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          bind:value={first_name}
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1" for="last_name">
          Last name
        </label>
        <input
          id="last_name"
          name="last_name"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          bind:value={last_name}
        />
      </div>
    </div>

    <!-- Country -->
    <div>
      <label class="block text-sm font-medium mb-1" for="country_code">
        Country
      </label>
      <select
        id="country_code"
        name="country_code"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
        bind:value={country_code}
      >
        <option value="">Select country</option>
        {#each countries as c}
          <option value={c.code}>
            {c.name}
          </option>
        {/each}
      </select>
      {#if country_code}
        <p class="mt-1 text-xs text-gray-500">
          We’ll show a flag for {country_code} in your profile UI.
        </p>
      {/if}
    </div>

    <!-- Gender -->
    <div>
      <label class="block text-sm font-medium mb-1" for="gender">
        Gender
      </label>
      <select
        id="gender"
        name="gender"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
        bind:value={gender}
      >
        <option value="">Prefer not to say</option>
        {#each genders as g}
          <option value={g}>{g}</option>
        {/each}
      </select>
    </div>

    <!-- Birth Year & 18+ -->
    <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
      <div>
        <label class="block text-sm font-medium mb-1" for="birth_year">
          Birth year
        </label>
        <input
          id="birth_year"
          name="birth_year"
          type="number"
          inputmode="numeric"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g. 1990"
          bind:value={birth_year}
        />
        <p class="mt-1 text-xs text-gray-500">
          Used for analytics and age ranges.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <input
          id="is_over_18"
          name="is_over_18"
          type="checkbox"
          class="h-4 w-4"
          bind:checked={is_over_18}
        />
        <label for="is_over_18" class="text-sm">
          I confirm I am 18 years of age or older
        </label>
      </div>
    </div>

    <button
      type="submit"
      class="mt-4 inline-flex items-center rounded-full bg-black text-white px-5 py-2 text-sm font-medium hover:bg-gray-900"
    >
      Save changes
    </button>
  </form>

  <a href="/signout">Sign out</a>
</section>
