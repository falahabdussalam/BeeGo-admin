// Initial clean database definitions for BeeGo Store & Admin Panel

const initialCategories = [
  {
    id: 'food',
    name: 'Food & Kitchen',
    icon: '🍔',
    color: 'from-red-500 to-amber-600',
    itemCount: 0,
    isActive: true,
    description: 'Authentic Meals, Tiffins & Hot Food',
    bannerImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    color: 'from-emerald-600 to-teal-600',
    itemCount: 0,
    isActive: true,
    description: 'Rice, Grains, Oils, Spices & Daily Cooking Essentials',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicines',
    name: 'Medicines & Health',
    icon: '💊',
    color: 'from-blue-600 to-cyan-600',
    itemCount: 0,
    isActive: true,
    description: 'OTC Medicines, First Aid, Supplements & Healthcare',
    bannerImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fruits-vegetables',
    name: 'Fruits & Veggies',
    icon: '🥦',
    color: 'from-green-500 to-emerald-600',
    itemCount: 0,
    isActive: true,
    description: 'Farm-Fresh Vegetables, Fruits & Greens',
    bannerImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'coorg-specials',
    name: 'Coorg Specials',
    icon: '☕',
    color: 'from-amber-700 to-yellow-600',
    itemCount: 0,
    isActive: true,
    description: 'Original Coorg Coffee, Wild Honey, Homemade Chocolates & Spices',
    bannerImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    icon: '🥛',
    color: 'from-sky-500 to-indigo-600',
    itemCount: 0,
    isActive: true,
    description: 'Fresh Milk, Curd, Butter, Paneer & Farm Eggs',
    bannerImage: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bakery',
    name: 'Bakery & Snacks',
    icon: '🥐',
    color: 'from-yellow-600 to-orange-600',
    itemCount: 0,
    isActive: true,
    description: 'Fresh Breads, Buns, Rusks, Cookies & Evening Snacks',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'beverages',
    name: 'Beverages & Drinks',
    icon: '🧃',
    color: 'from-rose-500 to-pink-600',
    itemCount: 0,
    isActive: true,
    description: 'Cold Drinks, Fruit Juices, Tender Coconut & Energy Drinks',
    bannerImage: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '🧴',
    color: 'from-purple-500 to-pink-500',
    itemCount: 0,
    isActive: true,
    description: 'Soaps, Shampoos, Oral Care & Hygiene Essentials',
    bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'household',
    name: 'Household Needs',
    icon: '🧹',
    color: 'from-teal-500 to-emerald-600',
    itemCount: 0,
    isActive: true,
    description: 'Detergents, Cleaners, Insect Repellents & Pooja Items',
    bannerImage: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80'
  }
];
const initialStores = [
  {
    id: 'store-1',
    name: 'Virajpete Express Central',
    category: 'groceries',
    phone: '+91 8105326568',
    address: 'Main Bazaar Road, Clock Tower, Virajpete, Kodagu 571218',
    deliveryTime: '20-30 mins',
    minOrder: 99,
    rating: 4.9,
    reviewCount: 142,
    isOpen: true,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Central hub for ultra-fast grocery and daily essentials delivery in Virajpete town.'
  },
  {
    id: 'store-2',
    name: 'BeeGo Fresh Grocers',
    category: 'fruits-vegetables',
    phone: '+91 8105326568',
    address: 'College Road, Near Private Bus Stand, Virajpete 571218',
    deliveryTime: '15-25 mins',
    minOrder: 49,
    rating: 4.8,
    reviewCount: 88,
    isOpen: true,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    description: 'Farm-fresh organic fruits, local greens, and farm produce.'
  },
  {
    id: 'store-3',
    name: 'Coorg Heritage Spices & Coffee',
    category: 'coorg-specials',
    phone: '+91 8105326568',
    address: 'Clock Tower Junction, Virajpete 571218',
    deliveryTime: '25-35 mins',
    minOrder: 149,
    rating: 5.0,
    reviewCount: 65,
    isOpen: true,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic estate-grown Coorg coffee, wild forest honey, homemade chocolates and spices.'
  }
];

const initialProducts = [];
const initialCoupons = [];
const initialZones = [];
const initialRiders = [];
const initialOrders = [];

const initialSettings = {
  storeName: "BeeGo Store",
  storeTagline: "Fast & Reliable Online Ordering",
  isOpen: true,
  emergencyNotice: "",
  whatsappNumber: "",
  cleanWhatsapp: "",
  contactEmail: "admin@beego.com",
  address: "",
  currency: "₹",
  defaultDeliveryFee: 20,
  freeDeliveryThreshold: 199,
  avgDeliveryMinutes: 30,
  maxDeliveryRadiusKm: 10,
  operatingHours: "08:00 AM - 10:00 PM",
  allowCod: true,
  allowUpi: true,
  enableSoundAlerts: true,
  autoConfirmOrders: false,
  corsOrigins: [
    "http://localhost:5173",
    "http://localhost:3000"
  ]
};

module.exports = {
  initialCategories,
  initialStores,
  initialProducts,
  initialCoupons,
  initialZones,
  initialRiders,
  initialOrders,
  initialSettings
};
