import { connectToDB } from "@/lib/mongodb";
import Item from "@/models/itemModel";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
      const secret = process.env.NEXTAUTH_SECRET;
      const token = await getToken({ req, secret });
  
      if (!token || token.role !== "admin") {
        const loginUrl = new URL('/not-found', req.url); 
        return NextResponse.redirect(loginUrl);
    }
  
      await connectToDB();

      const items = await Item.find().populate('stock', '_id');
  
      if (items.length === 0) {
        return NextResponse.json(
          { error: 'Not Found', message: 'No items found for the provided stock.' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(items, { status: 200 });
    } catch (error) {
      console.error('Error fetching items:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to fetch items.' },
        { status: 500 }
      );
    }
  };