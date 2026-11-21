/* ===== KISAH PAHLAWAN =====
   Satu kad untuk setiap pahlawan, selari dengan indeks HEROES.

   Setiap kad menyatakan dengan jelas sama ada kisahnya SEJARAH (ada catatan),
   LAGENDA (cerita turun-temurun), atau DIPERTIKAI (sumber tidak sepakat), dan
   dari mana cerita itu datang. Itulah yang menjadikan bahan ini berguna di
   sekolah: bukan sekadar cerita, tetapi latihan menilai dari mana kita tahu
   sesuatu. Jangan tambah kisah tanpa menyatakan sumbernya. */
const JENIS = {
  sejarah:   { l: 'Sejarah',    w: '#8fd44f', d: 'Ada catatan bertulis daripada zamannya atau berhampiran zamannya.' },
  lagenda:   { l: 'Lagenda',    w: '#f2c14e', d: 'Cerita turun-temurun. Indah dan penting, tetapi bukan catatan sejarah.' },
  pertikai:  { l: 'Dipertikai', w: '#f58b6a', d: 'Sumber tidak sepakat. Ahli sejarah masih berbahas.' }
};

const KISAH = [
/* 0  Hang Tuah */ {
  j:'pertikai', z:'Abad ke-15', p:'Kesultanan Melaka',
  k:'Laksamana Melaka yang paling masyhur, terkenal dengan kesetiaan mutlak kepada sultan. Kisahnya sampai kepada kita melalui Hikayat Hang Tuah dan Sejarah Melayu — kedua-duanya karya sastera, bukan catatan harian istana. Ahli sejarah masih berbahas sama ada beliau seorang tokoh sebenar, gabungan beberapa orang, atau watak sastera sepenuhnya.',
  t:'Ayat “Takkan Melayu hilang di dunia” berasal daripada Hikayat Hang Tuah, bukan daripada dokumen rasmi Melaka.',
  s:'Hikayat Hang Tuah · Sulalatus Salatin'
},
/* 1  Hang Jebat */ {
  j:'lagenda', z:'Abad ke-15', p:'Kesultanan Melaka',
  k:'Sahabat Hang Tuah yang menderhaka kepada sultan kerana marah Tuah dijatuhi hukuman bunuh tanpa dibicarakan. Pertarungan antara dua sahabat itu menjadi persoalan yang masih dibahas sampai hari ini: mana lebih benar, taat kepada raja atau menuntut keadilan?',
  t:'Dalam Sejarah Melayu, yang menderhaka bukan Hang Jebat tetapi Hang Kasturi. Dua kitab, dua versi — satu contoh baik mengapa sumber perlu dibandingkan.',
  s:'Hikayat Hang Tuah · Sulalatus Salatin'
},
/* 2  Hang Lekiu */ {
  j:'lagenda', z:'Abad ke-15', p:'Kesultanan Melaka',
  k:'Seorang daripada lima sahabat sepersaudaraan Melaka — Hang Tuah, Hang Jebat, Hang Kasturi, Hang Lekir dan Hang Lekiu. Mereka membesar bersama di Kampung Duyong dan berguru dengan Adiputra di Gunung Ledang.',
  t:'Kelima-lima nama bermula dengan “Hang”, iaitu gelaran hormat pada zaman itu, bukan nama keluarga.',
  s:'Hikayat Hang Tuah'
},
/* 3  Sultan Muzaffar Syah */ {
  j:'sejarah', z:'1446–1459', p:'Kesultanan Melaka',
  k:'Pemerintah Melaka yang menyusun Hukum Kanun Melaka, undang-undang bertulis yang mengatur perdagangan, jenayah dan adat istiadat. Pada zamannya Melaka berjaya menangkis serangan Siam dan mula berkembang menjadi kuasa serantau.',
  t:'Hukum Kanun Melaka menjadi rujukan undang-undang di banyak pelabuhan Nusantara selepas itu — pengaruh Melaka bukan sekadar perdagangan, tetapi juga perundangan.',
  s:'Sulalatus Salatin · Hukum Kanun Melaka'
},
/* 4  Laksamana Hang Nadim */ {
  j:'lagenda', z:'Abad ke-14–15', p:'Temasik / Melaka',
  k:'Dalam Sejarah Melayu, Singapura diserang kawanan todak yang mencucuk penduduk di pantai. Seorang budak bernama Hang Nadim mencadangkan kubu batang pisang supaya todak tersangkut. Cadangan itu berjaya — tetapi kerana kebijaksanaannya ditakuti, dia kemudian dibunuh atas perintah raja.',
  t:'Peribahasa “hilang bahasa” dikaitkan dengan kisah ini: raja yang membunuh akal budi rakyatnya sendiri.',
  s:'Sulalatus Salatin'
},
/* 5  Parameswara */ {
  j:'sejarah', z:'Sekitar 1400', p:'Pengasas Melaka',
  k:'Putera dari Palembang yang melarikan diri ke Temasik, kemudian ke utara, dan membuka Melaka di muara sungai. Kedudukan pelabuhan itu di Selat Melaka menjadikannya persinggahan utama antara China dan India, dan dalam masa satu generasi Melaka menjadi pelabuhan terkaya di rantau ini.',
  t:'Menurut Sejarah Melayu, nama Melaka diambil daripada pokok melaka tempat baginda berehat ketika menyaksikan seekor pelanduk menendang anjing pemburunya.',
  s:'Sulalatus Salatin · catatan Ming'
},
/* 6  Puteri Hang Li Po */ {
  j:'pertikai', z:'Abad ke-15', p:'Melaka / China',
  k:'Sejarah Melayu mencatatkan seorang puteri Maharaja China dikahwinkan dengan Sultan Mansur Syah, datang bersama lima ratus pengiring yang menetap di Bukit China. Namun rekod rasmi Dinasti Ming tidak pernah mencatatkan sebarang puteri dihantar ke Melaka.',
  t:'Perigi Hang Li Po di Melaka masih ada sampai hari ini. Satu kisah boleh meninggalkan kesan sebenar di atas tanah walaupun butirannya dipertikai — soalan yang baik untuk kelas sejarah.',
  s:'Sulalatus Salatin · Ming Shilu'
},
/* 7  Sultan Abu Syahid */ {
  j:'sejarah', z:'1445–1446', p:'Kesultanan Melaka',
  k:'Sultan Melaka yang menaiki takhta ketika masih sangat muda, menyebabkan pemerintahan sebenar dipegang orang lain. Baginda mangkat dalam pergolakan istana selepas kira-kira setahun memerintah — pemerintahan paling singkat dalam sejarah Kesultanan Melaka.',
  t:'Takhta Melaka tidak sentiasa aman. Perebutan kuasa dalaman berlaku beberapa kali, jauh sebelum Portugis tiba pada 1511.',
  s:'Sulalatus Salatin'
},
/* 8  Tun Sri Lanang */ {
  j:'sejarah', z:'1565–1659', p:'Johor, kemudian Aceh',
  k:'Bendahara Johor dan pujangga yang menyusun semula Sulalatus Salatin — kitab yang kita kenali sebagai Sejarah Melayu — pada tahun 1612. Selepas Johor diserang Aceh pada 1613, beliau dibawa ke Aceh dan menetap di sana.',
  t:'Tanpa kerja beliau, kebanyakan kisah dalam permainan ini mungkin tidak sampai kepada kita. Seorang penulis boleh menyelamatkan ingatan sebuah bangsa.',
  s:'Sulalatus Salatin (susunan 1612)'
},
/* 9  Yamtuan Muda */ {
  j:'sejarah', z:'Abad ke-18–19', p:'Riau-Lingga / Negeri Sembilan',
  k:'Yamtuan Muda bukan nama seorang, tetapi gelaran bagi jawatan pemerintah kedua selepas Yang Dipertuan Besar. Di Riau-Lingga jawatan ini banyak dipegang oleh keturunan Bugis, dan pemegangnya sering menguasai hal ehwal laut, pertahanan dan perdagangan.',
  t:'Banyak “nama” dalam sejarah Melayu sebenarnya gelaran jawatan — Bendahara, Temenggung, Laksamana, Yamtuan Muda. Mengenal perbezaan itu mengelakkan salah faham.',
  s:'Tuhfat al-Nafis'
},
/* 10 Puteri Saadong */ {
  j:'sejarah', z:'1667–1671', p:'Kelantan',
  k:'Ratu Kelantan yang memerintah selama kira-kira empat tahun. Menurut riwayat, baginda dibawa ke Siam dan kemudian dibenarkan pulang setelah berjaya mengubati raja Siam yang sakit. Pulang ke Bukit Marak, baginda mendapati suaminya Raja Abdullah telah berkahwin lain; pertengkaran berlaku, dan selepas itu baginda hilang daripada catatan.',
  t:'Makam Raja Abdullah masih ada di Kelantan, tetapi tiada siapa tahu ke mana perginya Puteri Saadong. Sejarah pun ada bahagian yang kosong.',
  s:'Riwayat salasilah Kelantan'
},
/* 11 Tun Fatimah */ {
  j:'sejarah', z:'Abad ke-16', p:'Melaka, kemudian Bintan',
  k:'Anak Bendahara Tun Mutahir. Keluarganya dihukum bunuh atas fitnah, dan baginda kemudian dikahwini Sultan Mahmud Syah. Selepas Melaka jatuh ke tangan Portugis pada 1511, beliau terus bersama baginda dalam perjuangan menentang Portugis dari Bintan dan Kampar.',
  t:'Beliau antara tokoh wanita Melayu terawal yang dicatatkan memberi nasihat pemerintahan secara terbuka kepada sultan.',
  s:'Sulalatus Salatin'
},
/* 12 Cik Siti Wan Kembang */ {
  j:'lagenda', z:'Abad ke-17 (dianggarkan)', p:'Kelantan',
  k:'Ratu Kelantan dalam cerita rakyat, digambarkan memerintah dengan adil dan menunggang kuda bersama pasukan pengawal wanita. Tarikh dan butiran pemerintahannya berbeza-beza antara sumber, dan tiada catatan sezaman yang jelas.',
  t:'Kijang yang dikaitkan dengan baginda menjadi lambang pada jata negeri Kelantan sehingga hari ini.',
  s:'Cerita rakyat Kelantan'
},
/* 13 Puteri Gunung Ledang */ {
  j:'lagenda', z:'Abad ke-15', p:'Gunung Ledang, Johor',
  k:'Sultan Mahmud Syah menghantar utusan meminang puteri yang tinggal di puncak Gunung Ledang. Baginda menetapkan tujuh syarat, antaranya jambatan emas dan jambatan perak dari Melaka ke gunung, dan yang terakhir semangkuk darah putera raja. Pinangan itu terhenti di situ.',
  t:'Syarat terakhir itu bukan sekadar mustahil — ia menguji sejauh mana seorang raja sanggup mengorbankan orang lain untuk kehendak sendiri. Cara menolak yang paling halus dalam kesusasteraan Melayu.',
  s:'Sulalatus Salatin'
},
/* 14 Puteri Santubong */ {
  j:'lagenda', z:'—', p:'Sarawak',
  k:'Dua puteri kayangan, Santubong dan Sejinjang, diturunkan ke bumi untuk mendamaikan dua kampung. Mereka sendiri akhirnya bergaduh; Sejinjang memukul Santubong dengan alat penumbuk padi, dan Santubong membalas dengan belira tenunan. Keduanya disumpah menjadi gunung yang masih berdiri di Sarawak hari ini.',
  t:'Bentuk Gunung Santubong dari jauh sering dikatakan menyerupai seorang wanita sedang berbaring — dari situlah cerita ini hidup.',
  s:'Cerita rakyat Sarawak'
},
/* 15 Laksamana Malahayati */ {
  j:'sejarah', z:'Abad ke-16', p:'Kesultanan Aceh',
  k:'Laksamana angkatan laut Aceh, dan antara wanita terawal di dunia yang memegang jawatan laksamana. Beliau memimpin Inong Balee, armada yang dianggotai balu-balu pahlawan yang gugur dalam perang — mereka berjuang menuntut tempat suami mereka.',
  t:'Beliau diisytiharkan Pahlawan Nasional Indonesia pada November 2017. Catatan tentang kematian Cornelis de Houtman di tangannya pada 1599 tidak disepakati semua sumber.',
  s:'Hikayat Aceh · rekod Belanda'
},
/* 16 Mahsuri */ {
  j:'lagenda', z:'Abad ke-18 (dianggarkan)', p:'Langkawi, Kedah',
  k:'Seorang wanita Langkawi yang dituduh berzina lalu dijatuhi hukuman bunuh. Menurut cerita, darahnya putih sebagai tanda dia tidak bersalah, dan sebelum mati beliau menyumpah Langkawi tidak akan maju selama tujuh keturunan.',
  t:'Sumpah tujuh keturunan itu sering disebut sebagai sudah tamat, dan kemajuan pelancongan Langkawi hari ini dikaitkan dengan tamatnya sumpah tersebut — contoh bagaimana cerita lama boleh mempengaruhi cara orang melihat zaman sekarang.',
  s:'Cerita rakyat Langkawi'
},
/* 17 Tun Teja */ {
  j:'lagenda', z:'Abad ke-15', p:'Pahang, kemudian Melaka',
  k:'Puteri Pahang, anak Bendahara Seri Amar Diraja. Dalam Hikayat Hang Tuah, Hang Tuah diutus ke Pahang dan membawanya ke Melaka untuk Sultan Mahmud Syah — satu episod yang sering dibaca sebagai ujian paling berat terhadap kesetiaan Tuah.',
  t:'Versi Sejarah Melayu dan versi Hikayat Hang Tuah tentang Tun Teja berbeza. Membandingkan kedua-duanya ialah latihan yang baik untuk pelajar.',
  s:'Hikayat Hang Tuah · Sulalatus Salatin'
}
];

