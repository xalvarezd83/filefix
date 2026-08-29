//export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/api/files/:path*", "/api/stripe/checkout"]
};
