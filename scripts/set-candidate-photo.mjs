import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifestPath=path.join(root,'data','candidate-photos.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const [candidateSlug,source]=process.argv.slice(2);
const usage='Usage: npm run photo:set -- <candidate-slug> <photo-file.jpg|png|webp>\nRun npm run photo:list to see all candidate slugs.';
if(!candidateSlug || !source){console.error(usage);process.exit(1);}
if(!Object.prototype.hasOwnProperty.call(manifest,candidateSlug)){
 console.error(`Unknown candidate: ${candidateSlug}\n${usage}`);process.exit(1);
}
const imagePath=path.resolve(source);
if(!fs.existsSync(imagePath)||!fs.statSync(imagePath).isFile()){
 console.error(`Image not found: ${imagePath}`);process.exit(1);
}
const ext=path.extname(imagePath).toLowerCase();
if(!['.jpg','.jpeg','.png','.webp'].includes(ext)){
 console.error('Supported formats: JPG, PNG, WebP');process.exit(1);
}
if(fs.statSync(imagePath).size>8*1024*1024){
 console.error('Image is larger than 8 MB. Please optimize before uploading.');process.exit(1);
}
const imageBuffer=fs.readFileSync(imagePath);
const signatures={
 '.jpg':imageBuffer[0]===0xff&&imageBuffer[1]===0xd8,
 '.jpeg':imageBuffer[0]===0xff&&imageBuffer[1]===0xd8,
 '.png':imageBuffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
 '.webp':imageBuffer.toString('ascii',0,4)==='RIFF'&&imageBuffer.toString('ascii',8,12)==='WEBP'
};
if(!signatures[ext]){console.error('The file contents do not match its image extension.');process.exit(1);}
const dir=path.join(root,'public','candidate-photos');
fs.mkdirSync(dir,{recursive:true});
const filename=`${candidateSlug}${ext}`;
const destination=path.join(dir,filename);
if(imagePath!==destination)fs.copyFileSync(imagePath,destination);
const old=manifest[candidateSlug];
manifest[candidateSlug]=`/candidate-photos/${filename}`;
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
if(old&&old.startsWith('/candidate-photos/')&&old!==manifest[candidateSlug]){
 const oldLocal=path.join(root,'public',old.replace(/^\//,''));
 if(fs.existsSync(oldLocal))fs.unlinkSync(oldLocal);
}
console.log(`✓ Updated ${candidateSlug}: ${manifest[candidateSlug]}`);
console.log('Rebuild and redeploy the website to publish the new photo.');
