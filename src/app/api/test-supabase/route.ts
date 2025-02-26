import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Query the 'products' table, limiting to 1 result for testing
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
} 