const Kisah = {
  ada(i) { return !!KISAH[i] },
  esc(t) { return esc(String(t || '')) },

  kad(i, menang) {
    const h = HEROES[i], k = KISAH[i]; if (!h || !k) return '';
    const j = JENIS[k.j] || JENIS.lagenda;
    return `<div class="panel kisah"><h2>${menang ? 'Anda Menewaskan' : ''} ${this.esc(h.n)}</h2>
      <div class="kimg"><img src="${IMGS[i]}" alt=""></div>
      <p class="ktag" style="--kc:${j.w}"><b>${j.l}</b> · ${this.esc(k.z)} · ${this.esc(k.p)}</p>
      <p class="kdef">${this.esc(j.d)}</p>
      <p class="kstory">${this.esc(k.k)}</p>
      <div class="ktahu"><b>Tahukah anda?</b><p>${this.esc(k.t)}</p></div>
      <p class="ksrc">Sumber cerita: ${this.esc(k.s)}</p>
      <div class="center"><button class="btn" data-k="tutup">${menang ? 'Teruskan Kembara' : 'Tutup'}</button>
        ${menang ? '' : '<button class="btn sm" data-k="galeri">◀ Semua Pahlawan</button>'}</div></div>`;
  },
  galeri() {
    const baris = HEROES.map((h, i) => {
      const k = KISAH[i]; if (!k) return '';
      const j = JENIS[k.j] || JENIS.lagenda;
      return `<button class="kgi" data-k="buka" data-i="${i}">
        <img src="${IMGS[i]}" alt="">
        <span><b>${this.esc(h.n)}</b><small style="--kc:${j.w}">${j.l} · ${this.esc(k.z)}</small></span></button>`;
    }).join('');
    return `<div class="panel kisah"><h2>Kisah Pahlawan</h2>
      <p class="hnote">Lapan belas tokoh Nusantara. Setiap kad menyatakan sama ada kisahnya
        <b>sejarah</b>, <b>lagenda</b>, atau <b>dipertikai</b>, dan dari mana cerita itu datang.</p>
      <div class="kgal">${baris}</div>
      <div class="center"><button class="btn" data-k="tutup">Tutup</button></div></div>`;
  },

  show(html) {
    const o = document.getElementById('kisah'); if (!o) return;
    o.innerHTML = html; o.hidden = false; o.scrollTop = 0;
  },
  /* kad pahlawan memainkan leitmotifnya */
  open(i) { this.show(Number.isInteger(i) ? this.kad(i, false) : this.galeri()); if (Number.isInteger(i) && typeof Mus !== 'undefined' && Mus.motif) Mus.motif(i) },
  menang(i) { if (this.ada(i)) { this.show(this.kad(i, true)); if (typeof Mus !== 'undefined' && Mus.motif) Mus.motif(i) } },
  tutup() { const o = document.getElementById('kisah'); if (o) o.hidden = true },
  click(e) {
    const g = e.target.closest('[data-k]');
    if (!g) { if (e.target.id === 'kisah') this.tutup(); return }
    const k = g.dataset.k;
    if (k === 'tutup') return this.tutup();
    if (k === 'galeri') return this.open();
    if (k === 'buka') return this.open(+g.dataset.i);
  }
};
