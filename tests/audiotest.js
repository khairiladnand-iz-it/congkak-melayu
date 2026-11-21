/* Audio: gaya muzik dan leitmotif selari dengan pahlawan; API bunyi senjata wujud. */
let ok=true;const chk=(c,m)=>{if(!c){ok=false;console.log('FAIL',m)}};
for(let i=0;i<NBASE;i++)chk(['asli','kelantan','borneo','aceh','pantai'].includes(Mus.gayaOf(i)),`pahlawan ${i} ada gaya muzik`);
chk(Mus.gayaOf(14)==='borneo','Puteri Santubong: sape Borneo');
chk(Mus.gayaOf(15)==='aceh','Laksamana Malahayati: rapa\'i Aceh');
chk(Mus.gayaOf(16)==='pantai','Mahsuri: suling pantai');
chk(Mus.gayaOf(10)==='kelantan'&&Mus.gayaOf(12)==='kelantan','Kelantan: gamelan & rebab');
chk(Mus.gayaOf(0)==='asli','Hang Tuah: asli');
chk(Mus.gayaOf(999)==='asli','avatar sendiri jatuh balik ke asli');
chk(typeof Mus.motif==='function'&&typeof Mus.duck==='function','motif & tunduk muzik wujud');
for(const w of SENJATA)chk(['luk','cakar','tusuk','kilau','tujah','libas','taming'].includes(w.fx),`${w.n}: ada bunyi senjata`);
chk(typeof Snd.senjata==='function','Snd.senjata wujud');
/* tiada konteks audio dalam ujian: semua panggilan mesti senyap tanpa ralat */
try{Mus.gaya(14);Mus.motif(3);Mus.duck();Snd.senjata('taming');for(let i=0;i<30;i++)Snd.knock(3)}catch(e){chk(false,'panggilan audio tanpa konteks: '+e.message)}
chk(Mus.gy==='borneo','gaya bertukar');
console.log(ok?'AUDIO OK':'AUDIO GAGAL');console.log('TESTS DONE');
