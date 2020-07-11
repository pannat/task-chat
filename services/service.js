import axios from "axios";

const baseURL = 'http://localhost:3004'

export const fetchMessages = () => {
  return axios.get(`${baseURL}/messages`)
}

export const saveMessage = (data) => {
  return axios.post(`${baseURL}/messages`, data)
}
