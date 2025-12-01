import { supabase, supabaseAdmin } from "./init";

export async function addData(table: string, data: any) {
    console.log(data);
    const { data: result, error } = await supabase.from(table).insert(data).select();
    console.log("Insert result:", result, "Insert error:", error);
    return { data: result, error };
}

export async function updateData(table: string, id: any, data: any) {
  console.log("UPDATE:", table, id, data);

  const { data: result, error } = await supabaseAdmin
    .from(table)
    .update(data)
    .eq("id", id)
    .select();

  console.log("Update result:", result, "Update error:", error);
  return { data: result, error };
}


export async function deleteData (table: string, id: any) {
    const { data: result, error } = await supabase.from(table).delete().eq("id", id).select();
    console.log("Delete result:", result, "Delete error:", error);
    return { data: result , error };
}

export async function RetrieveData(table : string,) {
    const { data, error } = await supabase.from(table).select("*")
    console.log("Retrieve result:", data, "Retrieve error:", error);
    return { data , error };
}

export async function RetrieveDataById(tableName : string, id: any){
    const { data, error } = await supabase.from(tableName).select("*").eq("id", id);
    console.log("Retrieve by ID result:", data, "Retrieve by ID error:", error);
    return { data , error };
}

export async function RetrieveDataByField(
  tableName: string,
  filters: { [key: string]: string | number | boolean }
) {
  console.log("jalan")
  console.log(filters)
  console.log(tableName)
  let query = supabase.from(tableName).select("*");

  Object.entries(filters).forEach(([field, value]) => {
    query = query.eq(field, value);
  });

  const { data: result, error } = await query;
  console.log("hasil")
  console.log(result)
  return { data: result ?? [], error };
}

export async function uploadFile(bucket: string, filePath: string, file: File) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (error) return { url: null, error };

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    error: null
  };
}

export async function verifyUserActivation(token: string) {
  if (!token) {
    return { status: "invalid", message: "Token tidak ditemukan" };
  }

  const { data: seller, error } = await RetrieveDataByField("sellers", {
    activation_token: token,
  });

  if (error) {
    return { status: "error", message: "Terjadi kesalahan pada server" };
  }

  if (!seller || seller.length === 0) {
    return { status: "invalid", message: "Token tidak valid" };
  }

  const user = seller[0];

  const now = new Date();
  const expires = new Date(user.activation_expires); // ← PERBAIKAN DI SINI

  if (now > expires) {
    return { status: "expired", message: "Token sudah kadaluarsa" };
  }

  const { error: updateError } = await updateData("sellers", user.id, {
    status: "active",
    activation_token: null,
    activation_expires: null,
    updated_at: new Date().toISOString(),
  });

  if (updateError) {
    return { status: "error", message: "Gagal mengupdate data seller" };
  }

  return { status: "success", message: "Toko berhasil diaktifkan" };
}
