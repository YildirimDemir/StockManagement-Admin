import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDB } from '@/lib/mongodb';
import Stock from '@/models/stockModel';
import Account from '@/models/accountModel';

export const GET = async (req: NextRequest, { params }: { params: { stockId: string } }) => {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    if (!token || token.role !== "admin") {
        const loginUrl = new URL('/not-found', req.url); 
        return NextResponse.redirect(loginUrl);
    }

    await connectToDB();

    const stock = await Stock.findById(params.stockId).populate('items');
    if (!stock) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Stock not found.' },
        { status: 404 }
      );
    }

    const account = await Account.findById(stock.account);
    if (!account) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Account not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(stock, { status: 200 });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch stock.',
        details: error instanceof Error ? error.message : 'Unknown error occurred.',
      },
      { status: 500 }
    );
  }
};