import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import inventarioAPI from '../services/inventarioAPI';

function Home() {
    const [contador, setContador] = useState(0);
    const [mensajeBienvenida, setMensajeBienvenida] = useState('');
    const [productosDestacados, setProductosDestacados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Comida al Paso - Inicio";

        // Cargar productos destacados desde la API
        const cargarProductos = async () => {
            try {
                const data = await inventarioAPI.getProductos();
                const productos = data.results || data;
                // Tomar los primeros 3 productos con stock
                const destacados = productos.filter(p => p.stock > 0).slice(0, 3);
                setProductosDestacados(destacados);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };

        cargarProductos();
    }, []);

    useEffect(() => {
        if (contador > 0) {
            if (contador === 1) {
                setMensajeBienvenida('¡Primer visitante del día! 🎉');
            } else if (contador === 10) {
                setMensajeBienvenida('¡Ya somos 10 visitantes! 🔥');
            } else if (contador > 20) {
                setMensajeBienvenida('¡Qué popular estamos hoy! 🚀');
            } else {
                setMensajeBienvenida('');
            }
        }
    }, [contador]);

    const incrementarContador = () => {
        setContador(contador + 1);
    };

    const reiniciarContador = () => {
        setContador(0);
        setMensajeBienvenida('');
    };

    const navegarAProductos = () => {
        navigate('/products');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Bienvenido a Comida al Paso
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    La mejor comida rápida de la ciudad, preparada con amor e ingredientes frescos
                </p>

                <div className="bg-orange-100 p-6 rounded-lg mb-8 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold mb-2">👥 Visitantes hoy</h3>
                    <div className="text-3xl font-bold text-orange-600 mb-4">{contador}</div>

                    {mensajeBienvenida && (
                        <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-sm">
                            {mensajeBienvenida}
                        </div>
                    )}

                    <div className="space-x-2">
                        <Button onClick={incrementarContador}>
                            👋 ¡Hola!
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={reiniciarContador}
                            disabled={contador === 0}
                        >
                            Reiniciar
                        </Button>
                    </div>
                </div>

                <Button onClick={navegarAProductos} className="text-lg px-8 py-3">
                    🍽️ Ver Nuestro Menú
                </Button>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Productos Destacados
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {productosDestacados.map(producto => (
                        <ProductCard
                            key={producto.id}
                            producto={producto}
                        />
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Button variant="secondary" onClick={navegarAProductos}>
                        Ver todos los productos →
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default Home;