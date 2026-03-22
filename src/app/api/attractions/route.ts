
import { NextResponse } from "next/server";
import { getAttractions } from "@/lib/attractions";

export async function GET() {
  return NextResponse.json(getAttractions());
}
