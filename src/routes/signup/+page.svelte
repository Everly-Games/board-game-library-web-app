<script lang="ts">
  // SvelteKit injects the last action result into `form`
  export let form;
</script>

<svelte:head>
  <title>Sign Up • Board Game Library</title>
</svelte:head>

<section class="max-w-md mx-auto px-4 py-8 space-y-6">
  <h1 class="text-2xl font-semibold mb-2">Create your account</h1>

  {#if form?.error}
    <p class="text-sm text-red-600 mb-2">{form.error}</p>
  {/if}

  {#if form?.success}
    <p class="text-sm text-green-600 mb-2">{form.message}</p>
  {/if}

  <!-- Email/password signup → named action "signup" -->
  <form method="POST" action="?/signup" class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1" for="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1" for="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        minlength="6"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1" for="password_confirm">
        Confirm password
      </label>
      <input
        id="password_confirm"
        name="password_confirm"
        type="password"
        required
        minlength="6"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
    </div>

    <button
      type="submit"
      class="w-full mt-2 inline-flex justify-center items-center rounded-full bg-black text-white px-5 py-2 text-sm font-medium hover:bg-gray-900"
    >
      Create account
    </button>
  </form>

  <div class="flex items-center gap-3 text-xs text-gray-500">
    <div class="flex-1 h-px bg-gray-200"></div>
    <span>or</span>
    <div class="flex-1 h-px bg-gray-200"></div>
  </div>

  <!-- Google OAuth → named action "google" -->
  <form method="POST" action="?/google">
    <button
      type="submit"
      class="w-full inline-flex justify-center items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium hover:bg-gray-50"
    >
      <img src="/images/google-icon.svg" alt="" class="h-4 w-4" />
      Continue with Google
    </button>
  </form>

  <p class="text-xs text-gray-600">
    Already have an account?
    <a href="/login" class="underline">Log in</a>
  </p>
</section>
