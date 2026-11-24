// SPDX-License-Identifier: GPL-2.0-only
// Run: node scripts/generate.mjs [--check]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { isIP } from 'node:net';
import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
function sortRules(a){const order=["DOMAIN","DOMAIN-SUFFIX","DOMAIN-KEYWORD","IP-CIDR","IP-CIDR6","IP-ASN"];return [...a].sort((a,b)=>order.indexOf(a.split(",")[0])-order.indexOf(b.split(",")[0])||(a<b?-1:a>b?1:0));}
function generate(data){
 const expected=["OpenAI","Gemini","Claude / Anthropic"];
 const types=["DOMAIN","DOMAIN-SUFFIX","DOMAIN-KEYWORD","IP-CIDR","IP-CIDR6","IP-ASN"];
 function validate(g){
  if(JSON.stringify(Object.keys(g))!==JSON.stringify(expected))throw Error("Unexpected groups");
  const seen=new Set();
  for(const rules of Object.values(g))for(const rule of rules){
   const [type,value,...rest]=rule.split(",");
   if(!types.includes(type)||!value||rest.length||/\s/.test(value)||seen.has(rule))throw Error("Invalid or duplicate rule: "+rule);
   if(type.startsWith("DOMAIN")&&!/^[a-z0-9][a-z0-9.-]*$/.test(value))throw Error("Invalid domain: "+rule);
   if(type==="IP-ASN"&&!/^[1-9]\d*$/.test(value))throw Error("Invalid ASN: "+rule);
   if(type.startsWith("IP-CIDR")&&!/^[0-9a-fA-F:.]+\/\d{1,3}$/.test(value))throw Error("Invalid CIDR: "+rule);
   seen.add(rule);
  }
  return seen;
 }
 const base=validate(data.groups);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(data.updated))throw Error("Invalid date");
 const remove=new Set(data.precise.remove);
 for(const rule of remove)if(!base.has(rule))throw Error("Precise removal missing: "+rule);
 for(const key of Object.keys(data.precise.add))if(!expected.includes(key))throw Error("Invalid precise group");
 const precise=Object.fromEntries(expected.map(g=>[g,sortRules([...data.groups[g].filter(r=>!remove.has(r)),...(data.precise.add[g]||[])])]));
 validate(precise);
 const output={};
 const summary={};
 for(const [profile,g] of [["AI",data.groups],["AI_Precise",precise]]){
  const count=Object.values(g).reduce((n,r)=>n+r.length,0);
  summary[profile]={total:count,...Object.fromEntries(expected.map(x=>[x,g[x].length]))};
  for(const [client,ext] of [["QuantumultX",".list"],["Shadowrocket",".list"],["Clash","_Classical.yaml"]]){
   const q=client==="QuantumultX",clash=client==="Clash";
   const header=["# NAME: "+profile,"# DESCRIPTION: OpenAI + Gemini + Claude / Anthropic","# AUTHOR: joack-michel","# SOURCE: https://github.com/blackmatrix7/ios_rule_script","# UPDATED: "+data.updated,q?"# POLICY: AI":clash?"# BEHAVIOR: classical":null,"# LICENSE: GPL-2.0","# TOTAL: "+count,"# GENERATED: data/rules.json"].filter(Boolean);
   if(clash)header.push("payload:");
   const blocks=expected.map(k=>[`${clash?"  ":""}# ${k}`,...g[k].map(r=>q?r.replace(/^DOMAIN/,"HOST")+",AI":(clash?"  - ":"")+r+(r.startsWith("IP-")?",no-resolve":""))].join("\n"));
   output["rules/"+client+"/"+profile+ext]=header.join("\n")+(clash?"\n":"\n\n")+blocks.join("\n\n")+"\n";
  }
 }
 return {output,summary};
}
const data = JSON.parse(readFileSync('data/rules.json', 'utf8'));
for (const rules of [...Object.values(data.groups), ...Object.values(data.precise.add)]) {
 for (const r of rules) {
  const [type,value] = r.split(',');
  if (type === 'IP-CIDR' || type === 'IP-CIDR6') {
   const [ip,prefix] = value.split('/');
   const version = type === 'IP-CIDR' ? 4 : 6;
   if (isIP(ip) !== version || Number(prefix) > (version === 4 ? 32 : 128)) throw Error('Invalid IP range: '+r);
  }
 }
}
const {output,summary}=generate(data);
const readme=readFileSync('README.md','utf8');
const start='<!-- RULE-COUNTS:START -->', end='<!-- RULE-COUNTS:END -->';
if(readme.split(start).length!==2||readme.split(end).length!==2||readme.indexOf(start)>readme.indexOf(end))throw Error('Missing README count markers');
const countLines=[start,'| 版本 | OpenAI | Gemini | Claude / Anthropic | 总计 |','|---|---:|---:|---:|---:|',...Object.entries(summary).map(([name,x])=>'| '+name+' | '+x.OpenAI+' | '+x.Gemini+' | '+x['Claude / Anthropic']+' | '+x.total+' |'),end].join('\n');
output['README.md']=readme.slice(0,readme.indexOf(start))+countLines+readme.slice(readme.indexOf(end)+end.length);
const check=process.argv.includes('--check');
for(const [path,content] of Object.entries(output)){
 if(check){if(readFileSync(path,'utf8')!==content)throw Error('Out of date: '+path);}
 else{mkdirSync(dirname(path),{recursive:true});writeFileSync(path,content);}
}
console.log(JSON.stringify(summary));
