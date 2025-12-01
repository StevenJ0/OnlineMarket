import { RetrieveData, RetrieveDataById, updateData } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendActivationEmail } from "@/utils/generateActivationEmail";
import { sendEmail } from "@/utils/sendEmail";


export const GET = withAuth(async () => {
    try {
      console.log("Fetching all sellers");
    const data = await RetrieveData("sellers");

    console.log(data)

    return NextResponse.json(
      {
        success: true,
        data : data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sellers:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve sellers",
      },
      { status: 500 }
    );
  }
}, ["admin"]);

export const PUT = withAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");


    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "storeId tidak ditemukan" },
        { status: 400 }
      );
    }

    const { status } = await request.json();
    console.log("PUT request for storeId:", storeId);
    console.log("Requested status:", status);

    // Ambil store
    const store = await RetrieveDataById("sellers", storeId);

    if (!store?.data?.[0]) {
      return NextResponse.json(
        { success: false, message: "Store tidak ditemukan" },
        { status: 404 }
      );
    }

    const currentStore = store.data[0];

    // ===================================================
    // 🔥 1. awaiting_activation → generate token + email
    // ===================================================
    if (status === "awaiting_activation") {
      console.log("jalan")
      const token = crypto.randomUUID();
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      const { data, error } = await updateData("sellers", storeId, {
        status,
        activation_token: token,
        activation_expires: expires.toISOString(),
      });

      if (error) {
        console.error("UPDATE ERROR:", error);
        return NextResponse.json({ success: false, message: "Gagal update store" });
      }

      await sendActivationEmail(currentStore.pic_email, token);

      return NextResponse.json({ success: true, data, message: "Email aktivasi dikirim" });
    }


    // ===================================================
    // 🔥 2. rejected → kirim email penolakan
    // ===================================================
    if (status === "rejected") {
      await sendEmail(
        currentStore.pic_email,
        "Pendaftaran Seller Ditolak",
        `
        <p>Mohon maaf, pendaftaran seller Anda ditolak.</p>
        <p>Silakan perbaiki dokumen dan daftar kembali.</p>
        `
      );
    }

    // ===================================================
    // ✔ 3. Update status store
    // ===================================================
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
}, ["admin"]);


