import { verifyUserActivation } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function POST (request: Request) {
    try {
        const { token } = await request.json();
        const { status, message } = await verifyUserActivation(token);
        return NextResponse.json({ status, message }, { status: 200 });
    } catch (error) {
        console.error("Error verifying user activation:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}