import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server"; 
import Account, { IAccount } from "@/models/accountModel";

export const GET = async (req: Request) => {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const nextRequest = req as unknown as NextRequest; 
        const token = await getToken({ req: nextRequest, secret }); 

        if (!token || token.role !== "admin") {
            const loginUrl = new URL('/not-found', req.url); 
            return NextResponse.redirect(loginUrl);
        }
       
        await connectToDB();
        const accounts: IAccount[] = await Account.find();

        if (!accounts) {
            throw new Error("All Admins Fetching Fail from MongoDB...");
        }

        return NextResponse.json(accounts, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { message: "An unknown error occurred." },
            { status: 500 }
        );
    }
};