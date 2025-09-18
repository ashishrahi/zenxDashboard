export const navLinks = [
  {
    name: "MEN",
    path: "/mens",
    subcategories: [
      {
        title: "INNERWEAR",
        items: ["Briefs", "Trunks", "Boxer Briefs", "Inner Boxer"],
      },
      {
        title: "VESTS",
        items: ["Sleeveless Vests", "Sleeved Vests", "Gym Vests"],
      },
      {
        title: "APPAREL TOPS",
        items: [
          "Tank Tops",
          "T-Shirts",
          "Polos",
          "Sweatshirts",
          "Jackets & Hoodies",
        ],
      },
      {
        title: "APPAREL BOTTOMS",
        items: ["Boxer Shorts", "Shorts", "Joggers", "Track Pants", "Pyjamas"],
      },
      {
        title: "MULTIPACKS",
        items: ["Briefs Pack", "Vests Pack", "Socks Pack"],
      },
      {
        title: "THERMALS",
        items: ["Top Thermals", "Bottom Thermals"],
      },
    ],
    rightBanner: {
      image: "/assets/men-banner.jpg", // apni image path rakho
      link: "/mens",
      text: "Everything for MEN",
    },
  },
  {
    name: "WOMEN",
    path: "/womens",
    subcategories: [
      {
        title: "INNERWEAR",
        items: ["Bras", "Panties", "Camisoles"],
      },
      {
        title: "APPAREL",
        items: ["Tops", "Leggings", "Pyjamas"],
      },
    ],
    rightBanner: {
      image: "/assets/women-banner.jpg",
      link: "/womens",
      text: "Everything for WOMEN",
    },
  },
  {
    name: "KIDS",
    path: "/kids",
    subcategories: [
      {
        title: "BOYS",
        items: ["T-Shirts", "Shorts", "Track Pants"],
      },
      {
        title: "GIRLS",
        items: ["Tops", "Leggings", "Nightwear"],
      },
    ],
    rightBanner: {
      image: "/assets/kids-banner.jpg",
      link: "/kids",
      text: "Everything for KIDS",
    },
  },
  { name: "BLOG", path: "/blog" },
  { name: "FAQ", path: "/faq" },
  { name: "Export", path: "/export" },

];
