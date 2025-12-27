// token handling
export function saveToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "/login";
}