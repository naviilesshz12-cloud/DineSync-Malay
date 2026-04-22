-- 1. Create Enums for Roles and Statuses
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'cooking', 'ready', 'completed', 'cancelled');

-- 2. Create Profiles Table (Linked to Auth.Users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Menu Items Table
CREATE TABLE public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  dietary_tags TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL,
  total DECIMAL NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  order_type TEXT CHECK (order_type IN ('dine-in', 'takeaway')),
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. RLS Policies for Menu Items
CREATE POLICY "Anyone can view available menu items" ON menu_items
  FOR SELECT USING (available = true);

CREATE POLICY "Admins can manage menu items" ON menu_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. RLS Policies for Orders
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins and Staff can view/edit all orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- 9. Auto-create Profile on Sign-up Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Manual Admin Creation Instruction (Run this after signing up via the website)
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID_HERE';

-- 11. Optional: Create an initial admin user directly if you have their ID
-- INSERT INTO auth.users (id, email, password) VALUES ('...', 'admin@dinesync.my', '...');
