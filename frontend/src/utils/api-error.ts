
type ApiErrorLike = {
  data?: {
    message?: string;
    errorMessages?: Array<{
      message?: string;
    }>;
  };
  response?: {
    status?: number;
    _data?: {
      message?: string;
    };
  };
  status?: number;
  statusCode?: number;
  message?: string;
  name?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const err = error as ApiErrorLike;

  // Network errors: backend unavailable, failed fetch, etc.
  if (
    err.name === "FetchError" ||
    err.name === "TypeError" ||
    err.message?.includes("Failed to fetch")
  ) {
    return "Unable to connect to the server. Please try again later.";
  }

  // ofetch HTTP error response
  const responseData = err.response?._data;
  const responseMessage = responseData?.message;

  if (responseMessage) {
    return responseMessage;
  }

  // API error data
  if (err.data?.message) {
    return err.data.message;
  }

  // Backend validation error
  const validationMessage = err.data?.errorMessages
    ?.map((item) => item.message)
    .filter((message): message is string => Boolean(message))
    .join(", ");

  if (validationMessage) {
    return validationMessage;
  }

  // Generic JavaScript error
  if (err.message) {
    return err.message;
  }

  return fallback;
}
