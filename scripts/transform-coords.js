#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function usage(){
  console.log('Uso: node transform-coords.js --file <path> [--scale <num>] [--tx <num>] [--ty <num>] [--dry] [--inplace] [--outdir <dir>]');
  process.exit(1);
}

// simple args parser to avoid external deps
function parseArgs(argv){
  const res = {};
  for(let i=0;i<argv.length;i++){
    const a = argv[i];
    if(a.startsWith('--')){
      const key = a.slice(2);
      // flags
      if(['dry','inplace'].includes(key)){
        res[key] = true; continue;
      }
      const val = argv[i+1];
      if(!val || val.startsWith('--')){ res[key] = true; continue; }
      res[key] = val; i++;
    }
  }
  return res;
}

const args = parseArgs(process.argv.slice(2));
const dry = !!args.dry;
const outdir = args.outdir ? path.resolve(args.outdir) : null;

// support single file or config that lists multiple files
if(!args.file && !args.config) usage();

function processSingle(fileArg, options){
  const filePath = path.resolve(fileArg);
  const scale = parseFloat(options.scale ?? '1');
  const tx = parseFloat(options.tx ?? '0'); // translate X (longitud)
  const ty = parseFloat(options.ty ?? '0'); // translate Y (latitud)
  const inplace = !!options.inplace;

  const content = fs.readFileSync(filePath,'utf8');
  const regex = /coords\s*:\s*\[\s*(-?[0-9]+(?:\.[0-9]+)?)\s*,\s*(-?[0-9]+(?:\.[0-9]+)?)\s*\]/g;
  let match; let out = content; const replacements = [];
  while((match = regex.exec(content)) !== null){
    const orig = match[0];
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    const newX = x * scale + tx;
    const newY = y * scale + ty;
    const formatted = `coords: [${formatNum(newX)}, ${formatNum(newY)}]`;
    replacements.push({orig, formatted});
  }
  if(replacements.length===0){
    console.log('No se encontraron coordenadas en', filePath);
    return;
  }
  replacements.forEach(r => { out = out.replace(r.orig, r.formatted); });

  if(dry){
    console.log('\n--- Preview:', filePath, '---');
    replacements.forEach((r, i)=>{
      console.log(`${i+1}. ${r.orig}  =>  ${r.formatted}`);
    });
    return;
  }

  if(inplace){
    fs.writeFileSync(filePath, out, 'utf8');
    console.log('Archivo sobrescrito:', filePath);
    return;
  }

  if(outdir){
    if(!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive:true });
    const dest = path.join(outdir, path.basename(filePath));
    fs.writeFileSync(dest, out, 'utf8');
    console.log('Archivo escrito en:', dest);
    return;
  }

  // default: print full transformed content
  console.log(out);
}

function formatNum(n){
  return Number(n).toFixed(6);
}

if(args.config){
  const configPath = path.resolve(args.config);
  const cfg = JSON.parse(fs.readFileSync(configPath,'utf8'));
  if(!Array.isArray(cfg.files)){
    console.log('config debe tener un arreglo "files"');
    process.exit(1);
  }
  for(const item of cfg.files){
    processSingle(item.file, item);
  }
  process.exit(0);
}

// single file mode
if(args.file){
  processSingle(args.file, args);
}
