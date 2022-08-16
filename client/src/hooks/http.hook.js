import {useState} from 'react';
import axios from 'axios';

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, method, headers, body, id) => {
    setLoading(true);
    const data = await axios.request({url: url, method: method, headers: headers || {}, data: body || {}});
    setLoading(false);
    return data;
  };

  return {loading, error, request};
};