import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSafeRemoteUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const remoteUrl = request.nextUrl.searchParams.get("url");

  if (!remoteUrl || !isSafeRemoteUrl(remoteUrl)) {
    return new Response("Invalid image URL", { status: 400 });
  }

  try {
    const upstream = await fetch(remoteUrl, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (compatible; WholesalePlasticSite/1.0)",
      },
      redirect: "follow",
      cache: "force-cache",
    });

    if (!upstream.ok) {
      return new Response("Image unavailable", { status: 404 });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return new Response("Remote resource is not an image", { status: 415 });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch {
    return new Response("Image unavailable", { status: 404 });
  }
}
