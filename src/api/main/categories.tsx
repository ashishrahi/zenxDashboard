import images from "../../assets/men/images";

export const categories = [
  {
    mainCategory: "Men",
    slug: "men",
    subCategories: [
      {
        name: "Vests",
        slug: "men-vests",
        images: {
          White: [images.vestWhite],
          Black: [images.vestBlack],
          Grey: [images.vestGrey],
        },
        description: "Comfortable vests for everyday wear",
      },
      {
        name: "Trunks",
        slug: "men-trunks",
        images: {
          Black: [images.trunkBlack],
          White: [images.trunkWhite],
        },
        description: "Stylish men's trunks",
      },
      {
        name: "Thermals",
        slug: "men-thermal",
        images: {
          Black: [images.thermalBlack],
          Grey: [images.thermalGrey],
        },
        description: "Warm thermals for winter",
      },
      {
        name: "Briefs",
        slug: "men-briefs",
        images: {
          Navy: [images.navyBoxer],
          Black: [images.boxerBlack],
          Grey: [images.boxerGrey],
        },
        description: "Comfortable briefs for everyday wear",
      },
      {
        name: "Sleeveless",
        slug: "men-sleeveless",
        images: {
          Black: [images.sleevelessBlack],
          White: [images.sleevelessWhite],
        },
        description: "Cool sleeveless options",
      },
    ],
  },

  {
    mainCategory: "Women",
    slug: "women",
    subCategories: [
      {
        name: "Sports Bras",
        slug: "women-sports-bras",
        images: {
          Black: [images.Women],
          Pink: [images.Women],
        },
        description: "Supportive sports bras for active women",
      },
      {
        name: "Leggings",
        slug: "women-leggings",
        images: {
          Black: [images.Women],
          Grey: [images.Women],
        },
        description: "Comfortable leggings for everyday wear",
      },
    ],
  },

  {
    mainCategory: "Children",
    slug: "children",
    subCategories: [
      {
        name: "Kids Vests",
        slug: "children-vests",
        images: {
          White: [images.children],
          Blue: [images.children],
        },
        description: "Soft and comfy vests for kids",
      },
      {
        name: "Kids Briefs",
        slug: "children-briefs",
        images: {
          Red: [images.children],
          Yellow: [images.children],
        },
        description: "Durable briefs for children",
      },
    ],
  },

  {
    mainCategory: "Accessories",
    slug: "accessories",
    subCategories: [
      {
        name: "Socks",
        slug: "accessories-socks",
        images: {
          Black: [images.children],
          White: [images.children],
        },
        description: "Soft and durable socks",
      },
      {
        name: "Belts",
        slug: "accessories-belts",
        images: {
          Brown: [images.children],
          Black: [images.children],
        },
        description: "Stylish belts for all occasions",
      },
    ],
  },

 
];
