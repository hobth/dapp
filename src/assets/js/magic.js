const magic = new Magic('pk_live_FD62AAB7386C0B17');




/* 3. Implement Render Function */
const render = async () => {
  let html = '';

  /*
    For this tutorial, our callback route is simply "/callback"
  */
   console.log(window.location.pathname);
  if (window.location.pathname === '/callback') {
    try {
      /* Complete the "authentication callback" */
      await magic.auth.loginWithCredential();

      /* Get user metadata including email */
      const userMetadata = await magic.user.getMetadata();

      html = `
        <h1>Current user: ${userMetadata.email}</h1>
        <button onclick="handleLogout()">Logout</button>
      `;
    } catch {
      /* In the event of an error, we'll go back to the login page */
      window.location.href = window.location.origin;
    }
  } else {
    const isLoggedIn = await magic.user.isLoggedIn();
    console.log('isLoggedIn', isLoggedIn);
    /* Show login form if user is not logged in */
    html = `
      <form onsubmit="handleLogin(event)">

        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input type="email" name="email" required="required" placeholder="Enter your email" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
          </div>
        </div>

        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-b-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <!-- Heroicon name: solid/lock-closed -->
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </span>
          Sign in
        </button>

      </form>
    `;

    if (isLoggedIn) {
      /* Get user metadata including email */
      const userMetadata = await magic.user.getMetadata();
      
      html = `
        <h1>Current user: ${userMetadata.email}</h1>
        <button onclick="handleLogout()">Logout</button>
      `;
      window.location.href = window.location.origin+'/';
    }
  }
  
  document.getElementById('app').innerHTML = html;
};

const checkLogin = async (callback) => {
    const isLoggedIn = await magic.user.isLoggedIn();
    console.log('check isLoggedIn', isLoggedIn);
    if (isLoggedIn) {
        const userMetadata = await magic.user.getMetadata();
        callback(userMetadata);
    } else {
        window.location.href = window.location.origin+'/login';
    }
}

/* 4. Implement Login Handler */
const handleLogin = async e => {
  e.preventDefault();
  const email = new FormData(e.target).get('email');
  const redirectURI = `${window.location.origin}/`; // 👈 This will be our callback URI
  if (email) {
    /* One-liner login 🤯 */
    await magic.auth.loginWithMagicLink({ email, redirectURI }); // 👈 Notice the additional parameter!
    render();
  }
};



/* 5. Implement Logout Handler */
const handleLogout = async () => {
  console.log('logout');
  await magic.user.logout();
  window.location.href = window.location.origin+'/login';
  //render();
};


