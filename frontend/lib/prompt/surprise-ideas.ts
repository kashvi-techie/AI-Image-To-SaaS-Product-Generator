const IDEAS = [
  "A futuristic coffee shop landing page with neon accents and a menu grid",
  "A minimalist portfolio hero for a 3D artist with project thumbnails and contact strip",
  "A cyberpunk vinyl record store with featured releases and a newsletter signup",
  "A calm wellness studio booking page with class schedule and instructor cards",
  "A bold conference landing page with speaker grid, agenda timeline, and sponsor strip",
  "A playful kids coding camp homepage with colorful CTAs and parent testimonials",
  "An editorial fashion lookbook with full-bleed imagery and typographic captions",
  "A brutalist architecture firm site with project list and stark typography",
  "A luxury real estate showcase with property cards and map placeholder",
  "A SaaS analytics dashboard teaser with metric cards and a product screenshot frame",
  "A plant shop subscription box page with how-it-works steps and pricing",
  "A indie game studio splash page with release countdown and press quotes",
  "A neuroscience lab recruitment page with research pillars and apply CTA",
  "A bakery order page with seasonal specials and pickup time slots",
  "A music festival lineup page with sticky day tabs and artist cards",
  "A zero-waste grocery co-op landing with values grid and membership tiers",
  "A boutique hotel booking teaser with room types and amenities icons",
  "A freelance photographer pricing page with package comparison",
  "A climate nonprofit donation page with impact stats and recurring gift toggle",
  "A craft brewery tap list UI with ABV badges and food pairing notes",
  "A mobile-first fitness coach app landing with before/after stories",
  "A design system documentation hero with token preview and component chips",
  "A pet adoption shelter grid with filter chips and success stories",
  "A space tourism waitlist page with itinerary preview and FAQ accordion",
  "A handmade ceramics shop with artist story and limited drop countdown",
] as const;

export function pickRandomSurpriseIdea(current?: string): string {
  const pool = [...IDEAS];
  let pick = pool[Math.floor(Math.random() * pool.length)]!;
  if (current && pool.length > 1) {
    let n = 0;
    while (pick === current && n++ < 24) {
      pick = pool[Math.floor(Math.random() * pool.length)]!;
    }
  }
  return pick;
}
