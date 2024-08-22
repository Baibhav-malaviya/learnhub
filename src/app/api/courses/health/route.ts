import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	return NextResponse.json(
		{ message: "courses route is healthy", success: true },
		{ status: 200 }
	);
}
