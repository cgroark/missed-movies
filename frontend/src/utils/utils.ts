export const handleApiError = async (res: Response, action: string) => {
  let message = `Failed to ${action}`;
  let code: string | undefined;

  try {
    const errData = await res.json();
    code = errData.code;
    message = errData.error || message;
  } catch {
    // ignore if not JSON
  }

  if (res.status === 401) {
    message = 'Your session has expired. Please log in again.';
    code = 'UNAUTHORIZED';
  }

  if (res.status === 500 && !code) {
    code = 'INTERNAL_ERROR';
    message = message || 'Server error';
  }

  const error = new Error(message) as Error & { code?: string };
  if (code) error.code = code;
  throw error;
};
