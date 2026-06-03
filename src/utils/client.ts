import { IApiResponse } from '../shared/interface';

export class FetchError extends Error {
  response?: {
    data: any;
    status: number;
    statusText: string;
  };

  isFetchError = true;

  constructor(
    message: string,
    response?: { data: any; status: number; statusText: string },
  ) {
    super(message);
    this.name = 'FetchError';
    this.response = response;
  }
}

export class FetchClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(config: { baseURL?: string; headers?: Record<string, string> }) {
    this.baseURL = config.baseURL || '';
    this.headers = config.headers || {};
  }

  private async handleResponse(response: Response) {
    let data: any = null;

    const contentType = response.headers.get('content-type');

    const text = await response.text();

    if (contentType && contentType.includes('application/json')) {
      data = text ? JSON.parse(text) : null;
    } else {
      data = text;
    }

    if (!response.ok) {
      throw new FetchError(
        data?.responseText || response.statusText || 'Request failed',
        {
          data,
          status: response.status,
          statusText: response.statusText,
        },
      );
    }

    return data as IApiResponse;
  }

  async get(url: string, config?: { params?: Record<string, any> }) {
    let fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;

    if (config?.params) {
      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(config.params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item !== undefined && item !== null) {
                searchParams.append(key, String(item));
              }
            });
          } else {
            searchParams.append(key, String(value));
          }
        }
      }

      const queryString = searchParams.toString();

      if (queryString) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
      }
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...this.headers,
      },
    });

    return this.handleResponse(response);
  }

  async post(url: string, data?: any) {
    const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...this.headers,
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse(response);
  }
}
