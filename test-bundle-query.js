const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
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
