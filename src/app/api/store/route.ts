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
    const receivedFiles: Record<string, File> = {};

    formData.forEach((value, key) => {
      if (value instanceof File) {
        receivedFiles[key] = value;
      } else {
        receivedData[key] = value;
      }
    });

    if (!receivedFiles.ktpFile || !receivedFiles.picPhoto) {
      return NextResponse.json(
        { message: "File KTP atau foto PIC tidak ditemukan." },
        { status: 400 }
      );
    }

    const safeStoreName = (receivedData.storeName || "store")
      .replace(/\s+/g, "_")
      .toLowerCase();

    const upload = async (path: string, file: File) => {
      const { url, error } = await uploadFile(
        "dokumen_pembukaan_store",
        path,
        file
      );

      if (error || !url) {
        throw new Error(`Gagal upload: ${path}`);
      }

      return url;
    };

    const ktpUrl = await upload(
      `ktp/${safeStoreName}/${receivedFiles.ktpFile.name}`,
      receivedFiles.ktpFile
    );

    const picUrl = await upload(
      `pic/${safeStoreName}/${receivedFiles.picPhoto.name}`,
      receivedFiles.picPhoto
    );

    console.log("Uploaded file URLs:", { ktpUrl, picUrl });
    console.log("Received data for store registration:", receivedData);

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
      kelurahan: receivedData.kelurahan,
      city_id: receivedData.cityId,
      province_id: receivedData.provinceId,

      pic_ktp_number: receivedData.ktpNumber,
      pic_photo_url: picUrl,
      pic_ktp_photo_url: ktpUrl,
      status: "pending", // biasanya store baru → pending (boleh hapus)
    });

    if (error) {
      console.error("Error adding data to database:", error);
      return NextResponse.json(
        { message: "Gagal menyimpan data ke database.", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registrasi store berhasil.", data: result },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("POST /api/store error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan.", error: error.message },
      { status: 500 }
    );
  }
}, ["user"]);

