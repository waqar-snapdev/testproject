const useApi = () => {
  const request = async (url: string, options: any = {}) => {
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(`/api/v1${url}`, { ...options, headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : {};

    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  const get = (url: string) => request(url);
  const post = (url: string, body: any) => request(url, { method: 'POST', body: JSON.stringify(body) });
  const put = (url: string, body: any) => request(url, { method: 'PUT', body: JSON.stringify(body) });
  const del = (url: string) => request(url, { method: 'DELETE' });


  return { get, post, put, del, request };
};

export default useApi;