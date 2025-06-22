import { NextResponse, NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req) {
  try {
    const { name, description, image_url } = await req.json();
    const current_date = new Date().toISOString();
    try {
      await sql`INSERT INTO techno_avatars (name, image, date, description) VALUES (${name}, ${image_url}, ${current_date}, ${description});`;
      //   res.status(200).json({ name, image_url, description });
      return NextResponse.json({ name, image_url, description });
    } catch (error) {
      console.error(error);
      //   res.status(500).json({ error });
      return NextResponse.json({ error }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error });
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { image_url } = await req.json();
    await sql`DELETE FROM techno_avatars WHERE image = ${image_url};`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
