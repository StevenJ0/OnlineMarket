import { supabase, supabaseAdmin } from "./init";

export async function addData(table: string, data: any) {
    console.log(data);
    const { data: result, error } = await supabase.from(table).insert(data).select();
    console.log("Insert result:", result, "Insert error:", error);
    return { data: result, error };
}

// nambahin service biar bisa baca cek email untuk login yoo
export async function getDataByColumn(table: string, column: string, value: string) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, value)
    .single();
    
  return { data, error };
}