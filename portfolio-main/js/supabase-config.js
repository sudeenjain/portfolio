/**
 * SUPABASE CONFIGURATION
 * ----------------------------------------------------------------
 * Sets up and instantiates the global Supabase client instance.
 * Assumes the Supabase CDN script is loaded first:
 * https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
 * ----------------------------------------------------------------
 */

(function () {
    const SUPABASE_URL = "https://lkcxehwfjokdrknhxhgn.supabase.co";
    // Public publishable anon key (safe for frontend use)
    const SUPABASE_ANON_KEY = "sb_publishable_fy1VaHOW8F8wNXUvQh9RZg_mm8xRoC0";

    // Helper to dynamically load Supabase JS SDK if not present
    function initSupabase() {
        if (typeof supabase === 'undefined') {
            console.warn("Supabase library not yet loaded. Trying to initialize client once script is ready...");
            // Attach a listener to load
            document.addEventListener('DOMContentLoaded', () => {
                if (typeof supabase !== 'undefined') {
                    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                    console.log("Supabase client initialized on DOMContentLoaded.");
                } else {
                    console.error("Failed to load Supabase SDK from CDN.");
                }
            });
        } else {
            window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("Supabase client initialized immediately.");
        }
    }

    initSupabase();
})();
