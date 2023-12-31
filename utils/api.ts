import axios from "axios";

const API_ROUTE = "https://boneguide.herokuapp.com";
// const API_ROUTE = "http://192.168.11.105:8080";

const callEndpoint = async ({
  endpoint,
  method = "GET",
  body,
  headers = {},
}: any) => {
  try {
    let response: any;

    const r = `${API_ROUTE}/${endpoint}`;

    if (method === "POST") {
      response = await axios.post(r, body, {
        headers,
      });
    } else if (method === "GET") {
      response = await axios.get(r, {
        headers,
      });
    } else if (method === "DELETE") {
      response = await axios.delete(r, {
        headers,
      });
    } else if (method === "PUT") {
      response = await axios.put(r, body, {
        headers,
      });
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { callEndpoint };
