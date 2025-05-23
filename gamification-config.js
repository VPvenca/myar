const SCENE_CONFIG = {
    "/assets/kyjov/terce.html": {
        name: "Střelecké terče",
        totalMarkers: 2, // POČET MARKERŮ V TÉTO SCÉNĚ (např. 2)
        markers: ["terc_kyjov_1", "terc_kyjov_2"] // UNIKÁTNÍ ID MARKERŮ (např. ["id_markeru1", "id_markeru2"])
    },
    "/assets/kyjov/florian.html": {
        name: "Obraz sv. Floriána",
        totalMarkers: 1,
        markers: ["florian_kyjov_obraz"]
    },
    "/assets/kyjov/scena_1.html": {
        name: "Obrazy v mezipatře",
        totalMarkers: 2, // Např. Joklík a třetihory
        markers: ["joklik_portret_kyjov", "tretihory_obraz_kyjov"]
    },
    "/assets/kyjov/scena_3.html": {
        name: "3D Vědro",
        totalMarkers: 1,
        markers: ["vedro_kyjov_model"]
    },
    "/assets/kyjov/scena_2.html": {
        name: "Hádanky",
        totalMarkers: 3, // Příklad, upravte dle reality
        markers: ["hadanka_kyjov_1", "hadanka_kyjov_2", "hadanka_kyjov_3"]
    }
    // Přidejte další scény, pokud je máte
};

// Funkce pro získání ID aktuální scény z URL
function getCurrentSceneId() {
    // window.location.pathname by měl vrátit např. "/assets/kyjov/terce.html"
    // Pokud vaše URL obsahují i název domény, možná budete potřebovat robustnější řešení,
    // ale pro PWA běžící z kořene by pathname měl stačit.
    return window.location.pathname;
}
