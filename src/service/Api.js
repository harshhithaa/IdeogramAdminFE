import axios from 'axios';

console.log(process.env.REACT_APP_GATEWAY_URL, "aPI url");

export default axios.create({
  baseURL: process.env.REACT_APP_GATEWAY_URL,
  responseType: 'json',
  headers: {
    Authorization: process.env.REACT_APP_AUTH,
    'Content-Type': 'application/json',
    AppVersion: process.env.REACT_APP_VERSION,
  },
});
