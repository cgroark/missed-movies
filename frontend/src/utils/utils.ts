export const handleApiError = async (res: Response, action: string) => {
  console.log('res handler', res)
  let message = `Failed to ${action}`;
  let code: string | undefined;

  try {
    const errData = await res.json();
    console.log('errDAta', errData)
    code = errData.code;
    message = errData.error || message;
  } catch {
    // ignore if not JSON
  }

  if (res.status === 401) {
    message = "Your session has expired. Please log in again.";
    code = "UNAUTHORIZED";
  }

  if (res.status === 500 && !code) {
    code = "INTERNAL_ERROR";
    message = message || "Server error";
  }

  const error = new Error(message) as Error & { code?: string };
  console.log('err const', error)
  if (code) error.code = code;
  throw error;
};
