const vm=require('vm'),fs=require('fs');const src=fs.readFileSync(require('path').join(__dirname,'chk.js'),'utf8');
const mkEl=()=>{const store={innerHTML:'',hidden:false,value:'',checked:true,textContent:'',children:[]};const cl=new Set();
 const base={classList:{add:(...a)=>a.forEach(x=>cl.add(x)),remove:(...a)=>a.forEach(x=>cl.delete(x)),toggle:(c,f)=>{(f===undefined?!cl.has(c):f)?cl.add(c):cl.delete(c)},contains:c=>cl.has(c)},
  style:{setProperty(){}},dataset:{},addEventListener(){},removeEventListener(){},appendChild(c){return c},remove(){},setPointerCapture(){},
  getBoundingClientRect:()=>({left:0,top:0,width:40,height:20}),closest:()=>null,querySelector:()=>mkEl(),querySelectorAll:()=>[],
  getContext:()=>new Proxy({},{get:()=>()=>({addColorStop(){}}),set:()=>true}),setAttribute(){},offsetWidth:1};
 return new Proxy(base,{get(t,p){return p in store?store[p]:t[p]},set(t,p,v){store[p]=v;return true}})};
const U=()=>new Proxy(function(){}, {get:(t,p)=>p===Symbol.toPrimitive?()=>0:p==='length'?0:p==='then'?undefined:U(),apply:()=>U(),construct:()=>U(),set:()=>true});
const els={};let clock=1e6,raf=0;
const RealDate=Date;
const ctx={THREE:process.env.NO3D?undefined:U(),console,__els:els,
 document:{getElementById:s=>els['#'+s]||(els['#'+s]=mkEl()),querySelector:s=>els[s]||(els[s]=mkEl()),createElement:()=>mkEl(),querySelectorAll:()=>[],body:mkEl(),documentElement:mkEl(),addEventListener(){},removeEventListener(){}},
 localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>{if(raf++<4e6)setImmediate(f)},innerWidth:1200,innerHeight:800,devicePixelRatio:1,addEventListener(){},
 setTimeout:(f)=>{setImmediate(f);return 0},clearTimeout(){},setInterval:()=>0,clearInterval(){},Date:Object.assign(function(...a){return a.length?new RealDate(...a):new RealDate(0)},{now:()=>(clock+=30),UTC:(...a)=>RealDate.UTC(...a),parse:(...a)=>RealDate.parse(...a)}),Math,JSON,Promise,Image:function(){},FileReader:function(){}};
ctx.window=ctx;vm.createContext(ctx);
try{vm.runInContext(src,ctx)}catch(e){console.log('LOAD ERROR',e.stack.split('\n').slice(0,4).join('\n'));process.exit(1)}
console.log('loaded; World.ok =',vm.runInContext('World.ok',ctx));
vm.runInContext(`(async()=>{${fs.readFileSync(process.argv[2],'utf8')}})().then(()=>{console.log('TESTS DONE');},e=>{console.log('TEST FAIL',e&&e.stack||e)}).then(()=>__exit())`,Object.assign(ctx,{__exit:()=>process.exit(0)}));
