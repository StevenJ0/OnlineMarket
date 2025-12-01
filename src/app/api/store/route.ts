import { addData, RetrieveDataByField, uploadFile } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("userId");

  console.log("Received userId:", userId);

  if (!userId) {
    return Response.json(
      { error: "Missing userId" },
      { status: 400 }
    );
  }

  const dataStore = await RetrieveDataByField("sellers", { user_id: userId });

  if (dataStore.error) {
    return Response.json(
      { error: dataStore.error },
      { status: 500 }
    );
  }

  console.log("Data store retrieved:", dataStore);

  if (!dataStore.data || dataStore.data.length === 0) {
    return Response.json(
      { store: null, message: "Store not found" },
      { status: 200 }
    );
  }

  return Response.json(
    { store: dataStore.data[0], message: "Store found" },
    { status: 200 }
  );
}

export const POST = withAuth(async (req: Request, user: any) => {
  try {
    const formData = await req.formData();

    const receivedData: Record<string, any> = {};
    const receivedFiles: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        receivedFiles[key] = {
          file: value,
          filename: value.name,
          type: value.type,
          size: value.size,
        };
      } else {
        receivedData[key] = value;
      }
    }

    if (!receivedFiles.ktpFile || !receivedFiles.picPhoto) {
      return NextResponse.json(
        { message: "File KTP atau foto PIC tidak ditemukan." },
        { status: 400 }
      );
    }

    const { url: ktpUrl, error: ktpErr } = await uploadFile(
      "dokumen_pembukaan_store",
      `ktp/${receivedData.storeName}/${receivedFiles.ktpFile.filename}`,
      receivedFiles.ktpFile.file
    );

    if (ktpErr || !ktpUrl) {
      return NextResponse.json(
        { message: "Gagal mengunggah file KTP." },
        { status: 500 }
      );
    }

    const { url: picUrl, error: picErr } = await uploadFile(
      "dokumen_pembukaan_store",
      `pic/${receivedData.storeName}/${receivedFiles.picPhoto.filename}`,
      receivedFiles.picPhoto.file
    );

    if (picErr || !picUrl) {
      return NextResponse.json(
        { message: "Gagal mengunggah foto PIC." },
        { status: 500 }
      );
    }

    const { data: result, error } = await addData("sellers", {
      user_id: user.id,
      store_name: receivedData.storeName,
      store_description: receivedData.description,
      pic_name: receivedData.picName,
      pic_phone: receivedData.picPhone,
      pic_email: receivedData.picEmail,
      street: receivedData.addressStreet,
      rt: receivedData.addressRt,
      rw: receivedData.addressRw,
      kelurahan: receivedData.addressVillage,
      kota: receivedData.addressDistrict,
      provinsi: receivedData.addressProvince,
      pic_ktp_number: receivedData.ktpNumber,
      pic_photo_url: picUrl,
      pic_ktp_photo_url: ktpUrl,
    });

    if (error) {
      return NextResponse.json(
        { message: "Gagal menyimpan data ke database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Registrasi store berhasil.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan ." },
      { status: 500 }
    );
  }
}, ["user"]);

