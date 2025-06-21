import { Category } from "@/lib/supabase";

export const sampleCategories: Omit<Category, "id" | "created_at">[] = [
  {
    name: "Electronics",
    description: "Cameras, laptops, phones, gaming equipment, and tech gadgets",
    icon: "📱",
  },
  {
    name: "Vehicles",
    description: "Cars, bikes, scooters, and transportation rentals",
    icon: "🚗",
  },
  {
    name: "Sports & Recreation",
    description: "Sports equipment, outdoor gear, and recreational items",
    icon: "🏀",
  },
  {
    name: "Tools & Equipment",
    description: "Power tools, construction equipment, and DIY tools",
    icon: "🔧",
  },
  {
    name: "Home & Garden",
    description: "Furniture, appliances, gardening tools, and home items",
    icon: "🏠",
  },
  {
    name: "Audio & Video",
    description: "Speakers, microphones, video equipment, and sound gear",
    icon: "🎵",
  },
  {
    name: "Gaming",
    description: "Gaming consoles, VR headsets, and gaming accessories",
    icon: "🎮",
  },
  {
    name: "Photography",
    description: "Professional cameras, lenses, lighting, and photo equipment",
    icon: "📸",
  },
  {
    name: "Party & Events",
    description: "Tables, chairs, decorations, and party equipment",
    icon: "🎉",
  },
  {
    name: "Fashion & Accessories",
    description: "Designer clothes, jewelry, bags, and fashion items",
    icon: "👗",
  },
  {
    name: "Books & Media",
    description: "Books, movies, music, and educational materials",
    icon: "📚",
  },
  {
    name: "Baby & Kids",
    description: "Strollers, toys, car seats, and children's items",
    icon: "👶",
  },
];
