const usuarios = [{
    nombre: 'Evangelina',
    mail: 'eva@mail.com',
    pass: '123456'
},
{
    nombre: 'Agustin',
    mail: 'agus@mail.com',
    pass: '987654'
},
{
    nombre: 'Marta',
    mail: 'martita25@mail.com',
    pass: 'Hola456'
},{
    nombre: 'Mariana',
    mail: 'marianabs@mail.com',
    pass: 'SoyColoreit'
}]

class Producto {

    constructor(nombre, genero, edad, categoria, precio, imagen, id){
        this.nombre = nombre;
        this.genero = genero;
        this.edad = edad;
        this.categoria= categoria;
        this.precio = parseFloat(precio);
        this.imagen = imagen;
        this.id = id;
    }

    asignarId(array){
        this.id = array.length;
    }
}

let productos;

const mailLogin = document.getElementById("emailLogin"),
    passLogin = document.getElementById("passwordLogin"),
    recordar = document.getElementById("recordarme"),
    btnLogin = document.getElementById("login"),
    modalEl = document.getElementById("modalLogin"),
    modal = new bootstrap.Modal(modalEl),
    toggles = document.querySelectorAll(".toggles"),
    contenedorTarjetas = document.querySelector(".contenedorTarjetas");

function validarUsuario(usersBD, user, pass) {
    let encontrado = usersBD.find((userBD) => userBD.mail == user);
    
    if (typeof encontrado === "undefined") {
        return false;
    } else {
        if (encontrado.pass != pass) {
            return false;
        } else {
            return encontrado;
        }
    }
}

function guardarDatos(usuarioBD, storage) {
    const usuario = {
        "name": usuarioBD.nombre,
        "user": usuarioBD.mail,
        "pass": usuarioBD.pass
    }
    storage.setItem("usuario", JSON.stringify(usuario));
}

function saludar(usuario) {
    nombreUsuario.innerHTML = `Bienvenid@, <span>${usuario.name}</span>`
}

function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}

function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem("usuario"));
    return usuarioEnStorage;
}

function usuarioLogueado(usuario) {
    if (usuario) {
        saludar(usuario);
        crearTarjetas(productos, contenedorTarjetas);
        presentarInfo(toggles, "d-none");
    }
}

function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

//BUSQUEDA
function crearTarjetas (array, contenedor){
    contenedor.innerHTML="";
    for (const item of array) {
        let tarjeta = document.createElement('div');
        tarjeta.className = 'card my-5 bg-light';
        tarjeta.id = `${item.id}`;
        tarjeta.innerHTML = `
        <h4 class="card-header">${item.nombre}</h4>
        <img src="${item.imagen}" class="card-img-top imagenProducto" alt="${item.categoria}">
        <div class="card-body">
            <p class="card-text">Edad: ${item.edad}</p>
            <p class="card-text">Categoría: ${item.categoria}</p>
            <span id="precio">$ ${item.precio}</span>
        </div>
        <div class="card-footer"><a href="#" class="btn btn-primary">Comprar</a></div>`;
        contenedor.append(tarjeta)
    }
}

function buscar(array, criterio, input){
    return array.filter(item=>item[criterio].includes(input))
}

btnLogin.addEventListener("click", (e) => {
    e.preventDefault();

    if (!mailLogin.value || !passLogin.value) {
        alert('Todos los campos son requeridos');
    } else {

        let data = validarUsuario(usuarios, mailLogin.value, passLogin.value);

        if (!data) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario y/o contraseña incorrectos',
            });
        } else {

            if (recordar.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarUsuario(sessionStorage));
            }
            modal.hide();
            crearTarjetas(productos,contenedorTarjetas);
            presentarInfo(toggles, "d-none");
        }
    }
});

btnLogout.addEventListener("click", () => {
    borrarDatos();
    presentarInfo(toggles, "d-none");
});

function cargarJsonTarjetas() {
    fetch('./js/productos.json') //un json dentro del proyecto con la info en español
        .then((response) => response.json())
        .then((data) => {
            productos = data;
        })
}

window.onload = () => {
    cargarJsonTarjetas();
    usuarioLogueado(recuperarUsuario(localStorage));
}
let busqueda = document.querySelectorAll(".inputBusqueda");

busqueda.forEach(input=>{
    input.addEventListener("input",()=>{
        let cadena = (input.value).toUpperCase();
        crearTarjetas(buscar(productos,input.id,cadena),contenedorTarjetas);
        input.onblur=()=>{
            input.value="";
        }
    })
})
