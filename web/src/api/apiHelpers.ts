export type RequestParams = Record<string, any>;

class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestError";
  }
}

type DecodedResponse =
  | {
      error: string;
    }
  | {
      data: any;
    };

export async function apiCall<Response>(
  path: string,
  fetchOptions: RequestInit
) {
  const response = await fetch("/api" + path, fetchOptions);

  const json: DecodedResponse = await response.json();

  if ("error" in json) {
    throw new RequestError(json.error);
  }

  return json.data as Response;
}

export function apiQuery<Response>(
  path: string,
  fetchOptions: RequestInit,
  params?: RequestParams
) {
  if (params) {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    path += "?" + queryParams.toString();
  }

  return apiCall<Response>(path, fetchOptions);
}

export function apiMutation<Response>(
  path: string,
  fetchOptions: RequestInit,
  params?: RequestParams
) {
  if (params) {
    fetchOptions.body = JSON.stringify(params);
    fetchOptions.headers = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    };
  }

  return apiCall<Response>(path, fetchOptions);
}
