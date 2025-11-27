import { supabase, supabaseAdmin } from "./init";

export async function addData(table: string, data: any) {
    console.log(data);
    const { data: result, error } = await supabase.from(table).insert(data).select();
    console.log("Insert result:", result, "Insert error:", error);
    return { data: result, error };
}