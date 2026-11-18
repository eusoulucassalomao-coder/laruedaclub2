// Configuração do restaurante (marca, links e imagens). As REGRAS (pontos, prêmios, bônus) ficam no banco e o dono edita no painel;
// os valores abaixo servem de reserva caso o servidor não responda. Para um novo cliente, é só trocar este arquivo e as imagens em /assets.
window.CFG = {
  id: "laruedita",                       // identificador do restaurante no banco
  api: "/api/fid",
  ownerEmail: "laruedita@2027.com",
  name: "La Ruedita",
  club: "Club La Ruedita",
  tagline: "Parrilla · Galetería",
  logo: "assets/logo.webp",
  address: "Alfonso de Arrechea 835, Posadas, Misiones",
  whatsapp: "5493764236680",
  menuUrl: "https://laruedita-carta.vercel.app",
  deliveryUrl: "https://laruedita-carta.vercel.app/delivery",
  reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJu9Hcy9K_V5QRCTuWbK0bmfU",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Alfonso%20de%20Arrechea%20835%2C%20Posadas%2C%20Misiones&query_place_id=ChIJu9Hcy9K_V5QRCTuWbK0bmfU",
  hero: "assets/hero.webp",

  // reserva (o servidor manda os valores reais)
  earn: { perAmount: 100, points: 1 },
  multipliers: { 2: 2, 3: 2 },
  bonus: { welcome: 50, referral: 150, birthday: 200, review: 100 },
  inactiveDays: 30,
  rewards: [
    { id: "postre",  name: "Postre de la casa",      pts: 300,  img: "assets/r-postre.jpg",  note: "Flan, queso y dulce o el postre del día" },
    { id: "entrada", name: "Entrada para compartir", pts: 600,  img: "assets/r-entrada.jpg", note: "Provoleta a la plancha" },
    { id: "desc15",  name: "15% de descuento",       pts: 1000, img: "assets/r-bife.jpg",    note: "En toda tu cuenta, una vez por mes" },
    { id: "molleja", name: "Mollejas de la casa",    pts: 1500, img: "assets/r-molleja.jpg", note: "Porción para compartir en la mesa" }
  ]
};
