import { useState, useEffect } from 'react';
import inventarioAPI from '../services/inventarioAPI';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [productos, setProductos] = useState([]);
    const [todosProductos, setTodosProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const productosPorPagina = 10;

    // Cargar todo al inicio
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError(null);

                // Cargar categorías, productos paginados y todos los productos
                const [categoriasData, productosData, todosData] = await Promise.all([
                    inventarioAPI.getCategorias(),
                    inventarioAPI.getProductos(1, productosPorPagina),
                    inventarioAPI.getAllProductos()
                ]);

                setCategorias(categoriasData.results || categoriasData || []);
                setProductos(productosData.results || productosData || []);
                setTotalPaginas(Math.ceil((productosData.count || 0) / productosPorPagina));
                setTodosProductos(todosData.results || todosData || []);

            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('Error al cargar los productos. Verifica que el servidor esté corriendo.');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Cargar productos cuando cambia la página
    useEffect(() => {
        if (paginaActual === 1) return; // Ya se cargó en el useEffect inicial

        const cargarPagina = async () => {
            try {
                const data = await inventarioAPI.getProductos(paginaActual, productosPorPagina);
                setProductos(data.results || data || []);
            } catch (err) {
                console.error('Error al cargar página:', err);
            }
        };

        cargarPagina();
    }, [paginaActual]);

    // Filtrar productos localmente
    const hayFiltros = busqueda.trim() || categoriaSeleccionada;

    const productosMostrados = (hayFiltros ? todosProductos : productos).filter(p => {
        const coincideBusqueda = !busqueda.trim() ||
            p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = !categoriaSeleccionada ||
            p.categoria === parseInt(categoriaSeleccionada) ||
            p.categoria_nombre === categoriaSeleccionada;
        return coincideBusqueda && coincideCategoria;
    });

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const generarNumerosPagina = () => {
        const paginas = [];
        const maxVisible = 5;

        let inicio = Math.max(1, paginaActual - Math.floor(maxVisible / 2));
        let fin = Math.min(totalPaginas, inicio + maxVisible - 1);

        if (fin - inicio + 1 < maxVisible) {
            inicio = Math.max(1, fin - maxVisible + 1);
        }

        for (let i = inicio; i <= fin; i++) {
            paginas.push(i);
        }
        return paginas;
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setCategoriaSeleccionada('');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-500">Cargando productos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar producto
                        </label>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Nombre del producto..."
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría
                        </label>
                        <select
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={limpiarFiltros}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-gray-600 mb-4">
                Mostrando {productosMostrados.length} productos
                {hayFiltros && ' (filtrados)'}
            </p>

            {productosMostrados.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No se encontraron productos con los filtros seleccionados
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {productosMostrados.map((producto) => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>

                    {totalPaginas > 1 && !hayFiltros && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => cambiarPagina(paginaActual - 1)}
                                disabled={paginaActual === 1}
                                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>

                            {generarNumerosPagina().map((numero) => (
                                <button
                                    key={numero}
                                    onClick={() => cambiarPagina(numero)}
                                    className={`px-4 py-2 rounded ${paginaActual === numero
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                >
                                    {numero}
                                </button>
                            ))}

                            <button
                                onClick={() => cambiarPagina(paginaActual + 1)}
                                disabled={paginaActual === totalPaginas}
                                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;