import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/shop/ProductGrid';

export default async function HomePage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8]">
      <Header />
      <main className="flex-1 container mx-auto px-6 pt-36 pb-16 max-w-[1400px]">
        {error ? (
          <div className="text-center text-red-500">
            Failed to load products
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-light mb-12 text-center">NEW ARRIVALS</h1>
            <ProductGrid products={products || []} />
          </>
        )}
      </main>
    </div>
  );
} 
