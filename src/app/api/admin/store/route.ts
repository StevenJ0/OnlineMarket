import { withAuth } from "@/utils/withAuth";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateData, RetrieveDataById } from "@/lib/supabase/service";
import { sendActivationEmail } from "@/utils/generateActivationEmail";
import { sendEmail } from "@/utils/sendEmail";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ FATAL ERROR: Supabase URL atau Key tidak ditemukan di .env"
  );
}

const supabaseAdmin =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const GET = withAuth(async () => {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Server Misconfiguration: Missing Supabase Credentials",
        },
        { status: 500 }
      );
    }

    console.log("🔄 Fetching sellers...");

    if (!process.env.SUPABASE_SERVICE_KEY) {
      console.warn("⚠️ PERINGATAN: Menggunakan Anon Key. Pastikan RLS diatur!");
    }

    const { data, error } = await supabaseAdmin
      .from("sellers")
      .select(
        `
        *,
        cities ( name ),
        provinces ( name )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ SUPABASE QUERY ERROR:", error.message);

      if (error.message.includes("relationship") || error.code === "PGRST200") {
        console.log("⚠️ Fallback: Mengambil data tanpa relasi lokasi...");
        const { data: fallbackData, error: fallbackError } = await supabaseAdmin
          .from("sellers")
          .select("*")
          .order("created_at", { ascending: false });

        if (fallbackError) throw fallbackError;
        return NextResponse.json(
          { success: true, data: fallbackData },
          { status: 200 }
        );
      }

      throw error;
    }

    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 SERVER ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}, ["admin"]);

export const PUT = withAuth(
  async (request: Request) => {
    try {
      if (!supabaseAdmin) {
        throw new Error("Supabase Client not initialized");
      }

      const { searchParams } = new URL(request.url);
      const storeId = searchParams.get("storeId");

      if (!storeId) {
        return NextResponse.json(
          { success: false, message: "storeId tidak ditemukan" },
          { status: 400 }
        );
      }

      const { status } = await request.json();
      const store = await RetrieveDataById("sellers", storeId);

      if (!store?.data?.[0]) {
        return NextResponse.json(
          { success: false, message: "Store tidak ditemukan" },
          { status: 404 }
        );
      }

      const currentStore = store.data[0];

      if (status === "awaiting_activation") {
        const token = crypto.randomUUID();
        const expires = new Date();
        expires.setHours(expires.getHours() + 24);

        const { data, error } = await updateData("sellers", storeId, {
          status,
          activation_token: token,
          activation_expires: expires.toISOString(),
        });
        if (error) throw error;
        await sendActivationEmail(currentStore.pic_email, token);
        return NextResponse.json({
          success: true,
          data,
          message: "Email aktivasi dikirim",
        });
      }

      if (status === "rejected") {
        await sendEmail(
          currentStore.pic_email,
          "Pendaftaran Seller Ditolak",
          `<p>Mohon maaf, pendaftaran seller Anda ditolak.</p>`
        );
      }

      const { data, error } = await updateData("sellers", storeId, { status });
      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "Status diperbarui",
        data,
      });
    } catch (error: any) {
      console.error("PUT ERROR:", error);
      return NextResponse.json(
        { success: false, message: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  },
  ["admin"]
);
