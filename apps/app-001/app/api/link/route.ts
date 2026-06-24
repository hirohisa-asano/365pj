import { NextResponse } from "next/server";

export function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const title = searchParams.get("q");

	if (!title) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	const amazonUrl = `https://www.amazon.co.jp/s?k=${encodeURIComponent(title)}&i=stripbooks&tag=southerncro08-22`;

	return NextResponse.redirect(amazonUrl);
}
