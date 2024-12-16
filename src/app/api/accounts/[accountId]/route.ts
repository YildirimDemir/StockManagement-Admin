import { NextRequest, NextResponse } from 'next/server';
import Account from '@/models/accountModel';
import { connectToDB } from '@/lib/mongodb';
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';
import User from '@/models/userModel';

export const GET = async (req: NextRequest, { params }: { params: { accountId: string } }) => {
    try {
      const secret = process.env.NEXTAUTH_SECRET;
      const token = await getToken({ req, secret });
  

      if (!token || token.role !== "admin") {
        const loginUrl = new URL('/not-found', req.url); 
        return NextResponse.redirect(loginUrl);
    }
  
      const { accountId } = params;
  
      if (!mongoose.Types.ObjectId.isValid(accountId)) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid account ID format.' },
          { status: 400 }
        );
      }
  
      await connectToDB();
      const account = await Account.findById(accountId)
      .populate({
        path: 'stocks',
        populate: {
          path: 'items',
          model: 'Item',
        },
      })
      .populate('owner', 'email')
      .populate('managers stocks')
  
      if (!account) {
        return NextResponse.json(
          { error: 'Not Found', message: 'Account not found.' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(account, { status: 200 });
    } catch (error) {
      console.error('Error fetching account:', error);
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Failed to fetch account.',
          details: error instanceof Error ? error.message : 'Unknown error occurred.',
        },
        { status: 500 }
      );
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { accountId: string } }) => {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    if (!token || token.role !== "admin") {
        const loginUrl = new URL('/not-found', req.url); 
        return NextResponse.redirect(loginUrl);
    }
    
    const { accountId } = params;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid account ID format.' },
        { status: 400 }
      );
    }

    await connectToDB();
    const account = await Account.findById(accountId);

    if (!account) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Account not found.' },
        { status: 404 }
      );
    }

    await Account.findByIdAndDelete(accountId);

    return NextResponse.json(
      { message: 'Account deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to delete account.',
        details: error instanceof Error ? error.message : 'Unknown error occurred.',
      },
      { status: 500 }
    );
  }
};