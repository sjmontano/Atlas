import { driver } from 'driver.js';
import "driver.js/dist/driver.css";


const driverObj = driver({
    showProgress: true,
    doneBtnText: 'Listo',
    closeBtnText: 'Cerrar',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    steps: [
        {
            element: '#atlas-button-explorar',
            popover: {
                title: 'explorar',
                description: 'Lorem ipsum em dolor',
            }
        },
       
        {
            element: '#toggle-button',
            popover: {
                title: 'home',
                description: 'Lorem ipsum em dolor',
            }
        },
        {
            element: '#inicio',
            popover: {
                title: 'about',
                description: 'Lorem ipsum em dolor',
            }
        },
        {
            element: '#cuenca-cauca',
            popover: {
                title: 'services',
                description: 'Lorem ipsum em dolor',
            }
        },
        {
            element: '#valle-rio-cauca',
            popover: {
                title: 'contact',
                description: 'Lorem ipsum em dolor',
            }
        },
        {
            element: "#redes-nodo",
            popover:{
                title: 'Abrir modal',
                description: 'Este botón abre un modal'  
            }
        },
        {
            element: "#cambios-rio",
            popover:{
                title: 'Modal',
                description: 'Este modal muestra la información de la localización especifica'  
            }
        },
        {
            element: "#actores-acciones",
            popover:{
                title: 'Modal',
                description: 'Este modal muestra la información de la localización especifica'  
            }
        },
        {
            element: "#actores-poderes",
            popover:{
                title: 'Modal',
                description: 'Este modal muestra la información de la localización especifica'  
            }
        },
        {
            element: "#acerca-de",
            popover:{
                title: 'Modal',
                description: 'Este modal muestra la información de la localización especifica'  
            }
        },
        {
            element: "#creditos",
            popover:{
                title: 'Modal',
                description: 'Este modal muestra la información de la localización especifica'  
            }
        },
        {
            element: "#toggle-button",
            popover:{
                title: 'Modal',
                description: 'Este modal muestra la información de la localización especifica'  
            }
        },
        {
            element: "#purace",
            popover:{
                title: 'Modal',
                description: 'Este modal muestra la información de la localización especifica'  
            }
        },
        {
            element: "#modal",
            popover:{
                title: 'Modal',
                description: 'Este modal muestra la información de la localización especifica'  
            }
        },

    ]
});


export default driverObj;
