import axios from 'axios';
import { data } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000'; 

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

export const shortenUrl = async (originalUrl, customAlias, expirationDate, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/shorten`,
      { originalUrl, customAlias, expirationDate },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data)
    return response.data;
  } catch (error) {
    throw new Error('Error shortening URL');
  }
};

export const getUrls = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching URLs');
  }
};


export const getAnalytics = async (shortCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/data/${shortCode}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching analytics');
  }
};

export const getQrCode = async (shortCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/qrcode/${shortCode}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching QR code');
  }
};
