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
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const localUser = registeredUsers.find(
        user => user.username === username && user.password === password
      );

      if (localUser) {
        const userData = {
          ...localUser,
          token: 'local_token_' + Date.now()
        };

        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return { success: true };
      }

      if (username === 'Erica' && password === 'React2025') {
        const userData = {
          id: 1,
          username: 'Erica',
          email: 'erica@example.com',
          firstName: 'Erica',
          lastName: 'Ansaloni',
          token: 'custom_token_' + Date.now(),
          image: 'https://ui-avatars.com/api/?name=Erica+Ansaloni&background=f97316&color=fff'
        };

        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return { success: true };
      }

      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.accessToken || data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setIsAuthenticated(true);
        setUser(data);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
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