/* ===== SEJARAH PAHLAWAN ===== */
const HIST=[
 {era:'Abad ke-15 · zaman Sultan Mansur Shah',tag:'Tokoh legenda',
  s:'Laksamana Melaka yang termasyhur dalam Hikayat Hang Tuah dan Sejarah Melayu. Dikisahkan berguru silat bersama empat sahabatnya, Hang Jebat, Hang Kasturi, Hang Lekir dan Hang Lekiu, lalu naik pangkat menjadi laksamana yang mengiringi Sultan ke Majapahit, China dan negeri-negeri lain. Keris Taming Sari yang terkenal dikaitkan dengan beliau.',
  f:'Ungkapan “Takkan Melayu hilang di dunia” sering dikaitkan dengannya. Sarjana masih berbeza pendapat sama ada Hang Tuah benar-benar wujud; hikayatnya ialah karya sastera yang bercampur legenda.'},
 {era:'Abad ke-15 · Melaka',tag:'Tokoh legenda',
  s:'Sahabat karib Hang Tuah dan pendekar istana Melaka. Apabila Hang Tuah difitnah dan dijatuhi hukuman bunuh, Jebat mengamuk di istana untuk menuntut bela. Hang Tuah, yang sebenarnya masih hidup, akhirnya diperintahkan menewaskannya.',
  f:'Dalam hikayat Jebat dianggap penderhaka, tetapi ramai penulis abad ke-20 memandangnya pejuang keadilan. Perdebatan “Tuah lawan Jebat” masih hangat sehingga kini.'},
 {era:'Abad ke-15 · Melaka',tag:'Tokoh legenda',
  s:'Salah seorang daripada lima sahabat dalam Hikayat Hang Tuah, digambarkan setia, tangkas dan mahir bersenjata. Bersama sahabat-sahabatnya, beliau dikatakan berguru dengan Adi Putera di Gunung Ledang. Dalam permainan ini, beliau digambarkan sebagai pemanah.',
  f:'Nama Hang Lekiu hampir selalu disebut bersama Hang Lekir dalam senarai lima sahabat. Watak pemanah ialah tafsiran permainan ini, bukan gambaran hikayat.'},
 {era:'1446–1459 · Kesultanan Melaka',tag:'Tokoh sejarah',
  s:'Sultan Melaka yang memerintah dari 1446 hingga 1459. Pada zamannya Melaka menahan serangan Siam dan mengukuhkan kedudukan sebagai pelabuhan dagang antarabangsa, dibantu Bendahara Tun Perak yang bijak mengatur pertahanan dan pengaruh Melaka.',
  f:'Gelaran “Muzaffar” bermaksud yang berjaya atau menang. Selepas baginda, putera baginda Sultan Mansur Shah memerintah pada zaman yang sering disebut zaman gemilang Melaka.'},
 {era:'Tradisi Singapura & Riau',tag:'Tokoh legenda',
  s:'Dalam Sejarah Melayu, seorang budak bijak mencadangkan benteng batang pisang untuk menahan serangan ikan todak di Singapura. Tradisi Riau dan Batam menamakannya Hang Nadim dan mengenangnya sebagai laksamana lautan. Dikisahkan beliau akhirnya dibunuh kerana kebijaksanaannya dicemburui.',
  f:'Namanya diabadikan pada Lapangan Terbang Hang Nadim di Batam. Dalam kisah asalnya, nasihat si budak menyelamatkan Singapura, tetapi kebijaksanaan itu juga yang membawa celakanya.'},
 {era:'Sekitar 1400 · Palembang, Temasek, Melaka',tag:'Tokoh sejarah',
  s:'Putera dari Palembang (warisan Srivijaya) yang melarikan diri ke Temasek, kemudian ke Muar dan akhirnya mengasaskan Melaka sekitar tahun 1400. Beliau menjalin hubungan dengan Maharaja Yongle dari Dinasti Ming, dan dicatat melawat China sekitar 1411 untuk mendapatkan perlindungan.',
  f:'Menurut Sejarah Melayu, Melaka dinamakan sempena pokok tempat seekor pelanduk menendang anjing perburuan baginda. Kisah baginda memeluk Islam sebagai Iskandar Shah masih dibahaskan sarjana.'},
 {era:'Abad ke-15 · Melaka',tag:'Tokoh legenda',
  s:'Menurut Sejarah Melayu, seorang puteri Maharaja China dihantar untuk dikahwinkan dengan Sultan Mansur Shah bersama kira-kira 500 pengiring. Mereka dikatakan menetap di Bukit Cina, Melaka.',
  f:'Sumber Cina tidak mengesahkan kewujudan beliau. Namun Bukit Cina dan Perigi Hang Li Poh masih boleh dilawati di Melaka hari ini.'},
 {era:'Sekitar 1444–1446 · Kesultanan Melaka',tag:'Tokoh sejarah',
  s:'Raja Ibrahim, putera Sultan Muhammad Shah, bergelar Sultan Abu Syahid dan memerintah dalam tempoh yang singkat sebelum digulingkan dalam pergolakan istana. Saudara tirinya Raja Kasim kemudian menaiki takhta sebagai Sultan Muzaffar Shah.',
  f:'Pemerintahan yang singkat ini menunjukkan betapa tegangnya politik istana Melaka sebelum zaman kegemilangannya. Tarikh tepat berbeza antara sumber.'},
 {era:'1565–1659 (anggaran) · Johor & Aceh',tag:'Tokoh sejarah',
  s:'Bendahara Johor yang diberi tugas menyunting Sulalatus Salatin (Sejarah Melayu) pada tahun 1612 atas titah Sultan Alauddin Riayat Shah III. Selepas Johor ditewaskan Aceh, beliau dibawa ke Aceh dan menetap di sana sehingga akhir hayat.',
  f:'Tanpa karya beliau, kita mungkin tidak mengenali banyak kisah Melaka seperti Hang Tuah dan Hang Li Po. Beliau dianggap salah seorang pujangga terbesar Alam Melayu.'},
 {era:'Abad ke-18 · Johor–Riau–Lingga',tag:'Jawatan sejarah',
  s:'Yang Dipertuan Muda ialah jawatan tertinggi di bawah Sultan dalam Kesultanan Johor–Riau selepas 1722, disandang oleh kerabat Bugis. Pemegangnya menjalankan pentadbiran dan mengetuai angkatan, manakala Sultan mengekalkan taraf diraja. Watak ini mewakili penasihat diraja yang bijaksana.',
  f:'Raja Haji Fisabilillah (Yamtuan Muda IV) gugur menentang Belanda di Teluk Ketapang, Melaka pada 1784 dan diiktiraf Pahlawan Nasional Indonesia.'},
 {era:'Abad ke-17 · Kelantan',tag:'Tokoh legenda',
  s:'Raja perempuan Kelantan dalam tradisi lisan, anak angkat kepada Cik Siti Wan Kembang. Dikisahkan baginda memerintah dengan adil, tetapi diganggu oleh tuntutan Raja Siam. Kisah baginda penuh pengorbanan, kesetiaan dan keberanian, dan terdapat beberapa versi tentang bagaimana ia berakhir.',
  f:'Kisah baginda terus hidup dalam tradisi lisan Kelantan dan diadaptasi dalam pelbagai cerita dan pementasan. Kerana berasal dari tradisi lisan, butirannya berbeza antara satu versi dengan yang lain.'},
 {era:'Awal abad ke-16 · Melaka',tag:'Tokoh sejarah',
  s:'Puteri Bendahara Seri Maharaja Tun Mutahir. Menurut Sejarah Melayu, keluarganya dihukum bunuh pada tahun 1510 atas fitnah, sebelum Tun Fatimah dinikahi Sultan Mahmud Shah dan menjadi permaisuri. Beliau dikenang sebagai wanita yang cekal menghadapi tragedi di istana Melaka.',
  f:'Peristiwa kejatuhan keluarga Bendahara itu berlaku setahun selepas Portugis pertama kali tiba di Melaka (1509) dan setahun sebelum Melaka ditawan (1511). Butiran peribadi beliau bergantung pada catatan Sejarah Melayu.'},
 {era:'Abad ke-17 · Kelantan',tag:'Tokoh legenda',
  s:'Ratu legenda Kelantan yang dikaitkan dengan Kelantan dan dikenali dengan lambang kijang. Tradisi lisan menggambarkan baginda sebagai pemerintah yang bijak, tegas dan dihormati, dan dikatakan menjadi ibu angkat kepada Puteri Saadong.',
  f:'Kijang juga dikaitkan dengan syiling emas Kelantan. Butiran hidup baginda berbeza mengikut cerita, dan tarikh pemerintahannya tidak dapat dipastikan.'},
 {era:'Abad ke-15 · Gunung Ledang',tag:'Tokoh legenda',
  s:'Menurut Sejarah Melayu, Sultan Mahmud Shah dari Melaka cuba meminang puteri penghuni Gunung Ledang. Puteri itu mengenakan syarat yang mustahil, antaranya jambatan emas dan perak dari Melaka ke gunung, hati nyamuk dan hati tungau dalam dulang, serta semangkuk darah putera baginda. Pinangan itu akhirnya tidak diteruskan.',
  f:'Kisah ini sering ditafsirkan sebagai penolakan halus yang bijaksana. Puteri Gunung Ledang ialah tokoh legenda, dan butiran syaratnya berbeza antara naskhah.'},
 {era:'Tradisi lisan Sarawak',tag:'Tokoh legenda',
  s:'Dalam legenda Sarawak, Puteri Santubong dan Puteri Sejinjang ialah dua puteri kayangan yang menjaga bumi. Mereka berselisih lalu bertikam: Santubong memukul dengan antan dan Sejinjang dengan belidak. Kedua-duanya akhirnya berubah menjadi gunung berhampiran Kuching.',
  f:'Gunung Santubong dan Gunung Sejinjang masih wujud berhampiran Kuching. Ceritanya ialah legenda rakyat, dan terdapat beberapa versi tentang punca perselisihan mereka.'},
 {era:'Akhir abad ke-16 · Kesultanan Aceh',tag:'Tokoh sejarah',
  s:'Keumalahayati atau Malahayati ialah laksamana Aceh pada zaman Sultan Alauddin Riayat Syah IV. Beliau mengetuai armada Inong Balee, pasukan balu pahlawan, dan dicatat menewaskan Cornelis de Houtman dalam pertempuran di atas kapal pada tahun 1599.',
  f:'Beliau sering disebut sebagai antara laksamana wanita pertama di dunia moden, dan telah diiktiraf sebagai Pahlawan Nasional Indonesia.'},
 {era:'Tradisi Langkawi',tag:'Tokoh legenda',
  s:'Wanita muda dari Langkawi yang, dalam lagenda, dituduh berzina dan dihukum bunuh dengan keris, lalu mengalir darah putih sebagai tanda kesuciannya. Menurut cerita, beliau menyumpah Langkawi tidak akan makmur selama tujuh keturunan.',
  f:'Makam Mahsuri di Langkawi menjadi tempat lawatan yang terkenal. Ceritanya ialah lagenda tempatan, dan tarikh serta butiran kisahnya berbeza antara versi.'},
 {era:'Abad ke-15 · Pahang & Melaka',tag:'Tokoh legenda',
  s:'Menurut Hikayat Hang Tuah, Tun Teja ialah puteri Bendahara Pahang yang dikahwinkan dengan Sultan Melaka melalui bantuan Hang Tuah. Kisahnya sering dibincangkan sebagai pertembungan antara kehendak hati dan kuasa istana.',
  f:'Kisah ini terdapat dalam Hikayat Hang Tuah dan tidak semestinya mencerminkan peristiwa sebenar. Pembaca moden sering mempersoalkan bagaimana perasaan Tun Teja sendiri dalam kisah itu.'}
];
const TL=[['c.1400','Parameswara mengasaskan Melaka'],['c.1411','Lawatan ke China, hubungan dengan Ming'],['1446','Sultan Muzaffar Shah naik takhta'],['1459','Sultan Mansur Shah · zaman Hang Tuah'],['1510','Keluarga Bendahara Tun Mutahir dihukum bunuh'],['1511','Portugis menawan Melaka'],['1599','Malahayati menewaskan de Houtman'],['1612','Tun Sri Lanang menyunting Sejarah Melayu']];
const Hist={
  html(){
    return`<div class="panel hist"><h2>Sejarah &amp; Legenda</h2>
    <p class="hnote">Ringkasan ini berdasarkan Sejarah Melayu dan Hikayat Hang Tuah, yang mencampurkan sejarah dengan legenda. Setiap tokoh ditanda sama ada tokoh sejarah atau legenda. Ini bukan rujukan akademik.</p>
    <div class="tl">${TL.map(([y,t])=>`<div><b>${y}</b><span>${esc(t)}</span></div>`).join('')}</div>
    ${HEROES.slice(0,NBASE).map((a,j)=>{const h=HIST[j];return`<details class="hh" id="hh${j}"><summary><img src="${IMGS[j]}" alt=""><span><b>${esc(a.n)}</b><small>${esc(a.t)}</small><em class="${h.tag==='Tokoh sejarah'?'real':'myth'}">${esc(h.tag)}</em></span></summary><div class="hb"><p class="era">${esc(h.era)}</p><p>${esc(h.s)}</p><p class="fact">📜 ${esc(h.f)}</p><p class="qt2">“${esc(a.l)}”</p></div></details>`}).join('')}
    <div class="center"><button class="btn" data-h="close">Tutup</button></div></div>`},
  open(j){
    if(!HIST[j])j=-1;const o=document.getElementById('hist');o.innerHTML=this.html();o.hidden=false;o.scrollTop=0;
    if(j>=0){const d=document.getElementById('hh'+j);if(d){d.open=true;setTimeout(()=>d.scrollIntoView({block:'center'}),30)}}
  },
  close(){document.getElementById('hist').hidden=true}
};
