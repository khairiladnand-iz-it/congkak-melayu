/* ===== SENJATA PUSAKA =====
   Senjata utama pemain: dibuka mengikut level, dipilih di skrin Pangkat, dan memberi
   kesan visual khas serta cahaya pada pahlawan ketika pertarungan tikam.
   KOSMETIK SAHAJA: tiada kesan pada kerosakan atau imbangan permainan.

   Setiap senjata juga ada kad sejarah, mengikut peraturan yang sama dengan kad Kisah:
   label jenis (sejarah / lagenda / dipertikai), zaman, tempat, kisah, satu fakta
   "Tahukah anda", dan SUMBER. Jangan tambah atau ubah fakta tanpa sumber.
   Sumber yang diringkaskan daripada Wikipedia menyebut buku yang dipetik di sana,
   dan dinyatakan begitu supaya pelajar tahu di mana untuk menyemak. */
const SENJATA=[
 {id:0,lv:1,n:'Keris',e:'🗡️',c:'#e8b64a',fx:'luk',kesan:'Hentaman berluk keemasan',
  j:'sejarah',z:'Turun-temurun hingga kini',p:'Alam Melayu (Nusantara)',
  k:'Senjata tikam yang bilahnya tidak simetri dan pangkalnya lebar. Bilahnya sering berluk (berlekuk-lekuk) dan berpamor — corak logam berlapis hasil tempaan. Keris bukan sekadar senjata: ia juga pusaka keluarga, tanda kedudukan dan sebahagian pakaian istiadat.',
  t:'Keris Indonesia diisytiharkan warisan tidak ketara oleh UNESCO pada 2005 dan dimasukkan ke dalam Senarai Representatif pada 2008. UNESCO mencatat kira-kira 120 jenis pamor dan 40 bentuk bilah (dhapur).',
  s:'UNESCO — Indonesian Kris (ich.unesco.org/en/RL/00112)'},
 {id:1,lv:3,n:'Kerambit',e:'🐾',c:'#ff8a3a',fx:'cakar',kesan:'Tiga cakaran sabit jingga',
  j:'sejarah',z:'Turun-temurun hingga kini',p:'Minangkabau, Sumatera Barat',
  k:'Pisau kecil melengkung seperti kuku, dengan cincin di hujung hulu untuk jari supaya tidak terlepas dari genggaman. Asalnya alat pertanian — untuk menggaru akar, mengumpul hasil tuaian dan menanam padi — sebelum dipercayai dijadikan senjata oleh masyarakat Minangkabau. Ia kemudian tersebar melalui jaringan perdagangan ke Semenanjung Melayu, Filipina dan Indochina.',
  t:'Menurut cerita rakyat, bentuknya diilhamkan daripada kuku harimau. Itu cerita rakyat; yang dicatat ialah asal-usulnya sebagai alat petani.',
  s:'Ringkasan Wikipedia “Karambit”, yang memetik S. Tarani, Karambit (2002) dan D. S. Farrer, Shadows of the Prophet (2009)'},
 {id:2,lv:7,n:'Badik',e:'🔪',c:'#4fd1c0',fx:'tusuk',kesan:'Tusukan kembar sepantas kilat',
  j:'sejarah',z:'Turun-temurun hingga kini',p:'Bugis dan Makassar, Sulawesi Selatan',
  k:'Pisau atau belati orang Bugis dan Makassar. Bilahnya tidak simetri dan kadangkala berpamor seperti keris, tetapi tanpa ganja. Hulunya seperti pemegang pistol, condong antara 45 hingga 90 darjah, diperbuat daripada kayu, tanduk atau gading. Lelaki membawanya setiap hari sehingga tahun 1960-an, dan ia masih dipakai dalam majlis adat.',
  t:'Badik hanya ada tiga bahagian: hulu, bilah dan sarung. Bandingkan dengan keris, yang ada ganja di pangkal bilahnya.',
  s:'Ringkasan Wikipedia “Badik”, yang memetik A. G. van Zonneveld, Traditional Weapons of the Indonesian Archipelago (2002) dan D. Draeger, Weapons and Fighting Arts of Indonesia (1972)'},
 {id:3,lv:12,n:'Rencong',e:'⚜️',c:'#ff5a4a',fx:'kilau',kesan:'Kilauan merah menyala',
  j:'sejarah',z:'Dipercayai sejak Kesultanan Aceh (abad ke-16)',p:'Aceh, Sumatera',
  k:'Belati Aceh dengan bilah sedikit melengkung dan hulu yang tersendiri. Ia dibawa sebagai perhiasan harian, bukan untuk bertempur sahaja. Rencong menjadi terkenal semasa Perang Aceh (1873–1904), apabila pejuang Aceh membawanya menentang Belanda. Rencong berhias emas atau gading dikaitkan dengan golongan bangsawan; yang daripada besi atau kayu dengan rakyat biasa.',
  t:'Bentuk rencong dikatakan menyerupai tulisan Arab “Bismillah”. Sumber kami menyebutnya sebagai dakwaan tanpa bukti — persoalan yang baik untuk kajian akademik: bagaimana dakwaan seperti ini boleh disemak?',
  s:'Indonesia Travel (Kementerian Pelancongan Indonesia) — “Rencong, the Traditional Weapon of Aceh Province”'},
 {id:4,lv:18,n:'Lembing Istiadat',e:'🔱',c:'#cfd8e6',fx:'tujah',kesan:'Tujahan perak, gelanggang bergegar',
  j:'sejarah',z:'Dahulu senjata; kini alat kebesaran',p:'Kesultanan Johor',
  k:'Lembing ialah tombak bermata besi. Di Johor, enam belas Lembing Istiadat dibawa dan diletakkan di hadapan perarakan diraja. Pada zaman dahulu lembing digunakan untuk melindungi raja semasa perarakan; kini ia lambang kuasa Sultan.',
  t:'Setiap Lembing Istiadat Johor panjangnya kira-kira 2.14 meter, bermata keluli dengan tujuh lekuk, dan berhias motif daun lada hitam, gambir serta bulan dan bintang.',
  s:'Portal Kemahkotaan Johor — Alat Istiadat Kebesaran: Lembing Istiadat'},
 {id:5,lv:24,n:'Mandau (Parang Ilang)',e:'🌿',c:'#5fd46a',fx:'libas',kesan:'Libasan hijau, daun berterbangan',
  j:'sejarah',z:'Turun-temurun hingga kini',p:'Borneo (Sarawak, Sabah, Kalimantan)',
  k:'Parang masyarakat Dayak di Borneo. Orang Iban, Bidayuh dan Penan menyebutnya parang ilang; orang Kayan menyebutnya malat. Bilahnya cembung di satu sisi dan sedikit cekung di sisi yang lain, sering diukir dengan corak tumbuhan menjalar dan bertatah tembaga. Hulunya biasanya daripada tanduk rusa.',
  t:'Mandau kini menjadi sebahagian lambang beberapa wilayah di Kalimantan, Indonesia.',
  s:'Ringkasan Wikipedia “Mandau (knife)”, yang memetik C. Lumholtz, Through Central Borneo (1920) dan A. G. van Zonneveld (2002)'},
 {id:6,lv:30,n:'Keris Taming Sari',e:'⚡',c:'#ffd45a',c2:'#8ec8ff',fx:'taming',kesan:'Kilat emas dan biru, gelanggang bergegar',
  j:'pertikai',z:'Abad ke-15 (menurut hikayat)',p:'Majapahit → Melaka → Perak',
  k:'Menurut kisah dalam hikayat Melayu, keris ini ditempa oleh pandai besi Jawa dan dibawa oleh Taming Sari, pendekar Majapahit. Hang Tuah menewaskan Taming Sari, lalu Raja Majapahit menghadiahkan keris itu kepadanya. Selepas Melaka jatuh ke tangan Portugis pada 1511, keris itu dikatakan dibawa oleh Sultan Mahmud ke Kampar dan kemudian ke Perak.',
  t:'Keris dalam alat kebesaran Perak dipercayai Taming Sari, tetapi kaitan itu berdasarkan kepercayaan, bukan bukti bertulis. Cerita bahawa ia ditempa daripada 21 jenis logam dan boleh melompat keluar dari sarungnya ialah lagenda.',
  s:'Sulalatus Salatin (Sejarah Melayu) · Hikayat Hang Tuah · The Star, “Don: The Taming Sari kris is in Perak” (2006)'}
];

