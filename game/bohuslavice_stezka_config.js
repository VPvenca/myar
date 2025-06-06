// game/bohuslavice_stezka-config.js
// Konfigurace pro Včelařskou stezku

const BOHUSLAVICE_STEZKA = {
 scenes: {
        "/assets/stezka_bohuslavice/vcela.html": {
            name: "Střelecké terče",
            totalMarkers: 4, 
            markers: ["vcela_1", "vcela_2", "vcela_3"]
        },


// === ACHIEVEMENTY PRO VČELAŘSKOU STEZKU ===

"vcela_1_delnice": {
    name: "Pozorovatel dělnic",
    description: "Strávil jsi 30 sekund pozorováním pracovitých dělnic",
    icon: "🐝",
    category: "vcelarstvi",
    rarity: "uncommon",
    condition: "time_spent_30s",
    sceneId: "vcela_1", // nebo cesta k HTML souboru
    image: "/img/achievements/delnice.png"
},

"vcela_2_trubec": {
    name: "Badatel trubců",
    description: "Strávil jsi 30 sekund studiem života trubců",
    icon: "🐛",
    category: "vcelarstvi", 
    rarity: "uncommon",
    condition: "time_spent_30s",
    sceneId: "vcela_2", // nebo cesta k HTML souboru
    image: "/img/achievements/trubec.png"
},

"vcela_3_kralovna": {
    name: "Ctitel královny",
    description: "Strávil jsi 30 sekund obdivováním včelí královny",
    icon: "👑",
    category: "vcelarstvi",
    rarity: "uncommon", 
    condition: "time_spent_30s",
    sceneId: "vcela_3", // nebo cesta k HTML souboru
    image: "/img/achievements/kralovna.png"
},

"znalec_vcelstva": {
    name: "Znalec včelstva",
    description: "Poznáš všechny typy včel - dělnice, trubce i královnu",
    icon: "🍯",
    category: "vcelarstvi",
    rarity: "rare",
    condition: "requires_achievements",
    requiredAchievements: ["vcela_1_delnice", "vcela_2_trubec", "vcela_3_kralovna"],
    image: "/img/achievements/znalec_vcelstva.png"
}