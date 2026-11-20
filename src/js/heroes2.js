/* ===== PAHLAWAN BAHARU (seni daripada konsep Melaka pengguna) ===== */
const ART2=JSON.parse(ART2_JSON);
const HER2=[
 {n:'Puteri Saadong',el:'api',t:'Raja Perempuan Kelantan',atk:3,def:4,spd:4,l:'Mahkota ini bukan untuk dijual!',a:'saadong',sk:[SK('Cucuk Sanggul Maut','x','📍','#ffd45a'),SK('Murka Puteri Kelantan','aura','🔥','#ff7a2a',1)]},
 {n:'Tun Fatimah',el:'api',t:'Permaisuri Melaka',atk:4,def:4,spd:3,l:'Maruah keluarga lebih berharga daripada takhta.',a:'fatimah',sk:[SK('Titah Permaisuri','rings','👑','#d8a8ff'),SK('Pedang Bendahara','x','⚔️','#ff6a4a',1)]},
 {n:'Cik Siti Wan Kembang',el:'tanah',t:'Ratu Kijang Emas',atk:3,def:5,spd:2,l:'Kijang emas menjaga negeri ini.',a:'siti',sk:[SK('Tanduk Kijang Emas','multi','🦌','#ffd45a'),SK('Gua Bertuah','rings','✨','#ffe9a0',1)]},
 {n:'Puteri Gunung Ledang',el:'tanah',t:'Puteri Pemanah Gunung',atk:3,def:3,spd:5,l:'Syaratku tidak pernah mudah dipenuhi.',a:'ledang',sk:[SK('Panah Zamrud','rain','🏹','#7affc8'),SK('Hujan Daun Gunung','petals','🍃','#5ae88a',1)]},
 {n:'Puteri Santubong',el:'api',t:'Puteri Legenda Sarawak',atk:4,def:3,spd:4,l:'Gunung ini dijaga oleh kami!',a:'santubong',sk:[SK('Lembing Santubong','multi','🔱','#ff9a5a'),SK('Hentakan Antan','stomp','🌋','#ffb040',1)]},
 {n:'Laksamana Malahayati',el:'air',t:'Laksamana Aceh',atk:5,def:3,spd:4,l:'Pantai ini dijaga pejuang wanita!',a:'malahayati',sk:[SK('Rencong Aceh','multi','🗡️','#ff6a3a'),SK('Armada Inong Balee','wave','⚓','#3a9aff',1)]},
 {n:'Mahsuri',el:'air',t:'Puteri Legenda Langkawi',atk:3,def:2,spd:5,l:'Darahku putih, kebenaran tidak boleh dipadam.',a:'mahsuri',sk:[SK('Darah Putih','aura','🕊️','#e8f4ff'),SK('Sumpah Tujuh Keturunan','stamp','SUMPAH','#b0c8ff',1)]},
 {n:'Tun Teja',el:'air',t:'Puteri Pahang',atk:2,def:3,spd:5,l:'Hati tidak boleh dipaksa!',a:'teja',sk:[SK('Pesona Teja','petals','🌺','#ff7aa8'),SK('Hujan Bunga Raya','rain','🌺','#ff3a6a',1)]}
];
for(const h of HER2){IMGS.push(ART2[h.a]);delete h.a;HEROES.push(h)}
const NBASE=HEROES.length;
