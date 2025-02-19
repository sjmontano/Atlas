import './css/SidebarMain.css';
import {useState} from 'react'

export const Prueba = () => {

    // Estado para controlar la visibilidad del sidebar
    const [isOpen, setIsOpen] = useState(false);

    // Función para alternar el sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Botón para abrir/cerrar el sidebar */}
            <button onClick={toggleSidebar} className="menu-toggle">
                <span className={`menu-icon material-symbols-outlined ${isOpen ? "menu-hide" : "menu-show"}`}>
                    {isOpen ? "close" : "menu"}
                </span>
            </button>

            {/* Sidebar principal fijo con navegación global */}
            <aside className={`sidebar-main ${isOpen ? "active" : ""}`}>
                <ul className="sidebar-main-list">

                    {/* Ítem 1: Inicio */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-icon material-symbols-outlined">home_app_logo</span>
                        </div>
                        <span className="sidebar-main-text">Inicio</span>
                    </li>

                    {/* Ítem 2: Cuenca Cauca */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-icon material-symbols-outlined">location_on</span>
                        </div>
                        <span className="sidebar-main-text">Cuenca Cauca</span>
                    </li>

                    {/* Ítem 3: Capítulo 1 */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-number">I</span>
                        </div>
                        <span className="sidebar-main-text">El valle alto del río Cauca, la cuenca y sus mundos</span>
                    </li>

                    {/* Ítem 4: Capítulo 2 */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-number">II</span>
                        </div>
                        <span className="sidebar-main-text">Redes nodo y entramados territoriales</span>
                    </li>

                    {/* Ítem 5: Capítulo 3 */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-number">III</span>
                        </div>
                        <span className="sidebar-main-text">Los caminos del río en el valle alto</span>
                    </li>

                    {/* Ítem 6: Capítulo 4 */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-number">IV</span>
                        </div>
                        <span className="sidebar-main-text">Actores, acciones, capacidades y poderes</span>
                    </li>

                    {/* Ítem 7: Capítulo 5 */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-number">V</span>
                        </div>
                        <span className="sidebar-main-text">Actores, acciones, capacidades y poderes</span>
                    </li>

                    {/* Ítem 8: Acerca de */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-icon material-symbols-outlined">read_more</span>
                        </div>
                        <span className="sidebar-main-text">Acerca de</span>
                    </li>

                    {/* Ítem 9: Créditos */}
                    <li className="sidebar-main-item">
                        <div className="sidebar-main-icon-container">
                            <span className="sidebar-main-icon material-symbols-outlined">sentiment_satisfied</span>
                        </div>
                        <span className="sidebar-main-text">Créditos</span>
                    </li>

                </ul>
            </aside>
        </div>
    );
};
