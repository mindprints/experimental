# Instruction Set for Cursor AI: E-Commerce Webshop Development

## Project Overview

Build a full-stack e-commerce webshop with the following tech stack:
- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Node.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk

## 1. Project Setup

### 1.1 Frontend Setup

```bash
# Create a new Next.js project with TypeScript
npx create-next-app@latest webshop-frontend --typescript --tailwind --eslint

# Navigate to the project directory
cd webshop-frontend

# Install required dependencies
npm install @clerk/nextjs @supabase/supabase-js lucide-react
npm install -D @types/node @types/react @types/react-dom eslint-config-prettier prettier

# Install shadcn/ui
npx shadcn-ui@latest init
```

Configure shadcn/ui with these options:
- Typography: Yes
- Style: Default
- Color: Slate
- Global CSS: src/app/globals.css
- CSS variables: Yes
- React Server Components: Yes
- Components directory: @/components
- Utils directory: @/lib/utils
- Install next-themes: Yes

### 1.2 Backend Setup

```bash
# Create a new directory for the backend
mkdir webshop-backend
cd webshop-backend

# Initialize a new Node.js project
npm init -y

# Install required dependencies
npm install express cors dotenv helmet @supabase/supabase-js stripe
npm install -D typescript ts-node @types/express @types/cors @types/node nodemon

# Create a TypeScript configuration file
npx tsc --init
```

### 1.3 Supabase Setup

1. Create a new Supabase project through the Supabase dashboard
2. Set up the following tables with appropriate relationships:

## 2. Database Schema Design

Implement the following tables in Supabase:

### 2.1 Users Table
```sql
create table users (
  id uuid references auth.users not null primary key,
  email text not null,
  first_name text,
  last_name text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table users enable row level security;

-- Create policies
create policy "Users can view their own data." 
  on users for select 
  using (auth.uid() = id);

create policy "Users can update their own data." 
  on users for update 
  using (auth.uid() = id);
```

### 2.2 Products Table
```sql
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal not null,
  compare_at_price decimal,
  cost_price decimal,
  sku text,
  barcode text,
  inventory_quantity integer default 0,
  weight decimal,
  weight_unit text,
  featured boolean default false,
  published boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table products enable row level security;

-- Create policies
create policy "Products are viewable by everyone." 
  on products for select 
  using (true);

create policy "Products are insertable by authenticated users with admin role." 
  on products for insert 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Products are updatable by authenticated users with admin role." 
  on products for update 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Products are deletable by authenticated users with admin role." 
  on products for delete 
  using (auth.jwt() ->> 'role' = 'admin');
```

### 2.3 Categories Table
```sql
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references categories(id),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table categories enable row level security;

-- Create policies
create policy "Categories are viewable by everyone." 
  on categories for select 
  using (true);

create policy "Categories are insertable by authenticated users with admin role." 
  on categories for insert 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Categories are updatable by authenticated users with admin role." 
  on categories for update 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Categories are deletable by authenticated users with admin role." 
  on categories for delete 
  using (auth.jwt() ->> 'role' = 'admin');
```

### 2.4 Product_Categories Junction Table
```sql
create table product_categories (
  product_id uuid references products(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

-- Enable RLS
alter table product_categories enable row level security;

-- Create policies
create policy "Product categories are viewable by everyone." 
  on product_categories for select 
  using (true);

create policy "Product categories are insertable by authenticated users with admin role." 
  on product_categories for insert 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Product categories are deletable by authenticated users with admin role." 
  on product_categories for delete 
  using (auth.jwt() ->> 'role' = 'admin');
```

### 2.5 Product_Images Table
```sql
create table product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  alt_text text,
  position integer default 0,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table product_images enable row level security;

-- Create policies
create policy "Product images are viewable by everyone." 
  on product_images for select 
  using (true);

create policy "Product images are insertable by authenticated users with admin role." 
  on product_images for insert 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Product images are updatable by authenticated users with admin role." 
  on product_images for update 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Product images are deletable by authenticated users with admin role." 
  on product_images for delete 
  using (auth.jwt() ->> 'role' = 'admin');
```

