import { addData } from "@/lib/supabase/service";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Password mismatch
    if (data.password !== data.confirmPassword) {
      return NextResponse.json(
        { error: "Password confirmation does not match." },
        { status: 401 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Insert into DB
    const res = await addData("users", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
    });

    // Supabase return error
    if (res.error) {
      const message = res.error.message || "Database error";

      if (message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "Email already registered." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registration success!", data: res.data },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Register API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
