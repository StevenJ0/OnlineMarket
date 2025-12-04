import { RetrieveData } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const { data : categories, error} = await RetrieveData("categories");
        if (error) {
            console.error("Error fetching categories:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to retrieve categories",
                },
                { status: 500 }
            );
        }

        console.log(categories)
        return NextResponse.json(
            {
                success: true,
                data : [categories],
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve categories",
            },
            { status: 500 }
        )
    }
}