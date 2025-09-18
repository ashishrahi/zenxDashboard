import images from '../../assets/men/images';

export const kidsInnerwear = [
  {
    id: 1,
    name: "Cotton T-Shirt",
    price: 399,
    colors: ["White", "Black", "Blue"],
    gender:"kids",
    images: {
      White: [images.kidsTshirtWhite],
      Black: [images.kidsTshirtBlack],
      Blue: [images.kidsTshirtBlue],
    },
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    category: "kids-tshirts",
    description: "Soft cotton t-shirt for everyday comfort and play.",
    material: "Cotton 100%",
    care: "Machine wash at 30°C",
    delivery: "Free delivery on orders over Rs. 500. Standard delivery: Rs. 50.",
    tag: ["New Arrivals"],
       rating: 4.5
  },
  {
    id: 2,
    name: "Casual Shorts (Pack of 2)",
    price: 699,
    colors: ["Black", "Grey", "Navy"],
    gender:"kids",
    images: {
      Black: [images.kidsShortsBlack],
      Grey: [images.kidsShortsGrey],
      Navy: [images.kidsShortsGrey],
    },
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    category: "kids-shorts",
    description: "Lightweight and breathable shorts for kids’ active play.",
    material: "Cotton 90%, Polyester 10%",
    care: "Machine wash at 30°C",
    delivery: "Free delivery on orders over Rs. 500. Standard delivery: Rs. 50.",
    tag: ["Best Seller"],
       rating: 4
  },
  {
    id: 3,
    name: "Winter Jacket",
    price: 1299,
    colors: ["Red", "Blue"],
    gender:"kids",
    images: {
      Red: [images.kidsWinterRed],
      Blue: [images.kidsWinterBlue],
    },
    sizes: ["3-4Y", "4-5Y", "5-6Y"],
    category: "kids-winter-wear",
    description: "Warm and cozy winter jacket for kids.",
    material: "Polyester 80%, Cotton 20%",
    care: "Machine wash at 30°C",
    delivery: "Free delivery on orders over Rs. 500.",
    tag: ["Winter Collection"],
       rating: 4
  },
  {
    id: 4,
    name: "Sports Tracksuit",
    price: 999,
    colors: ["Green", "Black", "Yellow"],
    gender:"kids",
    images: {
      Green: [images.kidsSportsGreen],
      Black: [images.kidsSportsBlack],
      Yellow: [images.kidsSportsYellow],
    },
    sizes: ["3-4Y", "4-5Y", "5-6Y"],
    category: "kids-sportswear",
    description: "Comfortable tracksuit for kids’ sports and outdoor activities.",
    material: "Polyester 80%, Spandex 20%",
    care: "Machine wash cold",
    delivery: "Standard delivery: Rs. 50.",
    tag: ["Premium"],
       rating: 5
  },
];

// Kids Sizes
export const sizes = ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y"];

// Size guide for kids
export const sizeGuide = {
  "1-2Y": [
    { label: "Height (cm)", values: ["75-85"] },
    { label: "Chest (cm)", values: ["48-52"] },
    { label: "Waist (cm)", values: ["46-50"] },
  ],
  "2-3Y": [
    { label: "Height (cm)", values: ["85-95"] },
    { label: "Chest (cm)", values: ["52-56"] },
    { label: "Waist (cm)", values: ["48-52"] },
  ],
  "3-4Y": [
    { label: "Height (cm)", values: ["95-105"] },
    { label: "Chest (cm)", values: ["54-58"] },
    { label: "Waist (cm)", values: ["50-54"] },
  ],
  "4-5Y": [
    { label: "Height (cm)", values: ["105-115"] },
    { label: "Chest (cm)", values: ["56-60"] },
    { label: "Waist (cm)", values: ["52-56"] },
  ],
  "5-6Y": [
    { label: "Height (cm)", values: ["115-120"] },
    { label: "Chest (cm)", values: ["58-62"] },
    { label: "Waist (cm)", values: ["54-58"] },
  ],
  "6-7Y": [
    { label: "Height (cm)", values: ["120-125"] },
    { label: "Chest (cm)", values: ["60-64"] },
    { label: "Waist (cm)", values: ["56-60"] },
  ],
};
