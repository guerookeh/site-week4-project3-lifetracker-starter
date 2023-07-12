const BASE_API_URL = 'http://localhost:3001' // this should be an environment var... meh

class LifeTrackerAPIClient {

  constructor() {
    this.base_url = BASE_API_URL;
  }

  async request(options) {
    const { route, method, query, headers, body } = options;
    
    let queryString = '';
    if (query) {
      const queryParams = new URLSearchParams(query).toString();
      queryString = (queryParams !== '') ? `?${queryParams}` : '';
    }

    const response = await fetch(`${this.base_url}${route}${queryString}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
      credentials: 'include',
      withCredentials: true,
    });
    
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      body: (response.status != 204) ? data : null,
    };
  }

  async get(route, query, options) {
    return this.request({method: 'GET', route, query, ...options});
  }

  async post(route, body, options) {
    return this.request({method: 'POST', route, body, ...options});
  }

}

export default LifeTrackerAPIClient;

