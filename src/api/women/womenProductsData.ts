import images from '../../assets/men/images';

export const womenInnerwear = [
  {
    id: 1,
    name: "Cotton Bralette",
    price: 499,
    colors: ["White", "Black", "Beige"],
    images: {
      White: [images.braletteWhite],
      Black: [images.braletteBlack],
      Beige: [images.braletteBeige],
    },
    sizes: ["S", "M", "L", "XL"],
    gender: "womens",
    category: "women-bralettes",
    description: "Soft cotton bralette for all-day comfort and support.",
    material: "Cotton 95%, Elastane 5%",
    care: "Machine wash at 30°C",
    delivery: "Free delivery on orders over Rs. 500. Standard delivery: Rs. 50.",
    tag: ["New Arrivals"],
       rating: 5
  },
  {
    id: 2,
    name: "Seamless Panties (Pack of 3)",
    price: 799,
    colors: ["Black", "White", "Nude"],
    gender: "womens",
    images: {
      Black: [images.pantyBlack],
      White: [images.pantyBlack],
      Nude: [images.pantyBlack],
    },
    sizes: ["S", "M", "L", "XL"],
    category: "women-panties",
    description: "Comfortable seamless panties with soft elastic waistband.",
    material: "Cotton 90%, Polyester 10%",
    care: "Machine wash at 30°C",
    delivery: "Free delivery on orders over Rs. 500. Standard delivery: Rs. 50.",
    tag: ["Best Seller"],
       rating: 4
  },
  {
    id: 3,
    name: "Thermal Long Sleeve Top",
    price: 1099,
    gender: "womens",
    colors: ["Grey", "Black"],
    images: {
      Grey: [images.thermalGreyWomen],
      Black: [images.thermalBlackWomen],
    },
    sizes: ["M", "L", "XL"],
    category: "women-thermal",
    description: "Warm and soft thermal top for winter comfort.",
    material: "Cotton 60%, Polyester 40%",
    care: "Machine wash at 30°C",
    delivery: "Free delivery on orders over Rs. 500.",
       rating: 5
  },
  {
    id: 4,
    name: "Seamless Sports Bra",
    price: 699,
    colors: ["Black", "Grey", "Pink"],
    images: {
      Black: [images.sportsBraBlack],
      Grey: [images.sportsBraGrey],
      Pink: [images.sportsBraPink],
    },
    gender: "womens",
    sizes: ["S", "M", "L"],
    category: "women-sports-bra",
    description: "Stretchable sports bra for medium impact workouts.",
    material: "Nylon 80%, Spandex 20%",
    care: "Machine wash cold",
    delivery: "Standard delivery: Rs. 50.",
    tag: ["Premium"],
       rating: 4
  }
];

// Sizes
export const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Size guide for women
export const sizeGuide = {
  "XS-S": [
    { label: "UK", values: ["6", "8"] },
    { label: "EUR", values: ["34", "36"] },
    { label: "Bust cm", values: ["78-82", "83-87"] },
    { label: "Waist cm", values: ["60-64", "65-69"] },
    { label: "Hip cm", values: ["84-88", "89-93"] },
  ],
  "M-L": [
    { label: "UK", values: ["10", "12"] },
    { label: "EUR", values: ["38", "40"] },
    { label: "Bust cm", values: ["88-92", "93-97"] },
    { label: "Waist cm", values: ["70-74", "75-79"] },
    { label: "Hip cm", values: ["94-98", "99-103"] },
  ],
  "XL-XXL": [
    { label: "UK", values: ["14", "16"] },
    { label: "EUR", values: ["42", "44"] },
    { label: "Bust cm", values: ["98-102", "103-107"] },
    { label: "Waist cm", values: ["80-84", "85-89"] },
    { label: "Hip cm", values: ["104-108", "109-113"] },
  ],
};