const Senjata={
  /* senjata yang dipakai pemain; null jika belum ada yang dibuka (tidak berlaku: Keris dibuka di Lv 1) */
  dipakai(L){L=L||(typeof Prof!=='undefined'?Prof.lvl():1);
    const a=SENJATA.filter(w=>w.lv<=L);if(!a.length)return null;
    return a.find(w=>w.id===Prof.d.wpn)||a[0]},
  buka(L){return SENJATA.filter(w=>w.lv===L)},
  pilih(id){const w=SENJATA[id];if(!w||w.lv>Prof.lvl())return false;Prof.d.wpn=id;Prof.save();return true},
  /* kad sejarah: sama bentuk dengan kad Kisah, supaya pembaca dan pelajar biasa dengan susunannya */
  kad(i){
    const w=SENJATA[i];if(!w)return'';const J=JENIS[w.j]||JENIS.lagenda;
    return`<div class="panel kisah wkad" style="--wc:${w.c}"><h2>${esc(w.n)}</h2>
      <div class="kimg wico"><span>${w.e}</span></div>
      <p class="ktag" style="--kc:${J.w}"><b>${J.l}</b> · ${esc(w.z)} · ${esc(w.p)}</p>
      <p class="kdef">${esc(J.d)}</p>
      <p class="kstory">${esc(w.k)}</p>
      <div class="ktahu"><b>Tahukah anda?</b><p>${esc(w.t)}</p></div>
      <p class="ksrc">Sumber: ${esc(w.s)}</p>
      <p class="hnote">Dalam permainan: ${esc(w.kesan)}. Kesan visual sahaja — tidak mengubah kekuatan tikaman. Dibuka di level ${w.lv}.</p>
      <div class="center"><button class="btn" data-k="tutup">Tutup</button></div></div>`},
  open(i){if(typeof Kisah!=='undefined')Kisah.show(this.kad(i))},
  /* tab Senjata di skrin Pangkat */
  html(L){
    const cur=this.dipakai(L);
    return`<p class="hnote">Pilih senjata utama anda. Pahlawan yang memakainya bercahaya mengikut warna senjata, dan setiap tikaman yang kena memberi kesan khas. <b>Kesan visual sahaja</b> — tidak mengubah kekuatan.</p>
      <div class="wpns">${SENJATA.map(w=>{const un=w.lv<=L,on=cur&&cur.id===w.id;
        return`<div class="wpn${un?'':' lock'}${on?' sel':''}" style="--wc:${w.c}">
          <button class="wpb" data-wpn="${w.id}"${un?'':' disabled'}><i>${un?w.e:'🔒'}</i><b>${esc(w.n)}</b><small>${un?esc(w.kesan):'Buka di level '+w.lv}</small>${on?'<em>DIPAKAI</em>':''}</button>
          <button class="wsj" data-wsj="${w.id}" title="Sejarah ${esc(w.n)}">📜 Sejarah</button></div>`}).join('')}</div>
      <p class="hnote">Disusun untuk kegunaan akademik: setiap kad sejarah menyatakan sama ada ia <b>sejarah</b>, <b>lagenda</b> atau <b>dipertikai</b>, beserta sumbernya.</p>`}
};
