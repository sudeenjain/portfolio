/**
 * SUPABASE CONFIGURATION
 * ----------------------------------------------------------------
 * Creates the global Supabase client. The SDK (~190 KB) is loaded on demand via
 * window.ensureSupabase() so it never blocks the first paint. Pages that still include the
 * SDK <script> tag keep working: the client is created immediately in that case.
 * ----------------------------------------------------------------
 */
(function () {
    const SUPABASE_URL = "https://lkcxehwfjokdrknhxhgn.supabase.co";
    // Public publishable anon key (safe for frontend use)
    const SUPABASE_ANON_KEY = "sb_publishable_fy1VaHOW8F8wNXUvQh9RZg_mm8xRoC0";
    const SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    let pending = null;

    function createClient() {
        if (!window.supabaseClient && typeof supabase !== 'undefined') {
            window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
        return window.supabaseClient;
    }

    window.ensureSupabase = function () {
        if (window.supabaseClient) return Promise.resolve(window.supabaseClient);
        if (pending) return pending;
        pending = new Promise(function (resolve, reject) {
            if (typeof supabase !== 'undefined') return resolve(createClient());
            const s = document.createElement('script');
            s.src = SDK_URL;
            s.async = true;
            s.onload = function () { resolve(createClient()); };
            s.onerror = function () { pending = null; reject(new Error("Failed to load Supabase SDK from CDN.")); };
            document.head.appendChild(s);
        });
        return pending;
    };

    createClient(); // no-op unless the SDK tag was already on the page
})();
