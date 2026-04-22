export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'drinks';
  image_url: string;
  dietary_tags: string[];
  available: boolean;
  featured: boolean;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string | null;
  guest_name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  guest_name: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'cooking' | 'ready' | 'completed' | 'cancelled';
  order_type: 'dine-in' | 'takeaway';
  special_instructions: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface CartItem extends OrderItem {}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'staff' | 'admin';
  favorites: string[];
}

export interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  author_name?: string;
  created_at: string;
}
