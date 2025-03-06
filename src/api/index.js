import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000/api/v1',
})

const sendData = async() => {
    const img = 'http://image.png';
    await api.post('/images', data)
}