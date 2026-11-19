import test from "node:test";
import assert from "node:assert/strict";
import { inspectMap } from "../main.js";
test("accepts a small valid map",()=>{
  const r=inspectMap({version:3,sources:["a.js"],sourcesContent:["x"],names:["x"],mappings:"AAAAA"});
  assert.equal(r.issues.length,0);
  assert.equal(r.segmentCount,1);
});
test("reports invalid version and source index",()=>{
  const r=inspectMap({version:2,sources:[],names:[],mappings:"ACAA"});
  assert.ok(r.issues.some(x=>x.includes("version")));
  assert.ok(r.issues.some(x=>x.includes("source index")));
});
test("rejects malformed VLQ",()=>{
  const r=inspectMap({version:3,sources:[],names:[],mappings:"?"});
  assert.ok(r.issues.some(x=>x.includes("Invalid Base64 VLQ")));
});
