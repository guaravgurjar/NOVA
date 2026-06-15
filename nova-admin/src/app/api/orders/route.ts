import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Simple validation
    if (!data.buyerName || !data.buyerEmail || !data.shippingAddress || !data.totalPrice || !data.items) {
      return NextResponse.json(
        { success: false, error: 'Missing required checkout fields.' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const order = await dbService.createOrder(data);
    
    const response = NextResponse.json({ success: true, order });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
