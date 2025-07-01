import { comparePassword } from "@/db/helpers/bycrypt";
import errorHandler from "@/db/helpers/errorHandlers";
import { signToken } from "@/db/helpers/jwt";
import UsersModel from "@/db/models/UsersModel";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await UsersModel.findByEmail(body.email);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const valid = comparePassword(body.password, user.password);
    if (!valid) {
      return Response.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = signToken({ _id: user._id.toString() });

    const cookieStore = await cookies();
    cookieStore.set("Authorization", `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return Response.json({ message: "Login successful", token }, { status: 200 });

  } catch (error) {
    return errorHandler(error);
  }
}
