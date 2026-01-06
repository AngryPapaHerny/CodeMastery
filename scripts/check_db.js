
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log("Starting DB Check...");

    // 1. Read .env.local manually
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error("No .env.local found!");
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) envVars[key.trim()] = val.trim().replace(/"/g, '');
    });

    const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
    const serviceKey = envVars['SUPABASE_SERVICE_ROLE_KEY']; // Check for this first
    const anonKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

    if (!url) {
        console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
        return;
    }

    // Prefer service key for diagnosis to bypass RLS
    const keyToUse = serviceKey || anonKey;
    const isServiceRole = !!serviceKey;

    console.log(`Connecting to ${url}`);
    console.log(`Using Key: ${isServiceRole ? 'Service Role (Full Access)' : 'Anon (RLS Restricted)'}`);

    const supabase = createClient(url, keyToUse);

    // 2. Check Profiles Table Schema (via RPC or just select)
    // If we are service role, we can just inspect.
    // If anon, we might be blocked if we can't select other profiles.

    try {
        console.log("\nChecking 'posts' table accessibility...");
        const { data: posts, error: postError } = await supabase.from('posts').select('id').limit(1);
        if (postError) console.error("Error accessing posts:", postError);
        else console.log("Success accessing posts. Count:", posts.length);

        console.log("\nChecking 'profiles' table columns...");
        // Hack: Try to select 'points' column specifically.
        const { data: profiles, error: profileError } = await supabase.from('profiles').select('id, points').limit(1);

        if (profileError) {
            console.error("Error accessing profiles (potentially points column missing?):", profileError);
        } else {
            console.log("Success accessing profiles. Sample:", profiles[0]);
            if (profiles.length > 0 && profiles[0].points === undefined) {
                console.error("!!! 'points' column seems MISSING in response (or RLS hidden) !!!");
            } else {
                console.log("'points' column appears to exist.");
            }
        }

    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

main();
