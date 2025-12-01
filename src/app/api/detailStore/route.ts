import { RetrieveDataById } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET (request: Request) {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    console.log(storeId);

    if (!storeId) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
    }

    try {
        const store = await RetrieveDataById('sellers',  storeId);
        console.log("Fetched store:", store);
        return NextResponse.json({ store }, { status: 200 });
    } catch (error) {
        console.error("Error fetching store:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}