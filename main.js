#!/usr/bin/env node
import fs from "node:fs";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function decodeVlq(segment) {
  const values=[]; let value=0, shift=0;
  for (const char of segment) {
    const digit=ALPHABET.indexOf(char);
    if (digit<0) throw new Error(`Invalid Base64 VLQ character: ${char}`);
    const continuation=digit & 32;
    value |= (digit & 31) << shift;
    if (continuation) { shift+=5; if(shift>30) throw new Error("VLQ value is too large"); }
    else {
      const negative=value & 1;
      values.push(negative ? -(value >> 1) : (value >> 1));
      value=0; shift=0;
    }
  }
  if(shift!==0) throw new Error("Incomplete VLQ value");
  return values;
}
export function inspectMap(map) {
  const issues=[];
  if(map?.version!==3) issues.push("version must be 3");
  if(!Array.isArray(map?.sources)) issues.push("sources must be an array");
  if(!Array.isArray(map?.names)) issues.push("names must be an array");
  if(typeof map?.mappings!=="string") issues.push("mappings must be a string");
  if(issues.length) return {sourceCount:0,nameCount:0,lineCount:0,segmentCount:0,sourcesContentCoverage:0,issues};
  const sources=map.sources, names=map.names, lines=map.mappings.split(";"); let segmentCount=0;
  let sourceIndex=0, originalLine=0, originalColumn=0, nameIndex=0;
  lines.forEach((line,lineIndex)=>{
    let generatedColumn=0;
    if(!line) return;
    for(const raw of line.split(",")) {
      if(!raw) continue;
      try {
        const fields=decodeVlq(raw); segmentCount++;
        if(fields.length!==1 && fields.length!==4 && fields.length!==5) {
          issues.push(`line ${lineIndex+1}: segment has ${fields.length} fields`); continue;
        }
        generatedColumn+=fields[0];
        if(generatedColumn<0) issues.push(`line ${lineIndex+1}: negative generated column`);
        if(fields.length>=4) {
          sourceIndex+=fields[1]; originalLine+=fields[2]; originalColumn+=fields[3];
          if(sourceIndex<0||sourceIndex>=sources.length) issues.push(`line ${lineIndex+1}: source index ${sourceIndex} is out of range`);
          if(originalLine<0||originalColumn<0) issues.push(`line ${lineIndex+1}: negative original position`);
          if(fields.length===5) { nameIndex+=fields[4]; if(nameIndex<0||nameIndex>=names.length) issues.push(`line ${lineIndex+1}: name index ${nameIndex} is out of range`); }
        }
      } catch(error) { issues.push(`line ${lineIndex+1}: ${error.message}`); }
    }
  });
  const duplicateSources=sources.filter((s,i)=>sources.indexOf(s)!==i);
  for(const source of new Set(duplicateSources)) issues.push(`duplicate source: ${source}`);
  const content=Array.isArray(map.sourcesContent)?map.sourcesContent:[];
  const present=content.filter(x=>typeof x==="string").length;
  if(content.length && content.length!==sources.length) issues.push("sourcesContent length does not match sources");
  return {sourceCount:sources.length,nameCount:names.length,lineCount:lines.length,segmentCount,
    sourcesContentCoverage:sources.length?Math.round(present*100/sources.length):0,issues};
}
function main() {
  const file=process.argv[2], json=process.argv.includes("--json");
  if(!file) { console.error("Usage: node main.js <file.map> [--json]"); process.exitCode=2; return; }
  let map;
  try { map=JSON.parse(fs.readFileSync(file,"utf8")); }
  catch(error) { console.error(`Cannot read source map: ${error.message}`); process.exitCode=2; return; }
  const report=inspectMap(map);
  if(json) console.log(JSON.stringify(report,null,2));
  else {
    console.log("Source Map Inspector");
    console.log(`Sources: ${report.sourceCount} | Names: ${report.nameCount} | Lines: ${report.lineCount} | Segments: ${report.segmentCount}`);
    console.log(`sourcesContent coverage: ${report.sourcesContentCoverage}%`);
    for(const issue of report.issues) console.log(`- ${issue}`);
    if(!report.issues.length) console.log("No structural issues found.");
  }
  if(report.issues.length) process.exitCode=1;
}
if(process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main();
