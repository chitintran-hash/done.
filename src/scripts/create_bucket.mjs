import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking buckets...");
  
  // 1. Get all buckets
  const { data: buckets, error: getError } = await supabase.storage.listBuckets();
  if (getError) {
    console.error("Error getting buckets:", getError);
    return;
  }
  
  console.log("Existing buckets:", buckets.map(b => b.name));

  // 2. Create done-stores if it doesn't exist
  if (!buckets.some(b => b.name === 'done-stores')) {
    console.log("Creating done-stores bucket...");
    const { data, error } = await supabase.storage.createBucket('done-stores', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error) {
      console.error("Error creating bucket:", error);
    } else {
      console.log("Bucket created successfully:", data);
    }
  } else {
    console.log("Bucket done-stores already exists.");
  }
}

main();
