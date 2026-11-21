/* ===== CERITA: narasi berbabak bagi setiap perhentian =====
   Disatukan ke dalam HIKAYAT oleh gabungCerita() di bawah.

   Setiap perhentian: g = kunci TEMPAT (peta), w = kunci WATAK (avatar lawan; tiada jika lawan
   ialah pahlawan berpotret), a = babak (2–3 perenggan), b = penutup selepas menang.
   Perjalanan: i2 = perenggan pembukaan tambahan.

   PERATURAN DRAMATISASI (dipaparkan kepada pemain pada setiap adegan):
   - Narasi boleh menambah suasana (angin, cahaya, perasaan), tetapi TIDAK menambah fakta:
     nama, tarikh, angka dan peristiwa hanya datang daripada data.js yang bersumber.
   - Tiada dialog rekaan di mulut tokoh sebenar. Narator sahaja.
   - Perlawanan congkak ialah cara permainan ini menceritakan setiap pertemuan, bukan peristiwa sejarah. */

const CERITA = {
 parameswara: {
  i2: 'Anda akan berjalan dari pulau ke pulau, dari takhta yang dirampas ke pelabuhan yang baru dibuka, hingga ke balairung Maharaja di negeri yang jauh.',
  st: [
   { g: 'temasik', w: 'temagi',
     a: ['Layar kapal dari Palembang turun di hadapan sebuah pulau kecil di hujung semenanjung. Putera yang terbuang itu tidak membawa banyak, selain nama keturunannya dan segelintir pengikut yang setia.',
         'Temasik ialah pelabuhan yang sibuk. Pemerintahnya menerima tetamu dari seberang, tetapi tidak lama kemudian takhta pulau itu bertukar tangan.',
         'Siapakah pemerintah yang digulingkan? Dua penulis Portugis memberinya dua nama. Di atas papan congkak, putera muda berhadapan dengan raja pulau itu.'],
     b: 'Takhta Temasik kini milik orang baharu. Tetapi pulau yang direbut dengan cara begitu jarang lama aman.' },
   { g: 'temasik', w: 'rajuna',
     a: ['Bertahun-tahun berlalu. Kapal-kapal asing mula muncul di kaki langit, dan kota menutup pintunya.',
         'Kota yang kuat jarang jatuh dari luar sahaja. Malam itu, dalam istana sendiri, ada seseorang yang memegang kunci pintu.',
         'Sumber berbeza tentang siapa yang datang menyerang. Yang diingati oleh Sulalatus Salatin ialah nama pembesar yang membuka pintu itu.'],
     b: 'Temasik jatuh. Sekali lagi, putera itu menjadi pelarian, kali ini ke utara menyusur pantai.' },
   { g: 'bertam', w: 'pemburu',
     a: ['Rombongan kecil itu berhenti di muara sebatang sungai. Hutan pantai rimbun, dan anjing-anjing pemburu berlari mendahului tuannya.',
         'Baginda berehat di bawah sepohon pokok. Ketika itulah, menurut Sulalatus Salatin, seekor pelanduk kecil menendang anjing pemburu hingga terjatuh ke dalam sungai.',
         'Yang kecil mengalahkan yang besar. Sementara orang-orangnya berbual tentang alamat itu, pemburu baginda mengajak bermain sementara menunggu petang.'],
     b: 'Tempat itu dinamakan Melaka. Kampung nelayan itu akan menjadi pelabuhan yang dikenali dari India hingga China.' },
   { g: 'china', w: 'yinqing',
     a: ['Melaka sudah tumbuh. Kapal dagang singgah, dan utusan dari istana Ming pernah datang membawa pengiktirafan.',
         'Kini giliran Raja Melaka pula belayar jauh ke utara. Bersama isteri, anak dan lebih 540 orang pengiring, baginda tiba menghadap Maharaja Yongle.',
         'Di serambi istana yang asing, baginda bertemu semula dengan wajah yang dikenali: Yin Qing, utusan yang pernah datang ke Melaka.'],
     b: 'Hari kedatangan itu dicatat oleh jurutulis Ming hingga ke tarikhnya. Jarang sekali kisah seorang raja Melayu tercatat setepat itu.' }
  ]
 },

 abusyahid: {
  i2: 'Perjalanan ini pendek, kerana pemerintahannya pendek. Ia berlaku hampir seluruhnya di dalam istana, di antara orang-orang yang dekat dengan takhta.',
  st: [
   { g: 'melaka', w: null,
     a: ['Nobat dipalu di balairung Melaka. Sultan Muhammad Syah telah mangkat, dan seorang putera muda dinaikkan ke takhta.',
         'Raja Ibrahim menjadi sultan keempat Melaka. Di antara pembesar yang menghadap, berdiri abang seayahnya, Raja Kasim.',
         'Dua saudara, satu takhta. Malam itu mereka duduk berhadapan di atas papan congkak.'],
     b: 'Raja Kasim beredar dari balairung. Sejarah belum selesai dengan namanya.' },
   { g: 'melaka', w: 'tunali_b',
     a: ['Gelaran seorang raja diucapkan di hadapan seluruh balairung. Bagi baginda, gelaran itu ialah Raja Sri Parameswara Dewa Syah.',
         'Ada ahli sejarah yang membaca gelaran itu sebagai tanda bahawa pegangan lama masih kuat di istana yang sudah memeluk Islam. Ada yang tidak bersetuju.',
         'Bendahara Seri Nara Diraja Tun Ali memerhati dari tempatnya. Seorang Bendahara mendengar lebih banyak daripada yang diucapkan.'],
     b: 'Gelaran itu kekal dalam catatan, dan perdebatan tentang maknanya kekal hingga hari ini.' },
   { g: 'melaka', w: 'penasihat',
     a: ['Malam di serambi istana. Pelita minyak bergoyang ditiup angin dari selat.',
         'Sultan yang masih muda bermain congkak dengan seorang penasihat tua. Di antara satu taburan dengan taburan yang lain, mereka berbual tentang siapa yang benar-benar memegang urusan negeri.',
         'Penasihat ini tidak wujud dalam sumber. Dia dicipta untuk menceritakan satu perkara yang memang dicatat: urusan negeri ketika itu dipegang orang lain.'],
     b: 'Papan dikemas. Di luar serambi, istana tidur, tetapi tidak semua orang di dalamnya tidur.' },
   { g: 'melaka', w: 'perpatih',
     a: ['Tujuh belas bulan selepas nobat pertama, istana Melaka sunyi dengan cara yang lain.',
         'Baginda dibunuh dalam satu pakatan. Nama beberapa pembesar dikaitkan dengannya, dan sumber tidak sepakat siapa dalangnya.',
         'Perlawanan terakhir ini ialah pertemuan dengan salah seorang nama yang disebut: Tun Perpatih Sedang.'],
     b: 'Selepas kemangkatannya, baginda digelar Abu Syahid. Takhta berpindah kepada Raja Kasim.' }
  ]
 },

 muzaffar: {
  i2: 'Ini kisah sebuah negeri yang belajar mempertahankan dirinya: di balairung, dengan memilih orang yang bijak, dan di laut, dengan menghalau angkatan yang datang menyerang.',
  st: [
   { g: 'melaka', w: 'tunali_b',
     a: ['Istana masih berkabung ketika Raja Kasim dinaikkan ke takhta. Baginda memakai nama Sultan Muzaffar Syah.',
         'Takhta yang diperoleh selepas pertumpahan darah memerlukan sokongan orang-orang lama. Yang paling berpengaruh ialah Bendahara Tun Ali.',
         'Sultan baharu dan Bendahara lama duduk berhadapan. Masing-masing menimbang yang lain.'],
     b: 'Pemerintahan baharu bermula. Mata baginda mula mencari orang yang boleh dipercayai.' },
   { g: 'kelang', w: 'tunperak',
     a: ['Dari Kelang, khabar sampai ke Melaka tentang seorang pembesar yang bijak menyelesaikan urusan.',
         'Namanya Tun Perak. Dia belum terkenal di istana, tetapi kebijaksanaannya mula menarik perhatian.',
         'Cara terbaik menilai seseorang ialah melihatnya berfikir. Di atas papan congkak, setiap langkah ialah satu keputusan.'],
     b: 'Tun Perak dibawa lebih dekat ke istana. Tidak lama lagi, Melaka akan memerlukan kebijaksanaannya di medan yang lebih besar.' },
   { g: 'batupahat', w: 'panglimasiam',
     a: ['Layar-layar Siam kelihatan di selatan. Angkatan laut di bawah Raja Trailok datang menyerang.',
         'Di perairan Batu Pahat, Tun Perak dan Tun Hamzah memimpin pertahanan. Angkatan Siam dipukul berundur ke arah Singapura.',
         'Lawan anda ialah seorang panglima di geladak kapal Siam. Namanya tidak tercatat dalam sumber kami, jadi dia ialah watak rekaan. Peperangannya sendiri sejarah.'],
     b: 'Kemenangan di laut menguatkan nama Melaka. Di balairung, ia juga menguatkan nama Tun Perak.' },
   { g: 'melaka', w: 'tunali_b',
     a: ['Dua orang besar dalam satu istana jarang dapat duduk dengan tenang. Ketegangan antara Tun Perak dan Tun Ali terasa hingga ke pinggir balairung.',
         'Ketegangan itu akhirnya reda apabila Tun Perak dilantik menjadi Bendahara, bergelar Paduka Raja.',
         'Satu perlawanan terakhir dengan Tun Ali, ketika kuasa berpindah dari satu tangan ke tangan yang lain.'],
     b: 'Di bawah Bendahara baharu, Melaka memasuki zamannya yang paling kuat.' }
  ]
 },

 hangli: {
  i2: 'Anda akan mengikuti kisah ini seperti yang diceritakan oleh Sulalatus Salatin. Di perhentian terakhir, anda akan duduk di meja seorang sejarawan dan membandingkannya dengan catatan lain.',
  st: [
   { g: 'china', w: 'utusan',
     a: ['Seorang utusan dari Melaka tiba di istana China, jauh dari laut yang dikenalinya.',
         'Menurut Sulalatus Salatin, seorang puteri dipilih untuk dikahwinkan dengan Sultan Mansur Syah dari Melaka.',
         'Utusan itu menunggu jawapan istana. Dia ialah watak rekaan; namanya tidak kami sahkan dalam sumber.'],
     b: 'Persiapan pelayaran bermula. Seorang puteri akan meninggalkan tanah kelahirannya.' },
   { g: 'lautcina', w: 'pengiring',
     a: ['Angkatan belayar ke selatan. Hari berganti hari, dan pantai yang dikenali hilang di belakang.',
         'Puteri tidak belayar seorang diri. Menurut Sulalatus Salatin, kira-kira 500 orang pengiring mengikutinya.',
         'Untuk menghabiskan hari-hari panjang di laut, ketua pengiring membentangkan papan congkak di geladak.'],
     b: 'Di kaki langit, pelabuhan Melaka mula kelihatan.' },
   { g: 'melaka', w: 'mansur',
     a: ['Melaka menyambut rombongan dari China. Para pengiring memerlukan tempat untuk tinggal.',
         'Sultan mengurniakan sebuah bukit kepada mereka. Bukit itu kini dikenali sebagai Bukit Cina.',
         'Kisah kurniaan itu lagenda, tetapi bukitnya nyata dan boleh didaki hari ini. Di balairung, puteri bertemu Sultan Mansur Syah.'],
     b: 'Kisah dalam Sulalatus Salatin berakhir di sini. Tetapi bagaimana pula catatan yang lain?' },
   { g: 'melaka', w: 'pires',
     a: ['Seorang sejarawan membuka dua catatan di atas meja.',
         'Catatan pertama daripada istana Ming. Ia mencatat banyak lawatan Melaka, tetapi tidak menyebut Hang Li Po.',
         'Catatan kedua ialah Suma Oriental karya Tomé Pires. Ia menyebut seorang gadis China tanpa nama yang berkahwin dengan Megat Iskandar Syah, kira-kira 30 tahun lebih awal. Pires sendiri menjadi lawan anda.'],
     b: 'Tiga sumber, tiga cerita. Kad di bawah menerangkan mengapa ahli sejarah masih berbahas.' }
  ]
 },

 tuah: {
  i2: 'Perjalanan ini mengikut susunan Hikayat Hang Tuah, sebuah karya sastera. Setiap perhentian berlabel lagenda kerana kisahnya datang daripada hikayat, bukan catatan sezaman.',
  st: [
   { g: 'gunung', w: 'adiputera',
     a: ['Lima budak meninggalkan kampung mereka dan mendaki ke sebuah gunung: Tuah, Jebat, Kasturi, Lekir dan Lekiu.',
         'Di puncak, seorang guru bernama Adi Putera menunggu. Hari-hari mereka diisi dengan latihan silat dan pelajaran tentang kesabaran.',
         'Sebelum turun gunung, guru menguji murid-muridnya sekali lagi.'],
     b: 'Lima sahabat turun gunung. Melaka menunggu di kaki bukit.' },
   { g: 'melaka', w: 'pengamuk',
     a: ['Pasar Melaka riuh dengan pedagang dari pelbagai negeri. Tiba-tiba orang ramai berlari bertempiaran.',
         'Seorang pengamuk mengganas di tengah pasar. Lima sahabat melangkah ke hadapan ketika orang lain berundur.',
         'Menurut hikayat, peristiwa ini membawa Tun Perak mempersembahkan Hang Tuah kepada Sultan.'],
     b: 'Hang Tuah masuk ke istana. Dari sini kisahnya menjadi kisah Melaka.' },
   { g: 'majapahit', w: 'tamingsari',
     a: ['Angkatan Melaka belayar ke Jawa. Majapahit ialah kerajaan besar, dan istananya penuh dengan pendekar.',
         'Seorang daripada mereka bernama Taming Sari. Menurut hikayat, dia memegang sebilah keris yang masyhur.',
         'Di gelanggang istana Majapahit, Hang Tuah berdepan dengannya.'],
     b: 'Keris itu berpindah tangan. Keris Taming Sari menjadi sebahagian daripada kisah Hang Tuah, walaupun asal-usulnya kekal dipertikai.' },
   { g: 'gledang', h: 13,
     a: ['Sultan mahu meminang seorang puteri yang tinggal di puncak Gunung Ledang.',
         'Utusan mendaki melalui kabus dan hutan. Di puncak, puteri menerima mereka.',
         'Menurut Sulalatus Salatin, puteri menetapkan tujuh syarat yang mustahil dipenuhi. Sebelum syarat itu dibacakan, puteri menguji tetamunya di atas papan congkak.'],
     b: 'Peminangan tidak menjadi. Puteri kekal di gunungnya, dan kisahnya kekal dalam lagenda.' }
  ]
 },

 jebat: {
  i2: 'Ini kisah kesetiaan yang retak. Anda bermain sebagai Jebat, dari hari-hari berguru hingga ke pertarungan dengan sahabatnya sendiri.',
  st: [
   { g: 'gunung', w: 'lekir',
     a: ['Lima sahabat membesar bersama. Mereka berkongsi nasi, latihan dan mimpi tentang Melaka.',
         'Jebat paling berani dan paling cepat marah. Lekir sering menjadi orang yang menenangkannya.',
         'Satu petang selepas latihan, dua sahabat bermain congkak.'],
     b: 'Persahabatan mereka kelihatan tidak akan putus.' },
   { g: 'melaka', w: 'pemfitnah',
     a: ['Di istana, khabar angin bergerak lebih laju daripada kapal.',
         'Hang Tuah difitnah di hadapan Sultan dan dijatuhi hukuman bunuh. Jebat menyangka sahabatnya sudah mati.',
         'Siapa yang menabur fitnah itu? Nama pemfitnah belum kami sahkan, jadi lawan ini ialah watak rekaan. Fitnah itu sendiri ada dalam hikayat.'],
     b: 'Kesedihan Jebat bertukar menjadi kemarahan.' },
   { g: 'melaka', w: 'hulubalang',
     a: ['Jebat masuk ke istana dan tidak keluar.',
         'Dia menguasai istana untuk membela sahabat yang disangkanya mati. Hulubalang demi hulubalang cuba menghalaunya.',
         'Seorang hulubalang istana berdiri di pintu, di antara Jebat dan seluruh Melaka.'],
     b: 'Tiada siapa di Melaka mampu menewaskan Jebat. Kecuali seorang.' },
   { g: 'melaka', h: 0,
     a: ['Hang Tuah, yang disangka sudah mati, dipanggil kembali.',
         'Dua sahabat yang pernah berguru bersama kini berdiri di dalam istana yang sama, di pihak yang berbeza.',
         'Hikayat menyebut pertarungan itu berlangsung tujuh hari. Inilah perlawanan terakhir Jebat.'],
     b: 'Jebat tewas di tangan Tuah. Kad epilog menerangkan dua cara membaca kisah ini.' }
  ]
 },

 lekiu: {
  i2: 'Lekiu jarang muncul seorang diri dalam hikayat. Perjalanan ini jujur tentang perkara itu: tiga perhentian daripada hikayat, dan satu adegan rekaan yang dinyatakan.',
  st: [
   { g: 'gunung', w: 'kasturi',
     a: ['Di antara lima sahabat, Lekiu yang paling pendiam.',
         'Dia membesar bersama Tuah, Jebat, Kasturi dan Lekir, selalu berada di belakang, selalu bersedia.',
         'Kasturi mengajaknya bermain. Yang pendiam selalunya pemerhati yang baik.'],
     b: 'Hari-hari di kampung hampir berakhir.' },
   { g: 'gunung', w: 'adiputera',
     a: ['Lima sahabat mendaki gunung untuk berguru dengan Adi Putera.',
         'Latihan bermula sebelum subuh dan berakhir selepas maghrib.',
         'Guru memerhatikan setiap murid. Kali ini, giliran Lekiu diuji.'],
     b: 'Lekiu turun gunung bersama sahabat-sahabatnya.' },
   { g: 'melaka', w: 'pengamuk',
     a: ['Pasar Melaka kacau-bilau. Seorang pengamuk mengganas.',
         'Lima sahabat bergerak bersama. Lekiu menghalang laluan ketika yang lain menghampiri dari sisi.',
         'Peristiwa inilah yang membawa mereka ke istana.'],
     b: 'Lima sahabat kini berkhidmat di istana Melaka.' },
   { g: 'melaka', w: 'nakhodapel',
     a: ['Ketika Tuah belayar ke Majapahit, Lekiu berkawal di pelabuhan Melaka.',
         'Angin belum berubah, dan kapal-kapal menunggu di labuhan. Seorang nakhoda tua mengajaknya bermain congkak.',
         'Seluruh adegan ini rekaan. Peranan Lekiu sendiri dalam lawatan ke Majapahit belum kami sahkan, jadi kami tidak meletakkannya di sana.'],
     b: 'Kapal Tuah kembali ke pelabuhan. Lekiu sudah menunggu, seperti biasa.' }
  ]
 },

 teja: {
  i2: 'Ini kisah yang diceritakan dengan berbeza oleh kitab yang berbeza. Anda mengikut Hikayat Hang Tuah; epilog menunjukkan mengapa perbezaan itu penting.',
  st: [
   { g: 'pahang', w: 'inang',
     a: ['Di Pahang, puteri Bendahara Seri Amar Diraja membesar dalam rumah yang besar dan tenang.',
         'Namanya Tun Teja. Kecantikannya disebut-sebut hingga ke negeri lain.',
         'Petang itu dia bermain congkak di anjung bersama inangnya. Inang ini watak rekaan; namanya tidak kami sahkan.'],
     b: 'Tidak lama lagi, seorang tetamu dari Melaka akan tiba di Pahang.' },
   { g: 'pahang', h: 0,
     a: ['Hang Tuah tiba di Pahang dengan satu tugas.',
         'Dalam Hikayat Hang Tuah, dia memujuk Tun Teja supaya lari bersamanya. Tun Teja menyangka Tuah mahukan dirinya.',
         'Sebelum keputusan dibuat, mereka duduk berhadapan, masing-masing menyimpan rahsia sendiri.'],
     b: 'Pada malam yang gelap, Tun Teja meninggalkan Pahang.' },
   { g: 'lautpahang', w: 'nakhodakapal',
     a: ['Kapal belayar ke selatan menyusur pantai.',
         'Di tengah laut, Tuah mendedahkan bahawa Tun Teja dibawa bukan untuk dirinya, tetapi untuk Sultan.',
         'Untuk menenangkan hati, Tun Teja bermain congkak dengan nakhoda kapal. Nakhoda dan permainan ini ditambah untuk permainan kita.'],
     b: 'Pantai Melaka kelihatan. Tiada jalan untuk berpatah balik.' },
   { g: 'melaka', w: 'mahmud',
     a: ['Tun Teja tiba di istana Melaka dan menjadi isteri Sultan Mahmud Syah.',
         'Bahagian ini tidak lagi lagenda semata-mata: perkahwinannya tercatat.',
         'Kisah anaknya kemudian berakhir dengan duka. Sebelum itu, satu perlawanan dengan Sultan.'],
     b: 'Tun Teja kini sebahagian daripada istana yang kemudiannya akan jatuh pada 1511.' }
  ]
 },

 nadim: {
  i2: 'Dua tokoh berkongsi satu nama. Prolog menceritakan budak dalam kisah todak; empat perhentian seterusnya mengikut laksamana yang benar-benar tercatat.',
  pr: { g: 'temasik', w: 'todak',
     a: ['Ombak memukul pantai Temasik. Dari laut, ikan todak melompat dan menikam orang di pantai.',
         'Rakyat tidak berdaya menghalangnya. Kemudian seorang budak mencadangkan kubu daripada batang pisang.',
         'Kini anda berdepan dengan todak itu sendiri.'],
     b: 'Todak tersangkut pada batang pisang. Tetapi raja yang cemburu dengan kebijaksanaan budak itu menyuruh dia dibunuh. Sumber tidak pernah menamakannya.' },
  st: [
   { g: 'melaka', w: 'pengawal',
     a: ['Tahun 1511. Kapal-kapal Portugis berlabuh di hadapan Melaka.',
         'Kota itu jatuh, dan Sultan Mahmud Syah berundur. Dalam kalangan orang yang berundur bersamanya, ada seorang bernama Hang Nadim.',
         'Di pintu kota yang sedang runtuh, seorang pengawal menunggu arahan terakhir.'],
     b: 'Melaka kini dikuasai Portugis. Perjuangan untuk merampasnya kembali baru bermula.' },
   { g: 'bintan', w: 'pembesarlaut',
     a: ['Di tempat Sultan berundur, angkatan laut perlu dipimpin semula.',
         'Selepas Khoja Hassan meninggal, Hang Nadim dilantik menjadi laksamana angkatan Sultan Mahmud.',
         'Seorang pembesar angkatan laut menguji laksamana baharunya.'],
     b: 'Laksamana Hang Nadim mula menyusun serangan.' },
   { g: 'melaka', w: 'kapten',
     a: ['Tahun 1516. Angkatan Hang Nadim muncul di hadapan Melaka.',
         'Kubu Portugis tinggi dan meriamnya banyak. Serangan itu tidak berjaya merampas kota.',
         'Di seberang tembok, seorang kapten kubu Portugis menunggu.'],
     b: 'Hang Nadim berundur, tetapi tidak berhenti.' },
   { g: 'melaka', w: 'goa',
     a: ['Tahun 1524. Kali ini Hang Nadim tidak menyerang tembok. Dia mengepung kota.',
         'Bekalan makanan ke Melaka diputuskan. Kota yang bergantung pada laut mula kelaparan.',
         'Kemudian layar-layar bantuan dari Goa muncul. Ketua angkatan bantuan itu ialah lawan terakhir anda.'],
     b: 'Kepungan dipecahkan. Tetapi serangan berulang Hang Nadim telah melemahkan perdagangan Portugis di Melaka.' }
  ]
 },

 fatimah: {
  i2: 'Perjalanan ini melintasi peristiwa paling besar dalam sejarah Melaka. Tun Fatimah kehilangan keluarganya, kemudian kehilangan negerinya, tetapi anaknya akan memerintah sebuah kerajaan baharu.',
  st: [
   { g: 'melaka', w: 'tunali_f',
     a: ['Rumah Bendahara Tun Mutahir ialah antara yang paling berpengaruh di Melaka.',
         'Puterinya, Tun Fatimah, berkahwin dengan sepupunya Tun Ali.',
         'Hari-hari itu tenang. Suami dan isteri bermain congkak di serambi.'],
     b: 'Ketenangan itu tidak akan kekal lama.' },
   { g: 'melaka', w: 'mudaliar',
     a: ['Bisikan bermula di istana: Bendahara Tun Mutahir mahu merampas takhta.',
         'Fitnah itu ditabur oleh Raja Mudaliar. Lelaki dalam keluarga Bendahara dihukum bunuh.',
         'Tun Fatimah berdepan dengan orang yang memulakan segalanya.'],
     b: 'Rumah Bendahara yang dahulu megah kini sunyi.' },
   { g: 'melaka', w: 'mahmud',
     a: ['Sultan Mahmud Syah mahu memperisterikan Tun Fatimah.',
         'Dia mula menolak, tetapi akhirnya menjadi isteri kelima baginda.',
         'Pada tahun yang sama, 1511, kapal Portugis tiba dan Melaka jatuh.'],
     b: 'Istana berundur. Tun Fatimah ikut bersama.' },
   { g: 'kampar', w: 'rajaali',
     a: ['Jauh dari Melaka, di Kampar, istana yang berpindah menyusun semula dirinya.',
         'Putera Tun Fatimah, Raja Ali, dijanjikan takhta.',
         'Ibu dan anak bermain congkak, ketika masa depan sebuah kerajaan bergantung pada budak itu.'],
     b: 'Raja Ali kemudian menjadi pemerintah Johor kedua, bergelar Sultan Alauddin Riayat Syah.' }
  ]
 },

 lanang: {
  i2: 'Tun Sri Lanang tidak terkenal kerana keris atau kapal, tetapi kerana sebuah buku. Banyak kisah dalam permainan ini sampai kepada kita melalui kitab yang disusunnya.',
  st: [
   { g: 'johor', w: 'pembjohor',
     a: ['Di Seluyut, Johor, seorang anak lahir dalam keturunan Bendahara.',
         'Keturunannya bersambung kepada Tun Tahir, saudara Bendahara Tun Mutahir dari zaman Melaka. Sejarah keluarganya ialah sejarah kerajaan itu sendiri.',
         'Seorang pembesar Johor menguji anak muda yang kelak akan menulis tentang mereka semua.'],
     b: 'Anak muda itu membesar di istana Johor.' },
   { g: 'batusawar', w: 'alauddin3',
     a: ['Di Batu Sawar, Tun Sri Lanang berkhidmat sebagai Bendahara Johor.',
         'Dia berkhidmat di bawah Sultan Ali Jalla Abdul Jalil Syah II, kemudian Sultan Alauddin Riayat Syah III.',
         'Di balairung, Sultan dan Bendaharanya membincangkan urusan negeri di atas papan congkak.'],
     b: 'Sultan mempunyai satu permintaan yang akan mengubah hidup Bendahara.' },
   { g: 'batusawar', w: 'rajaabdullah_j',
     a: ['Tahun 1612. Atas titah Sultan dan permintaan Raja Abdullah, Bendahara mula menyusun sejarah raja-raja Melayu.',
         'Mukadimah kitab itu sendiri menyebut siapa yang meminta ia ditulis.',
         'Raja Abdullah datang melihat kerja itu bermula.'],
     b: 'Kitab itu kita kenali hari ini sebagai Sulalatus Salatin, atau Sejarah Melayu.' },
   { g: 'batusawar', w: 'panglimaaceh',
     a: ['Tahun 1613. Angkatan Aceh menyerang Batu Sawar.',
         'Johor tewas. Bendahara ditawan dan dibawa ke Aceh.',
         'Seorang panglima Aceh berdiri di hadapannya.'],
     b: 'Kapal Aceh membawa Tun Sri Lanang ke utara, ke kehidupan yang tidak disangkanya.' }
  ]
 },

 malahayati: {
  i2: 'Perjalanan ini dibina di sekitar peristiwa yang tercatat. Malahayati sendiri tidak dinamakan dalam catatan zaman itu, jadi setiap perhentian bertanya: apa yang kita tahu, dan apa yang kita andaikan?',
  st: [
   { g: 'aceh', w: 'sultanaceh',
     a: ['Di hujung utara Sumatera, kapal-kapal keluar masuk pelabuhan Aceh.',
         'Seorang wanita dilantik mengetuai angkatan lautnya. Penjelajah Inggeris John Davis mencatat bahawa laksamana Aceh ialah seorang wanita, tetapi tidak menyebut namanya.',
         'Di balairung, wanita itu menghadap Sultan.'],
     b: 'Angkatan laut Aceh kini di bawah pimpinan seorang laksamana wanita.' },
   { g: 'inongbalee', w: 'inongbalee',
     a: ['Di sebuah benteng di pantai, para balu pahlawan yang gugur berkumpul.',
         'Kisah armada Inong Balee masyhur di Aceh. Benteng itu membawa nama mereka.',
         'Seorang panglima armada itu menunggu di pintu benteng. Seperti tokoh utamanya, butiran kisah ini dipertikai.'],
     b: 'Layar-layar asing mula kelihatan di perairan Aceh.' },
   { g: 'aceh', w: 'houtman',
     a: ['Tahun 1599. Ekspedisi Belanda di bawah Cornelis de Houtman tiba di Aceh.',
         'Pertempuran berlaku, dan de Houtman terbunuh. Kematiannya tercatat.',
         'Tetapi tiada sumber sezaman menyebut bahawa dia dibunuh oleh seorang wanita. Anda bermain menentangnya sambil memikirkan soalan itu.'],
     b: 'Belanda belajar bahawa Aceh tidak mudah ditundukkan.' },
   { g: 'aceh', w: 'lancaster',
     a: ['Tahun 1601 hingga 1602. Gencatan senjata dengan utusan Belanda dimeterai.',
         'Kemudian datang James Lancaster dari England, membawa surat Ratu Elizabeth I.',
         'Rundingan berlangsung di istana Aceh. Lawatan Lancaster tercatat; peranan Malahayati di dalamnya tidak.'],
     b: 'Hampir empat abad kemudian, namanya menjadi nama seorang wira nasional. Epilog bertanya bagaimana.' }
  ]
 },

 saadong: {
  i2: 'Tarikh pemerintahan Puteri Saadong bersumber. Kebanyakan kisah peribadinya ialah riwayat yang diceritakan turun-temurun di Kelantan.',
  st: [
   { g: 'bukitmarak', h: 12,
     a: ['Seorang anak perempuan dari Jembal kehilangan ibunya ketika masih kecil.',
         'Menurut riwayat, dia dibesarkan oleh Cik Siti Wan Kembang di Bukit Marak.',
         'Ratu itu mengajarnya tentang negeri, tentang rakyat, dan tentang permainan congkak.'],
     b: 'Saadong membesar menjadi seorang puteri yang disebut-sebut di seluruh Kelantan.' },
   { g: 'jembal', w: 'rajaabdullah_k',
     a: ['Sekitar umur 15, Puteri Saadong berkahwin dengan sepupunya, Raja Abdullah dari Jembal.',
         'Pada 1667, baginda menjadi ratu.',
         'Pemerintahannya tercatat. Hari-hari awal itu, raja dan ratu bermain congkak bersama.'],
     b: 'Tidak lama kemudian, utusan dari Siam tiba.' },
   { g: 'siam', w: 'narai',
     a: ['Kelantan diancam. Menurut riwayat, Puteri Saadong menyerahkan dirinya ke Siam untuk menyelamatkan nyawa suaminya.',
         'Di istana Siam, baginda berdepan dengan Raja Narai.',
         'Raja Narai ialah tokoh sebenar. Kisah bahawa Saadong dibebaskan selepas mengubatinya ialah riwayat.'],
     b: 'Menurut riwayat, baginda dibebaskan dan pulang ke Kelantan.' },
   { g: 'jembal', w: 'isteribaru',
     a: ['Puteri Saadong pulang dengan harapan.',
         'Baginda mendapati Raja Abdullah telah berkahwin lain.',
         'Isteri baharu itu tidak diketahui namanya. Pertengkaran berlaku, dan selepas itu Puteri Saadong hilang daripada catatan.'],
     b: 'Ke mana baginda pergi tidak diketahui. Epilog menceritakan apa yang dipercayai, dan apa yang dicatat.' }
  ]
 },

 siti: {
  i2: 'Seluruh perjalanan ini lagenda. Itulah pelajarannya: sebuah kisah boleh penting bagi sebuah negeri walaupun bukti arkeologinya belum ditemui.',
  st: [
   { g: 'kelantan', w: 'pengasuh',
     a: ['Menurut cerita rakyat, seorang puteri lahir kepada Raja Ahmad dan Cik Banun pada 1585.',
         'Tarikh itu tarikh tradisi, bukan catatan.',
         'Puteri kecil itu membesar di bawah jagaan seorang pengasuh istana.'],
     b: 'Puteri kecil itu kelak menjadi ratu.' },
   { g: 'guamusang', w: 'pembkelantan',
     a: ['Di pedalaman, di Gunung Chinta Wangsa, Gua Musang, ratu muda memerintah.',
         'Tempat itu nyata dan boleh dilawati. Pemerintahan baginda di sana diceritakan dalam lagenda.',
         'Seorang pembesar Kelantan datang menghadap.'],
     b: 'Khabar tentang ratu di gunung sampai ke pedagang di pantai.' },
   { g: 'kelantan', w: 'pedagangarab',
     a: ['Seorang pedagang Arab datang menghadap membawa hadiah.',
         'Hadiahnya ialah seekor kijang. Kijang itu menjadi kesayangan baginda.',
         'Sebelum beredar, pedagang itu menerima pelawaan untuk bermain congkak.'],
     b: 'Dalam cerita rakyat, kijang sentiasa dikaitkan dengan baginda.' },
   { g: 'bukitmarak', h: 10,
     a: ['Di Bukit Marak, seorang anak kecil kehilangan ibunya.',
         'Ratu mengangkatnya sebagai anak. Namanya Saadong.',
         'Menurut riwayat, Saadong kemudian menggantikan baginda.'],
     b: 'Menurut lagenda, Cik Siti Wan Kembang kemudian “ghaib”.' }
  ]
 },

 yamtuan: {
  i2: 'Anda tidak bermain sebagai seorang manusia, tetapi sebagai satu jawatan yang dipegang oleh beberapa orang. Perjalanan bermula dengan Daeng Marewah dan berakhir dengan Raja Haji.',
  st: [
   { g: 'riau', w: 'rajakecil',
     a: ['Tahun 1722. Lima bersaudara Bugis tiba di Riau.',
         'Mereka membantu Sultan Sulaiman menewaskan Raja Kecil.',
         'Sebagai balasan, Daeng Marewah dilantik Yang Dipertuan Muda pertama. Sebelum itu, satu perlawanan dengan Raja Kecil.'],
     b: 'Jawatan Yang Dipertuan Muda kini wujud, dan dipegang oleh orang Bugis.' },
   { g: 'riau', w: 'daengchelak',
     a: ['Tahun 1728, di Pulau Pitung. Daeng Marewah meninggal dunia.',
         'Saudaranya, Daeng Chelak, menjadi Yang Dipertuan Muda kedua.',
         'Jawatan itu berpindah tangan. Daeng Chelak menjadi lawan anda.'],
     b: 'Anak Daeng Chelak, Raja Haji, membesar dalam bayang-bayang jawatan itu.' },
   { g: 'pontianak', w: 'syarif',
     a: ['Tahun 1771. Raja Haji belayar ke Borneo.',
         'Dia membantu menabalkan Syarif Abdurrahman Alkadrie sebagai Sultan Pontianak pertama.',
         'Di tebing sungai yang baru dibuka, sultan baharu dan tetamunya bermain congkak.'],
     b: 'Pada 1777, Raja Haji sendiri menjadi Yang Dipertuan Muda keempat.' },
   { g: 'melaka', w: 'komander',
     a: ['Tahun 1784. Melaka kini dikuasai Belanda.',
         'Raja Haji menyerang kubu Belanda di Teluk Ketapang.',
         'Pada 18 Jun 1784, dia gugur ditembak. Perlawanan terakhir ini menentang komander kubu itu.'],
     b: 'Cucunya, Raja Ali Haji, kemudian mengarang Tuhfat al-Nafis, sumber utama perjalanan ini.' }
  ]
 },

 mahsuri: {
  i2: 'Lagenda ini tumbuh di atas peristiwa sebenar. Di setiap perhentian, cuba asingkan latar yang tercatat daripada cerita yang diceritakan semula.',
  st: [
   { g: 'langkawi', w: 'pandak',
     a: ['Sebuah keluarga belayar dari Phuket ke Langkawi.',
         'Mereka ialah keluarga Pandak Mayah, dan anak perempuannya bernama Mahsuri.',
         'Di kampung baharu mereka, ayah dan anak bermain congkak di bawah rumah.'],
     b: 'Mahsuri membesar menjadi gadis yang disebut-sebut di seluruh pulau.' },
   { g: 'kedah', w: 'wandarus',
     a: ['Tahun 1821. Siam menyerang Kedah.',
         'Suami Mahsuri, Wan Darus, pergi berperang untuk Kedah.',
         'Perangnya sejarah; watak Wan Darus datang daripada lagenda. Malam sebelum dia pergi, mereka bermain congkak buat kali terakhir.'],
     b: 'Mahsuri tinggal di Langkawi tanpa suaminya.' },
   { g: 'langkawi', w: 'wanmahora',
     a: ['Seorang pengembara bernama Deramang tiba di kampung.',
         'Wan Mahora, isteri penghulu, menabur fitnah bahawa Mahsuri bermukah dengan pengembara itu.',
         'Fitnah menjalar dari rumah ke rumah. Mahsuri berdepan dengan orang yang memulakannya.'],
     b: 'Kampung itu percaya kepada fitnah.' },
   { g: 'langkawi', w: 'penghulu',
     a: ['Mahsuri dibawa ke hadapan penghulu kampung.',
         'Hukumannya ialah hukuman bunuh.',
         'Menurut cerita, darahnya putih, dan dia menyumpah Langkawi tujuh keturunan.'],
     b: 'Kisah Mahsuri berakhir di sini. Epilog menceritakan apa yang berlaku kepada Langkawi.' }
  ]
 }
};

/* gabungkan cerita ke dalam HIKAYAT (data.js kekal sumber fakta) */
function gabungCerita() {
  for (const H of HIKAYAT) {
    const C = CERITA[H.id]; if (!C) continue;
    H.i2 = C.i2;
    if (H.pr && C.pr) Object.assign(H.pr, C.pr);
    H.st.forEach((S, i) => { const c = C.st[i]; if (c) { const a0 = S.a; Object.assign(S, c); S.ringkas = a0; if (c.h != null) S.h = c.h } });
  }
}
gabungCerita();