### 2.6 Orders Table
```sql
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id),
  status text not null default 'pending',
  total_amount decimal not null,
  shipping_address jsonb,
  billing_address jsonb,
  payment_status text not null default 'pending',
  payment_method text,
  shipping_method text,
  tracking_number text,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table orders enable row level security;

-- Create policies
create policy "Users can view their own orders." 
  on orders for select 
  using (auth.uid() = user_id);

create policy "Admins can view all orders." 
  on orders for select 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Orders are insertable by authenticated users." 
  on orders for insert 
  using (auth.uid() = user_id);

create policy "Orders are updatable by authenticated users with admin role." 
  on orders for update 
  using (auth.jwt() ->> 'role' = 'admin');
```

### 2.7 Order_Items Table
```sql
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  price_at_purchase decimal not null,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table order_items enable row level security;

-- Create policies
create policy "Users can view their own order items." 
  on order_items for select 
  using (
    auth.uid() in (
      select user_id from orders where id = order_items.order_id
    )
  );

create policy "Admins can view all order items." 
  on order_items for select 
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Order items are insertable by authenticated users." 
  on order_items for insert 
  using (
    auth.uid() in (
      select user_id from orders where id = order_items.order_id
    )
  );
```

## 3. Frontend Implementation

### 3.1 Application Structure

```
webshop-frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   ├── (shop)/
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [product]/page.tsx
│   │   │   ├── categories/
│   │   │   │   ├── [category]/page.tsx
│   │   │   ├── cart/
│   │   │   │   ├── page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [orderId]/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── add/page.tsx
│   │   │   │   │   ├── [productId]/page.tsx
│   │   │   │   ├── categories/
│   │   │   │   │   ├── page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [orderId]/page.tsx
│   │   │   │   ├── customers/
│   │   │   │   │   ├── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   ├── shop/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-list.tsx
│   │   │   ├── product-detail.tsx
│   │   │   ├── cart-item.tsx
│   │   │   ├── cart-summary.tsx
│   │   ├── admin/
│   │   │   ├── product-form.tsx
│   │   │   ├── category-form.tsx
│   │   │   ├── order-list.tsx
│   │   │   ├── customer-list.tsx
│   ├── hooks/
│   │   ├── use-cart.ts
│   │   ├── use-products.ts
│   │   ├── use-categories.ts
│   │   ├── use-orders.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── supabase.ts
│   │   ├── clerk.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── supabase.ts
```

### 3.2 Clerk Authentication Setup

```typescript
// src/middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/products(.*)",
    "/categories(.*)",
    "/api/webhooks(.*)"
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

```typescript
// src/lib/clerk.ts
import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";

export async function getUserRole() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }
  
  try {
    const user = await clerkClient.users.getUser(userId);
    return user.publicMetadata.role || "customer";
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

export async function isAdmin() {
  const role = await getUserRole();
  return role === "admin";
}
```

### 3.3 Supabase Integration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 3.4 Key Components Implementation

#### Product Card Component
```typescript
// src/components/shop/product-card.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={product.images?.[0]?.url || '/placeholder.png'}
          alt={product.images?.[0]?.alt_text || product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div className="font-bold">
            ${product.price.toFixed(2)}
            {product.compare_at_price && (
              <span className="ml-2 text-sm line-through text-gray-500">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
```

#### Admin Product Form
```typescript
// src/components/admin/product-form.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Product, Category } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  price: z.coerce.number().positive({
    message: 'Price must be positive.',
  }),
  compare_at_price: z.coerce.number().positive().optional(),
  cost_price: z.coerce.number().positive().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  inventory_quantity: z.coerce.number().int().nonnegative().optional(),
  weight: z.coerce.number().positive().optional(),
  weight_unit: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  categories: z.array(z.string()).default([]),
});

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function ProductForm({ product, categories, onSubmit }: ProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      compare_at_price: product?.compare_at_price || undefined,
      cost_price: product?.cost_price || undefined,
      sku: product?.sku || '',
      barcode: product?.barcode || '',
      inventory_quantity: product?.inventory_quantity || 0,
      weight: product?.weight || undefined,
      weight_unit: product?.weight_unit || '',
      featured: product?.featured || false,
      published: product?.published || true,
      categories: product?.categories?.map(c => c.id) || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="compare_at_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compare at Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cost_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="inventory_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured</FormLabel>
                  <FormDescription>
                    Featured products appear on the homepage
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <FormDescription>
                    Published products are visible to customers
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit">Save Product</Button>
      </form>
    </Form>
  );
}
```

## 4. Backend Implementation

### 4.1 Server Setup

```typescript
// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Express
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('E-commerce API is running');
});

