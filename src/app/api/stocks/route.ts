import { NextRequest, NextResponse } from 'next/server';
import Stock from '@/models/stockModel';
import { connectToDB } from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';

export const GET = async (req: NextRequest) => {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    if (!token || token.role !== "admin") {
        const loginUrl = new URL('/not-found', req.url); 
        return NextResponse.redirect(loginUrl);
    }

    await connectToDB();

    const stocks = await Stock.find().populate('items');

    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch stocks.',
        details: error instanceof Error ? error.message : 'Unknown error occurred.',
      },
      { status: 500 }
    );
  }
};