import Link from 'next/link';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex items-center justify-between h-20">
            {/* Left section - Menu & Search */}
            <div className="flex items-center space-x-6">
              <button className="p-2 hover:opacity-70 transition-opacity">
                <Menu className="h-5 w-5" />
              </button>
              <button className="p-2 hover:opacity-70 transition-opacity">
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 text-center">
              <Link href="/" className="text-xl tracking-[0.2em] font-light">
                WEBSHOP
              </Link>
            </div>

            {/* Right section - User & Cart */}
            <div className="flex items-center space-x-6">
              <button className="p-2 hover:opacity-70 transition-opacity">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 hover:opacity-70 transition-opacity">
                <ShoppingBag className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <ul className="flex items-center justify-center space-x-12 h-12 text-[13px] tracking-wide">
            <li>
              <Link href="/shop" className="hover:opacity-70 transition-opacity">
                SHOP
              </Link>
            </li>
            <li>
              <Link href="/new-arrivals" className="hover:opacity-70 transition-opacity">
                NEW ARRIVALS
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:opacity-70 transition-opacity">
                COLLECTIONS
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
} 