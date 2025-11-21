import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // 👈 Cambiado de 'token' a 'access'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error);
    return Promise.reject(error);
  }
);

export const inventarioAPI = {
  test: async () => {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      throw new Error('Error al probar la conexión con la API');
    }
  },

  getCategorias: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener categorías');
    }
  },

  createCategoria: async (nombre, descripcion) => {
    try {
      const response = await api.post('/categorias', {
        nombre,
        descripcion
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al crear categoría');
    }
  },

  getProductos: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener productos');
    }
  },

  createProducto: async (productoData) => {
    try {
      const response = await api.post('/productos', productoData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear producto');
    }
  },

  getProductosByCategoria: async (categoria) => {
    try {
      const response = await api.get(`/productos/${categoria}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener productos por categoría');
    }
  },
};

export default inventarioAPI;