export const maxDuration = 30; // This function can run for a maximum of 30 seconds

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { put } from "@vercel/blob";

export const runtime = "nodejs"; // You can set 'edge' or 'nodejs' depending on your needs

export async function POST(req) {
  try {
    const { name, description } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: description,
      n: 1,
      size: "1024x1024",
    });

    console.log(response);
    const image_url = response.data?.[0]?.url ?? "";

    // Fetch the image data
    const imageResponse = await fetch(image_url ?? "");
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a filename
    const filename = `${name}-${Date.now()}.png`;

    // Store the image in Vercel Blob storage
    const { url } = await put(`images/${filename}`, buffer, {
      contentType: "image/png",
      access: "public",
    });

    return NextResponse.json({ name, image_url: url, description });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
