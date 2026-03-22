
import { NextResponse } from "next/server";
import { getAttractions } from "@/lib/attractions";

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json(getAttractions());
}
