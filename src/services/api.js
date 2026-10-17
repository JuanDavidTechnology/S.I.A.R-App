/**
 * src/services/api.js
 * Cliente HTTP centralizado para la API REST de S.I.A.R. (PHP + MySQL en XAMPP).
 *
 * Configure BASE_URL con la IP local de su servidor, por ejemplo:
 *   - Dispositivo físico (misma red Wi-Fi): http://192.168.1.100/siar_api/public
 *   - Emulador de Android:                   http://10.0.2.2/siar_api/public
 *   - Web / iOS Simulator:                   http://localhost/siar_api/public
 *
 * Todas las peticiones adjuntan la cabecera Authorization: Bearer <token>
 * cuando el token de sesión existe.
 */
const BASE_URL = "http://192.168.101.4/siar_api/public";

const REQUEST_TIMEOUT_MS = 12000;

let authToken = null;

/** Almacena el token para las próximas peticiones (se llama tras login/register). */
export const setAuthToken = (token) => {
  authToken = token || null;
};

export const getAuthToken = () => authToken;

const withTimeout = (timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, clear: () => clearTimeout(timer) };
};

const buildUrl = (path) => `${BASE_URL}${path}`;

const toQueryString = (params) =>
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

const request = async (
  path,
  { method = "GET", body, timeout = REQUEST_TIMEOUT_MS } = {},
) => {
  const { controller, clear } = withTimeout(timeout);

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    clear();
    if (error.name === "AbortError") {
      throw new Error(
        "Tiempo de espera agotado. Verifica la conexión con el servidor.",
      );
    }
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu red y que XAMPP esté activo.",
    );
  }
  clear();

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_error) {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Error del servidor (${response.status})`;
    throw new Error(message);
  }

  return data;
};

/**
 * Helper de peticiones HTTP.
 * - get(path, params?)  -> GET con query string opcional
 * - post(path, body)    -> POST con cuerpo JSON
 * - put(path, body)     -> PUT con cuerpo JSON
 */
export const api = {
  get: (path, params) => {
    const query =
      params && Object.keys(params).length > 0
        ? `?${toQueryString(params)}`
        : "";
    return request(`${path}${query}`);
  },
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
};

export { BASE_URL };
