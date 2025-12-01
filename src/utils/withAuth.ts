import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function withAuth(
  handler: (request: Request, decoded: any) => Promise<Response>,
  allowedRoles: string[] = []
) {
  console.log("withAuth roles:", allowedRoles);
  return async (request: Request): Promise<Response> => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if (!token) {
        return NextResponse.json(
          { message: "Not authenticated" },
          { status: 401 }
        );
      }

      const decoded = jwt.verify(token, SECRET) as any;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return NextResponse.json(
          { message: "Forbidden", redirect: "/" },
          { status: 403 }
        );
      }

      return handler(request, decoded);

    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token", redirect: "/" },
        { status: 401 }
      );
    }
  };
}
