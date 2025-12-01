<<<<<<< HEAD
import { getDataByColumn } from "@/lib/supabase/service";
=======
import { RetrieveDataByField } from "@/lib/supabase/service";
import jwt from "jsonwebtoken";
>>>>>>> login/aktivasi
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
<<<<<<< HEAD
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan Password wajib diisi." },
=======
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password." },
>>>>>>> login/aktivasi
        { status: 400 }
      );
    }

<<<<<<< HEAD
    const { data: user, error } = await getDataByColumn("users", "email", email);

    if (error || !user) {
      return NextResponse.json(
        { error: "Email atau password salah." }, 
        { status: 401 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau password salah." },
=======
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set");
      return NextResponse.json(
        { error: "Server misconfiguration." },
        { status: 500 }
      );
    }

    const data = await RetrieveDataByField("users", { email });

    if (data.error || data.data.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = data.data[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
>>>>>>> login/aktivasi
        { status: 401 }
      );
    }

<<<<<<< HEAD
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Login berhasil!",
        user: userWithoutPassword,
=======
    const expiresIn = rememberMe ? "3d" : "6h";

    const cookieAge = rememberMe ? 3 * 24 * 3600 : 3600;

    const tokenPayload = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { id: user.id, email: user.email, role: user.role },
>>>>>>> login/aktivasi
      },
      { status: 200 }
    );

<<<<<<< HEAD
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
=======
    response.cookies.set("token", tokenPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",          
      maxAge: cookieAge,  
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
>>>>>>> login/aktivasi
