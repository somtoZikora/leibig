import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

// Load env vars
const envContent = readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2024-01-01",
  token: env.SANITY_API_TOKEN,
});

async function testBundle() {
  const query = `*[_type == "bundle" && slug.current == "einstieg-ins-glueck"][0] {
    _id,
    title,
    bundleItems[] {
      _key,
      quantity,
      product-> {
        _id,
        title,
        isArchived,
        winestroId
      }
    }
  }`;
  
  const result = await client.fetch(query);
  console.log(JSON.stringify(result, null, 2));
}

testBundle().catch(console.error);
