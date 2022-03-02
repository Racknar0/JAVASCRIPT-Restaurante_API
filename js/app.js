let cliente = {
    mesa: '',
    hora: '',
    pedido: [],
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres',
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //! VALDATION METHOD
    const camposVacios = [mesa, hora].some((campo) => campo === '');

    if (camposVacios) {
        //!verificar alerta
        const existeAlerta = document.querySelector('.invalid-feedback');

        if (!existeAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son Obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
        return;
    }

    //! asignar datos form a cliente
    cliente = { ...cliente, mesa, hora };

    //! ocultar mondal
    const modalFormulario = document.querySelector('#formulario');
    const modalBoostrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBoostrap.hide();

    //!mostrar las secciones
    mostrarSecciones();

    //!Obtener platillos API Json Server
    obtenerPlatillos();
}

function mostrarSecciones() {
    const seccionesOculas = document.querySelectorAll('.d-none');
    seccionesOculas.forEach((seccion) => {
        seccion.classList.remove('d-none');
    });
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPlatillos(resultado))
        .catch((error) => console.log(error));
}

function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach((platillo) => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3', 'fw-bold');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //! fn que detecta cantidad y platillo
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);

            agregarPlatillo({ ...platillo, cantidad }); //! spread para crear obj+cantidad junto
        };

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    });
}

function agregarPlatillo(producto) {
    let { pedido } = cliente;

    //Revisar que la cantidad es mayor a 0
    if (producto.cantidad > 0) {
        //Comprueba si el elemento ya existe en el array
        if (pedido.some((articulo) => articulo.id === producto.id)) {
            //El articulo existe se actualiza la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if ( articulo.id === producto.id ) {
                    articulo.cantidad = producto.cantidad
                }
                return articulo;
            } );
            //Se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            //El articulo no existe se agrega al array de pedido
            cliente.pedido = [...pedido, producto];
        }
    } else {
        //Eliminar elementos cuando la cantidad es cero
        const resultado = pedido.filter( articulo => articulo.id !== producto.id );
        cliente.pedido = [...resultado]
    }

    //Limpiar HTML previo
    limpiarHTML();

    //Mostrar el Resumen
    actualizarResumen();
}


function actualizarResumen() {
    const contenido  = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    //informacion de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold')

    mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //informacion de la hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold')

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //Agregar a elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    // Titulo de la secciones
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos

    //Agregar el contenido
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);

    contenido.appendChild(resumen);
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido')

    while ( contenido.firstChild ){
        contenido.removeChild(contenido.firstChild)
    }
}