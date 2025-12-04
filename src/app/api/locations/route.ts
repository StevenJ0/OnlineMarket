import { RetrieveData } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const {data : dataProvinces, error} = await RetrieveData("provinces");
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
        const {data : dataCities, error : errorCities} = await RetrieveData("cities");
        if (errorCities) {
            console.error("Error fetching cities:", errorCities);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to retrieve cities",
                },
                { status: 500 }
            );
        }

        console.log(dataProvinces)
        console.log(dataCities)
        return NextResponse.json({success : true, data : {provinces : dataProvinces, cities : dataCities}}, { status: 200 });
    } catch (error) {
        
    }
}