// Product line-up transcribed from public/assets/BenzerPaints-Brochure.pdf
// (ranges 01–03). Names and pack sizes only — the brochure's per-unit
// prices are deliberately left out of the site; the PDF stays the price
// list. Update this alongside the brochure when the range changes.
export const PRODUCT_RANGES = [
  {
    key: "premium",
    number: "01",
    tier: "Premium",
    name: "Camel Brand",
    brands: ["Camel"],
    summary:
      "Our flagship range, covering emulsions, high-sheen finishes, damp proofing, floor paint and primers.",
    groups: [
      {
        title: "Paints & Coatings",
        packs: ["20 L", "10 L", "4 L", "1 L"],
        products: [
          "Home Suraksha",
          "Rubber Adhesive",
          "Dust Proof",
          "Uitima Shine",
          "Apex Shine",
          "Tractor Shine",
          "Damp Proof",
          "Luster",
          "Floor Paint",
          "Glossy Emulsion",
          "Primer Ext/Int",
        ],
      },
      {
        title: "Wall Care & Distemper",
        packs: ["20 kg", "10 kg", "4 kg", "1 kg"],
        products: ["Crack Seal", "Distemper", "Thanda Cool"],
      },
    ],
  },
  {
    key: "prestige",
    number: "02",
    tier: "Prestige",
    name: "Alfa, Crome & Arco",
    brands: ["Alfa", "Crome", "Arco"],
    summary:
      "Three brands, one line-up: everyday emulsions, primers and wall care for interior and exterior work.",
    groups: [
      {
        title: "Paints & Coatings",
        packs: ["20 L", "10 L", "4 L", "1 L"],
        products: [
          "Dampproof",
          "Luster",
          "Floor Paint",
          "Shine Emulsion Ext",
          "White Emulsion Ext/Int",
          "Ready Colour Emulsion",
          "Primer Ext/Int (Premium)",
          "Primer Ext",
          "Primer Int",
        ],
      },
      {
        title: "Wall Care & Distemper",
        packs: ["20 kg", "10 kg", "5 kg", "2 kg", "1 kg"],
        products: ["Crack Seal", "Distemper", "Thanda Cool", "Acrylic Putty"],
      },
    ],
  },
  {
    key: "select",
    number: "03",
    tier: "Select",
    name: "Select Range",
    brands: ["Birla", "M.Gold", "Neo", "Natraj", "Murli", "J.Kamal", "Blossom"],
    summary:
      "Economy emulsion, primer and distemper, offered across our value brands.",
    groups: [
      {
        title: "White Emulsion Eco",
        packs: ["20 L", "10 L", "4 L", "1 L"],
        products: ["Emulsion Eco Ext/Int"],
      },
      {
        title: "Primer Eco",
        packs: ["20 L", "10 L", "4 L", "1 L"],
        products: ["Eco Primer Ext/Int", "Eco J.Kamal Primer"],
      },
      {
        title: "Distemper",
        packs: ["20 kg", "10 kg", "5 kg", "2 kg", "1 kg"],
        products: ["Distemper", "J.Kamal Distemper"],
      },
    ],
  },
];
