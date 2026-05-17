export function getSessionId(req) {
  return req.header("x-session-id") || "guest-session";
}
