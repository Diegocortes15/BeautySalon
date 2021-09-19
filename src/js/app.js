let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: [],
};

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Reslata el Div Actual segun el tab al que se presiona
    mostrarSeccion();

    // Oculta o muestra la sección segun el tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina Actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // Muestra el resumen de la cita (o mensaje de error en caso de no pasar la validación)
    mostrarResumen();

    // Stores the name of the cita in the object
    nombreCita();

    // Stores date of the cita in the object
    fechaCita();

    // disables previous days
    desabilitarFechaAnterior();

    // Stores hour of the cita in the object
    horaCita();
}

function mostrarSeccion() {
    // Eliminar .mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de .actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        document.querySelector('.tabs .actual').classList.remove('actual');
    }

    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar la función de mostrar Sección
            mostrarSeccion();
            botonesPaginador();
        });
    });
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('../servicios.json');
        const db = await resultado.json();

        const { servicios } = db;
        //Generar el HMTL

        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            // DOM Scripting
            const nombreServicio = document.createElement('P');
            const precioServicio = document.createElement('P');

            nombreServicio.textContent = nombre;
            precioServicio.textContent = `$ ${precio}`;

            nombreServicio.classList.add('nombre-servicio');
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor del servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');

            //Parentar nombre y precio al contenedor servicioDiv
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            servicioDiv.dataset.idServicio = id;

            // Seleccionar un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //Parentar Servicio Div a Consola
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;

    // Forzar que el elemento al cual se le dio Click sea el DIV
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent,
        };

        //console.log(servicioObj);

        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id); // Bring all services than are different from the id taken
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen(); // We are page 3, load the summary of cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Clean previous HTML
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validación de Objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        // agregar a resumenDiv
        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    // Show Summary
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const servicioCita = document.createElement('DIV');
    servicioCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    servicioCita.appendChild(headingServicios);

    let cantidad = 0;

    // Iterate over the array of servicios
    servicios.forEach(servicio => {
        const { nombre, precio } = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenido-servicio');

        const nombreServicio = document.createElement('P');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        // place text and price in div
        contenedorServicio.appendChild(nombreServicio);
        contenedorServicio.appendChild(precioServicio);

        servicioCita.appendChild(contenedorServicio);
    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(servicioCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar:</span> $${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre No Valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            console.log(cita);
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    // if there is previous alert, then don't show a new
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    //Insert in HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Delete alert after 3 seconds
    setTimeout(() => {
        alerta.remove();
    }, 3000);

    console.log(alerta);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no son permitidos', 'error');
        } else {
            cita.fecha = fechaInput.value;
        }

        // const opciones = {
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long'
        // }

        // console.log(fechaTexto.toLocaleDateString('es-Es', opciones));
    });
}

function desabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const dia = fechaActual.getDate() + 1;

    //Desired format : AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;
    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;
        }
        console.log(horaCita);
    });
}
