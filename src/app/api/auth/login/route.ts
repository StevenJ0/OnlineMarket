import { RetrieveDataByField } from "@/lib/supabase/service";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set");
      return NextResponse.json(
        { error: "Server misconfiguration." },
        { status: 500 }
      );
    }

    const data = await RetrieveDataByField("sellers", { 
        pic_email: email, 
        status: "active" 
    });

    console.log("User retrieval result:", data);

    if (data.error || !data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: "Email atau password salah, atau akun belum aktif." },
        { status: 401 }
      );
    }

    const user = data.data[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    const expiresIn = rememberMe ? "3d" : "6h";
    const cookieAge = rememberMe ? 3 * 24 * 3600 : 3600;

    const tokenPayload = jwt.sign(
      { 
        id: user.id,           
        email: user.pic_email, 
        name: user.pic_name,   
        store: user.store_name,
        role: "seller"         
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { 
            id: user.id, 
            email: user.pic_email, 
            name: user.pic_name,
            role: "seller" 
        },
      },
      { status: 200 }
    );

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