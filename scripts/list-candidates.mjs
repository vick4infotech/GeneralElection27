import fs from 'node:fs';
const candidates=JSON.parse(fs.readFileSync(new URL('../data/candidate-photos.json',import.meta.url),'utf8'));
console.log('Candidate slug'.padEnd(44)+'Current photo');
console.log('-'.repeat(90));
for(const [slug,photo] of Object.entries(candidates))console.log(slug.padEnd(44)+(photo||'(Nigeria flag placeholder)'));
