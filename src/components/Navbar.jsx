import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { isAuthenticated, logout } = useAuth(); 

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  const handleLogout = () => {
    logout();
    cerrarMenu();
  };

  return (
    <nav className="bg-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="text-2xl font-bold hover:text-orange-200 transition-colors"
            onClick={cerrarMenu}
          >
            🍽️ Comida al Paso
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-orange-200 transition-colors">Inicio</Link>
            <Link to="/productos" className="hover:text-orange-200 transition-colors">Productos</Link>
            <Link to="/about" className="hover:text-orange-200 transition-colors">Acerca de</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-orange-200 transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="hover:text-orange-200 transition-colors">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-orange-200 transition-colors">Iniciar sesión</Link>
                <Link to="/register" className="hover:text-white bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-200 transition">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-2xl" onClick={toggleMenu}>
            {menuAbierto ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="md:hidden pb-4 space-y-2 px-4 bg-orange-500 z-50">
          <Link to="/" className="block py-2 hover:text-orange-200 transition-colors" onClick={cerrarMenu}>Inicio</Link>
          <Link to="/productos" className="block py-2 hover:text-orange-200 transition-colors" onClick={cerrarMenu}>Productos</Link>
          <Link to="/about" className="block py-2 hover:text-orange-200 transition-colors" onClick={cerrarMenu}>Acerca de</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block py-2 hover:text-orange-200 transition-colors" onClick={cerrarMenu}>Dashboard</Link>
              <button onClick={handleLogout} className="block py-2 hover:text-orange-200 transition-colors w-full text-left">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:text-orange-200 transition-colors" onClick={cerrarMenu}>Iniciar sesión</Link>
              <Link to="/register" className="block py-2 bg-white text-orange-500 rounded text-center hover:bg-orange-200 transition" onClick={cerrarMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;