type HttpMethod = 'GET' | 'POST'; //  | 'PUT' | 'DELETE'

interface CallApiOptions {
    method?: HttpMethod;
    body?: any;
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number>;
}

export async function callInternalApi<T>(
    path: string,
    options: CallApiOptions = {}
): Promise<T> {
    const {
        method = 'GET',
        body,
        headers = {},
        queryParams = {},
    } = options;

    const url = new URL(path, process.env.NEXT_PUBLIC_URL_API);

    // افزودن query string اگر هست
    Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
    });

    const response = await fetch(url.toString(), {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    return response.json();
}
