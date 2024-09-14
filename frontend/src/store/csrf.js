import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
  options.method = options.method || 'GET';
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== 'GET') {
    if (options.body instanceof FormData) {
      delete options.headers['Content-Type'];
    } else {
      options.headers['Content-Type'] = 'application/json';
    }
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }

  const res = await window.fetch(url, options);

  if (res.status >= 400) {
    const errorData = await res.json();
    // Throw an error with response and data so it can be destructured later
    const error = new Error('Request failed');
    error.response = res;
    error.data = errorData;
    throw error;
  }

  return res;
}

export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}
