const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
            process.env[key] = value;
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
}

async function testStorage() {
    console.log('--- Testing Research Papers Storage ---');
    console.log(`URL: ${supabaseUrl}`);

    // Test 1: Service Role (Admin) Access
    // This bypasses RLS, so it checks if files physically exist.
    if (serviceKey) {
        console.log('\n[1] Checking with Service Role (Admin)...');
        const adminClient = createClient(supabaseUrl, serviceKey);
        const { data: buckets, error: bucketError } = await adminClient.storage.listBuckets();

        if (bucketError) {
            console.error('Error listing buckets (Admin):', bucketError.message);
        } else {
            const bucket = buckets.find(b => b.name === 'research-papers');
            console.log('Buckets found:', buckets.map(b => b.name));
            if (!bucket) {
                console.error('❌ Bucket "research-papers" NOT FOUND.');
            } else {
                console.log('✅ Bucket "research-papers" exists.');

                // List files in root
                const { data: files, error: listError } = await adminClient.storage
                    .from('research-papers')
                    .list();

                if (listError) {
                    console.error('Error listing files (Admin):', listError.message);
                } else {
                    console.log(`Found ${files.length} items in root:`);
                    files.forEach(f => console.log(` - ${f.name} (${f.metadata ? f.metadata.mimetype : 'folder'})`));
                }
            }
        }
    } else {
        console.log('Skipping Admin check (no service key found)');
    }

    // Test 2: Anon Key Access
    // This checks if the RLS policies actually allow the public to see them.
    console.log('\n[2] Checking with Anon Key (Public Access)...');
    const publicClient = createClient(supabaseUrl, supabaseKey);
    const { data: publicFiles, error: publicError } = await publicClient.storage
        .from('research-papers')
        .list();

    if (publicError) {
        console.error('❌ Error listing files (Public):', publicError.message);
        console.error('   Hint: Check your RLS policies for storage.objects.');
    } else {
        console.log(`Found ${publicFiles.length} items with Public Access:`);
        publicFiles.forEach(f => console.log(` - ${f.name}`));

        if (publicFiles.length === 0) {
            console.log('⚠️ Public list is EMPTY. If Admin list had files, RLS policies are blocking access.');
        } else {
            console.log('✅ Public access working.');
        }
    }
}

testStorage();