// Products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images(*),
        product_categories!inner(
          category_id,
          categories:categories(*)
        )
      `)
      .eq('published', true);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### 4.2 API Endpoints

Implement the following API endpoints:

#### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create a new product
- PUT /api/products/:id - Update a product
- DELETE /api/products/:id - Delete a product

#### Categories
- GET /api/categories - Get all categories
- GET /api/categories/:id - Get category by ID
- POST /api/categories - Create a new category
- PUT /api/categories/:id - Update a category
- DELETE /api/categories/:id - Delete a category

#### Orders
- GET /api/orders - Get all orders (admin only)
- GET /api/orders/user/:userId - Get orders by user ID
- GET /api/orders/:id - Get order by ID
- POST /api/orders - Create a new order
- PUT /api/orders/:id - Update an order (admin only)

#### Cart
- POST /api/cart - Add item to cart
- GET /api/cart/:userId - Get cart by user ID
- PUT /api/cart/:id - Update cart item
- DELETE /api/cart/:id - Remove item from cart

## 5. Feature Implementation Details

### 5.1 User Authentication with Clerk

Implement user authentication using Clerk with the following features:
- Sign up and sign in pages
- Password reset functionality
- Email verification
- Social login (Google, GitHub)
- User roles (customer, admin)

### 5.2 Product Management

Implement product management with the following features:
- Product listing with filters and pagination
- Product detail page with images, description, and related products
- Product search functionality
- Product categories and filtering by category
- Featured products section on homepage

### 5.3 Shopping Cart

Implement shopping cart functionality:
- Add to cart button on product pages
- Cart page with product list, quantities, and prices
- Update quantities and remove items
- Cart summary with subtotal, taxes, and total
- Save cart to local storage for guest users
- Save cart to database for logged-in users

### 5.4 Checkout Process

Implement a multi-step checkout process:
1. Cart review
2. Shipping information
3. Billing information
4. Payment method
5. Order confirmation

### 5.5 Order Management

Implement order management:
- Order history for customers
- Order details page
- Order status updates (admin)
- Order filtering and searching (admin)

### 5.6 Admin Dashboard

Implement an admin dashboard with:
- Overview with key metrics (sales, orders, revenue)
- Product management
- Category management
- Order management
- Customer management

## 6. Testing Strategy

### 6.1 Unit Tests

Implement unit tests for:
- Components
- Hooks
- Utility functions
- API endpoints

### 6.2 Integration Tests

Implement integration tests for:
- User flows (signup, login, browse, purchase)
- Admin flows (product management, order processing)

### 6.3 End-to-End Tests

Implement E2E tests for critical paths:
- Complete purchase flow
- Admin product creation flow
- User account management

## 7. Deployment

### 7.1 Frontend Deployment

Deploy the frontend to Vercel:
1. Connect GitHub repository
2. Configure environment variables
3. Set up build commands

### 7.2 Backend Deployment

Deploy the backend to a platform like Railway or Render:
1. Set up a production environment
2. Configure environment variables
3. Set up continuous deployment from GitHub

## 8. Performance Optimization

Implement the following performance optimizations:
- Lazy loading of images and components
- Code splitting for large pages
- Server-side rendering for SEO-critical pages
- Caching strategies for product data
- CDN for static assets

## 9. Future Enhancements

Consider these future enhancements:
- Customer reviews and ratings
- Product variants (size, color, etc.)
- Wishlists
- Coupon codes and promotions
- Email notifications
- Analytics and reporting
- Mobile app version

## Implementation Flow

Follow this order of implementation:
1. Project setup (frontend and backend)
2. Database schema setup
3. Authentication with Clerk
4. Product listing and details
5. Shopping cart functionality
6. User account management
7. Checkout process
8. Order management
9. Admin dashboard
10. Testing and optimization
11. Deployment

Use TypeScript and proper type definitions throughout the project for improved code quality and developer experience.
