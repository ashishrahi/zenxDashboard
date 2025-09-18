import images from "../../assets/men/images";

export const categories = [
  {
    name: "men-vests",
    slug: "men-vests",
    gender: "mens",
    images: {
      White: [images.vestWhite],
      Black: [images.vestBlack],
      Grey: [images.vestGrey],
    },
    description: "Comfortable vests for everyday wear",
  },
  {
    name: "men-trunks",
    slug: "men-trunks",
       gender: "mens",
    images: {
      Black: [images.trunkBlack],
      White: [images.trunkWhite],
    },
    description: "Stylish men's trunks",
  },
  {
    name: "men-thermal",
    slug: "men-thermal",
        gender: "mens",
    images: {
      Black: [images.thermalBlack],
      Grey: [images.thermalGrey],
    },
    description: "Warm thermals for winter",
  },
  {
  name: "men-briefs",
  slug: "men-briefs",
      gender: "mens",
  images: {
    Navy: [images.navyBoxer],
    Black: [images.boxerBlack],
    Grey: [images.boxerGrey],
  },
  description: "Comfortable briefs for everyday wear",
},
  {
    name: "men-sleeveless",
    slug: "men-sleeveless",
        gender: "mens",
    images: {
      Black: [images.sleevelessBlack],
      White: [images.sleevelessWhite],
    },
    description: "Cool sleeveless options",
  },
];
