import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

function Dashboard() {
  const { user, logout } = useAuth();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    document.title = 'Comida al Paso - Dashboard';
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard - Panel de Administración
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <Button variant="danger" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-orange-600">
          Información del Usuario
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Usuario:</strong> {user?.username}</p>
          </div>
          <div>
            {user?.image && (
              <img
                src={user.image}
                alt="Avatar"
                className="w-20 h-20 rounded-full"
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;