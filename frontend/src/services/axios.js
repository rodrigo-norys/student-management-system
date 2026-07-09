import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Modo demo é somente leitura: o backend devolve 403 com a mensagem técnica
// 'Demo mode is read-only.'. Aqui ela é reescrita para um texto amigável em
// pt-BR; o toast em si fica a cargo do saga que já itera response.data.errors,
// evitando notificação duplicada.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    if (
      error.response?.status === 403 &&
      Array.isArray(data?.errors) &&
      data.errors.includes('Demo mode is read-only.')
    ) {
      data.errors = ['Você está no modo demonstração — somente leitura.'];
    }
    return Promise.reject(error);
  },
);

export default instance;
