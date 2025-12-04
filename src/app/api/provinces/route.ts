import { RetrieveData } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    console.log("jalan")
    try {
        const {data : dataProvinces, error} = await RetrieveData("provinces");
        console.log("Fetched provinces:", dataProvinces);
        if (error) {
            console.error("Error fetching provinces:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to retrieve provinces",
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                data: dataProvinces,
            },
            { status: 200 }
        );
    } catch (error) {
        
    }
}