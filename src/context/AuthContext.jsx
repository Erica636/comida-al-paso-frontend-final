import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      const userExists = existingUsers.find(
        user => user.username === userData.username || user.email === userData.email
      );

      if (userExists) {
        return {
          success: false,
          error: 'El usuario o email ya existe'
        };
      }

      const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        image: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=f97316&color=fff`,
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: 'Error al crear la cuenta'
      };
    }
  };

  const login = async (username, password) => {
    try {
      // Intentar login con el backend de Django (Railway)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${API_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Django JWT devuelve: { access: "token...", refresh: "token..." }
        const userData = {
          username: username,
          email: `${username}@example.com`,
          firstName: username,
          lastName: '',
          token: data.access,
          refreshToken: data.refresh,
          image: `https://ui-avatars.com/api/?name=${username}&background=f97316&color=fff`
        };

        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Error de login:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
