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
    /* const url = 'http://localhost:4000/platillos'; */
    const url = 'https://api.npoint.io/200fc36133534acbb1b2';

    fetch(url)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarPlatillos(resultado))
        .catch((error) => console.log(error));
}

function mostrarPlatillos(platillos) {
    
    const contenido = document.querySelector('#platillos .contenido');

    const platisho = platillos.platillos;

    platisho.forEach((platillo) => {
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

    if( cliente.pedido.length ) {
        //Mostrar el Resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }
}


function actualizarResumen() {
    const contenido  = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

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
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');
    const {pedido} = cliente;
    pedido.forEach( articulo => {
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;


        //Cantidad del articulo
        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN')
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;


        //Precio del articulo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN')
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;


        //Subtotal del articulo
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN')
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);        

        //Boton para Eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';
        
        //Función para eliminar del pedido
        btnEliminar.onclick = function ( ) { 
            eliminarProducto(id)
        }

        //Agregar Valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);


        //Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);


        //Agregar lista al grupo PPAL
        grupo.appendChild(lista)

    });


    //Agregar el contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar Formulario de Propinas
    formularioPropinas();
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido')

    while ( contenido.firstChild ){
        contenido.removeChild(contenido.firstChild)
    }
}

function calcularSubtotal(precio, cantidad) {
    return `$${precio * cantidad}`;
}

function eliminarProducto(id){
    //Eliminar elementos cuando la cantidad es cero
    const { pedido } = cliente;
    const resultado = pedido.filter((articulo) => articulo.id !== id);
    cliente.pedido = [...resultado];

    //Limpiar HTML previo
    limpiarHTML();

    if( cliente.pedido.length ) {
        //Mostrar el Resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    // El producto se elimino regresar input a 0;
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;

    console.log(productoEliminado);
}

function mensajePedidoVacio () {
   const contenido = document.querySelector('#resumen .contenido');

   const texto = document.createElement('P');
   texto.classList.add('text-center');
   texto.textContent = 'Añade los elementos del pedido';

   contenido.appendChild(texto);
}

function formularioPropinas() {

    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';


    // Radio Button 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10.classList.add('form-check-label')

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);


    // Radio Button 25%
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25.classList.add('form-check-label')

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);
    

    // Radio Button 50%
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50.classList.add('form-check-label')

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);
    

    //Agregar al Div PPAL
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    //Agregar al Formulario
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);
}


function calcularPropina() {

    const { pedido } = cliente;
    let subTotal = 0;

    //calcular Subtotal a pagar
    pedido.forEach( articulo => {
        subTotal += articulo.cantidad * articulo.precio;
    }) 

    //Seleccionar Radio Button com propina
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    //Calcular la Propinas
    const propina = ((subTotal * parseInt(propinaSeleccionada)) / 100 )


    //Calcular el total

    const total = subTotal + propina;
    
    mostrarTotalHTML(subTotal ,total ,propina);

}


function mostrarTotalHTML(subTotal ,total ,propina) {

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar','my-5');

    //Subtotal
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subTotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina
    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    //Total
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total: ';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);


    //!Eliminar el ultimo Resultado
    const totalpagarDiv = document.querySelector('.total-pagar');
    if ( totalpagarDiv ) {
        totalpagarDiv.remove();
    }


    //Inyectar al DIV
    divTotales.appendChild(subtotalParrafo)
    divTotales.appendChild(propinaParrafo)
    divTotales.appendChild(totalParrafo)


    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}