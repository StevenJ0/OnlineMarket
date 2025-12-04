import { RetrieveData, RetrieveDataByField } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get("provinceId");

  try {
    if (provinceId) {
      const { data, error } = await RetrieveDataByField("cities", {
        province_id: provinceId,
      });

      if (error) {
        return NextResponse.json(
          { success: false, message: "Failed to retrieve cities" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, cities: data });
    }

    const { data, error } = await RetrieveData("cities");

    if (error) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve cities" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, cities: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
