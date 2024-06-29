// pegada al json que trae el array general de todos los productos
const productosJson = async () => {
    const response = await fetch('./json/productos.json')
    const productos = await response.json()
    general(productos)
}
productosJson()

function general(productos) {
    //array del carrito
    let carrito = []

    document.addEventListener('DOMContentLoaded', () => {
        carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        sumElementCarrito()
    });

    const addToCarrito = (prod) => {
        let dataCarrito;
        const existData = carrito.find(data => data.id === prod.id)

        if (existData && existData.cantidad >= existData.stock) {
            window.Swal.fire({
                icon: 'error',
                title: 'No hay suficiente stock',
                confirmButtonColor: '#000000',
            })
            return
        }

        if (existData) {
            carrito.pop(existData)
            dataCarrito = {
                ...existData,
                cantidad: existData.cantidad + 1
            }
        } else {
            dataCarrito = {
                ...prod,
                cantidad: 1
            }
        }
        carrito.push(dataCarrito)
        window.localStorage.setItem("carrito", JSON.stringify(carrito))

        const sumTotal = carrito.reduce((acc, currentV) => acc + currentV.precio * currentV.cantidad, 0)
        window.localStorage.setItem("sumTotal", JSON.stringify(sumTotal))
        sumElementCarrito()

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Se agrego el producto'
        })
    }

    const sumElementCarrito = () => {
        const cantCarrito = document.getElementById("carritoContenedor")
        document.getElementById('precioTotal').innerHTML = JSON.parse(window.localStorage.getItem("sumTotal"))
        const cantElementInCarrito = JSON.parse(window.localStorage.getItem("carrito"))
        cantCarrito.innerHTML = `${cantElementInCarrito?.length ? cantElementInCarrito.length : 0}`
    }

    //funcion general para renderizar productos
    const renderProducts = (productsRendered) => {
        const containerProductos = document.getElementById("container-productos");
        containerProductos.innerHTML = ''
        productsRendered.map((producto) => {
            const {
                id,
                nombre,
                precio,
                img,
            } = producto
            let cardProduct = document.createElement("div");
            cardProduct.className = "card-Item";
            cardProduct.innerHTML = `
                <h3>${nombre}</h3>
                <div class="precio-boton"><p>$${precio}</p>
                <br><button id=${id} class="boton-comprar">Comprar</button></div>
                <img src="${img}">`;

            containerProductos.appendChild(cardProduct);
            const element = document.getElementById(`${producto.id}`)
            element.addEventListener("click", () => addToCarrito(producto))
        });
    }

    renderProducts(productos)

    //funcion boton productos para renderizar todos los productos de nuevo
    const botonProductos = document.getElementById("boton-productos")
    botonProductos.addEventListener("click", productosGenerales)

    function productosGenerales() {
        renderProducts(productos)
    }

    // filtrar con el buscador
    const buttonSearch = document.getElementById("boton-search")
    const inputSearch = document.getElementById("input-search")

    const filtrar = (e) => {

        const containerProductos = document.getElementById("container-productos");
        const textoIngresado = inputSearch.value.toLowerCase()
        containerProductos.innerHTML = ''
        for (const producto of productos) {
            let nombre = producto.nombre.toLocaleLowerCase()

            if (nombre.indexOf(textoIngresado) !== -1) {
                const {
                    id,
                    nombre,
                    precio,
                    img,
                } = producto
                let cardProduct = document.createElement("div");
                cardProduct.className = "card-Item";
                cardProduct.innerHTML = `
                <h3>${nombre}</h3>
                <div class="precio-boton"><p>$${precio}</p>
                <br><button id=${id} class="boton-comprar">Comprar</button></div>
                <img src="${img}">`;

                containerProductos.appendChild(cardProduct);
                const element = document.getElementById(`${producto.id}`)
                element.addEventListener("click", () => addToCarrito(producto))
            }
        }
        if (containerProductos.innerHTML === '') {
            containerProductos.innerHTML = `
                <span>No se encontraron productos...</span>`
            window.Swal.fire({
                icon: 'error',
                title: 'No se encontro el producto',
                confirmButtonColor: '#000000',
            })
        }

        e.preventDefault();
    }
    buttonSearch.addEventListener("click", filtrar)

    //Filtrado de productos por categoria
    const memoriasRam = productos.filter((producto) => producto.categoria.includes("memoriasRam"))
    const placasDeVideo = productos.filter((producto) => producto.categoria.includes("placasDeVideo"))
    const mothers = productos.filter((producto) => producto.categoria.includes("mothers"))
    const gabinetes = productos.filter((producto) => producto.categoria.includes("gabinetes"))
    const fuentes = productos.filter((producto) => producto.categoria.includes("fuentes"))
    const procesadoresAmd = productos.filter((producto) => producto.categoria.includes("procesadoresAmd"))
    const procesadoresIntel = productos.filter((producto) => producto.categoria.includes("procesadoresIntel"))

    // boton filtrado de Memorias Ram
    const botonFilterMemoria = document.getElementById("filter-memorias")
    botonFilterMemoria.addEventListener("click", respuestaClick)

    function respuestaClick() {
        renderProducts(memoriasRam)
    }

    // boton filtrado de Placas de video
    const botonFilterPlacasDeVideo = document.getElementById("filter-placas-de-video")
    botonFilterPlacasDeVideo.addEventListener("click", respuestaBotonPlacas)

    function respuestaBotonPlacas() {
        renderProducts(placasDeVideo)
    }
    // boton filtrado de Mothers
    const botonFilterMothers = document.getElementById("filter-mothers")
    botonFilterMothers.addEventListener("click", respuestaBotonMothers)

    function respuestaBotonMothers() {
        renderProducts(mothers)
    }
    // boton filtrado de Gabinetes
    const botonFilterGabinetes = document.getElementById("filter-gabinetes")
    botonFilterGabinetes.addEventListener("click", respuestaBotonGabinetes)

    function respuestaBotonGabinetes() {
        renderProducts(gabinetes)
    }
    // boton filtrado de Fuentes
    const botonFilterFuentes = document.getElementById("filter-fuentes")
    botonFilterFuentes.addEventListener("click", respuestaBotonFuentes)

    function respuestaBotonFuentes() {
        renderProducts(fuentes)
    }
    // boton filtrado de Procesador AMD
    const botonFilterProcesadorAmd = document.getElementById("filter-procesadores-amd")
    botonFilterProcesadorAmd.addEventListener("click", respuestaBotonProcesadoresAmd)

    function respuestaBotonProcesadoresAmd() {
        renderProducts(procesadoresAmd)
    }
    // boton filtrado de Procesador Intel
    const botonFilterProcesadorIntel = document.getElementById("filter-procesadores-intel")
    botonFilterProcesadorIntel.addEventListener("click", respuestaBotonProcesadoresIntel)

    function respuestaBotonProcesadoresIntel() {
        renderProducts(procesadoresIntel)
    }

    const renderElementCarrito = () => {
        const storageCarrito = JSON.parse(window.localStorage.carrito);
        const containerProductos = document.getElementById("container-modal");
        containerProductos.innerHTML = ''
        storageCarrito.map((producto) => {
            const {
                id,
                nombre,
                precio,
                cantidad,
                img,
            } = producto
            let cardProduct = document.createElement("div");
            cardProduct.className = "card-Item";
            cardProduct.innerHTML = `
            <h3>${nombre}</h3>
            <div class="precio-boton">
            <p>$${precio}</p>
            <p>cantidad a comprar: ${cantidad} </p>
            </div>
            <img src="${img}">`;
            containerProductos.appendChild(cardProduct);
        })
    }

    const cleanDOMCarrito = () => {
        const containerProductos = document.getElementById("container-modal");
        containerProductos.innerHTML = ''
    }

    const clearStorageCarrito = () => {
        carrito = []
        window.localStorage.clear()
        cleanDOMCarrito()
        sumElementCarrito()
    }


    const buttonCarro = document.getElementById("carritoContenedor")
    buttonCarro.addEventListener("click", renderElementCarrito)

    const vaciarCarrito = document.getElementById("boton-vaciar-carrito")
    vaciarCarrito.addEventListener("click", clearStorageCarrito)

    const inputFooter = document.getElementById("exampleInputEmail1")
    const botonSubmitFooter = document.getElementById("boton-submit-footer")
    botonSubmitFooter.addEventListener("click", registrarMailOfertas)

    function registrarMailOfertas() {
        if (/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(inputFooter.value)) {
            window.Swal.fire({
                icon: 'success',
                title: 'Se registro correctamente',
                confirmButtonColor: '#000000',
            })
        } else {
            window.Swal.fire({
                icon: 'error',
                title: 'No has ingresado ningun mail',
                confirmButtonColor: '#000000',
            })
        }
    }
}