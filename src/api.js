async function get(url) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}${url}`,
    {
      method: 'GET',
    },
  );
  const result = await response.json();
  return result
}

const api = { get }

export default api
