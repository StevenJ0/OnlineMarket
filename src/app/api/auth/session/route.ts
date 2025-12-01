import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    console.log("masuk session")
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log(cookieStore)

    console.log("token:", token)

    if (!token) return Response.json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    console.log("decoded:", decoded)

    return Response.json({
      loggedIn: true,
      user: decoded,
    });
  } catch (err) {
    return Response.json({ loggedIn: false });
  }
}
