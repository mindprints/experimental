import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
};

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {products.map((product) => (
        <Link 
          key={product.id} 
          href={`/products/${product.id}`}
          className="group block"
        >
          <div className="relative w-full aspect-[4/5] bg-white mb-6">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
            />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-light tracking-wide">{product.name}</h3>
            <p className="text-xs text-gray-500 tracking-wide">{product.category}</p>
            <p className="text-sm font-light">${product.price.toFixed(2)} USD</p>
          </div>
        </Link>
      ))}
    </div>
  );
} 