import { FetchClient } from '../src/utils/client';

describe('FetchClient query parameter serialization', () => {
  let originalFetch: typeof fetch;
  let mockFetch: jest.Mock;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  beforeEach(() => {
    mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      text: () => Promise.resolve(JSON.stringify({ success: true })),
    });
    global.fetch = mockFetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('should serialize single query parameters correctly', async () => {
    const client = new FetchClient({ baseURL: 'https://api.example.com' });
    await client.get('/test', { params: { name: 'john', age: 30 } });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test?name=john&age=30',
      expect.any(Object),
    );
  });

  it('should serialize array query parameters with repeating keys', async () => {
    const client = new FetchClient({ baseURL: 'https://api.example.com' });
    await client.get('/test', {
      params: { category_id: [123, 456], tag: 'new' },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test?category_id=123&category_id=456&tag=new',
      expect.any(Object),
    );
  });

  it('should filter out undefined and null values from arrays', async () => {
    const client = new FetchClient({ baseURL: 'https://api.example.com' });
    await client.get('/test', {
      params: { category_id: [123, null, undefined, 456] },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test?category_id=123&category_id=456',
      expect.any(Object),
    );
  });
});
