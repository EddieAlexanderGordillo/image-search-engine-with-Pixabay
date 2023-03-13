const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener('submit', validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();
  const terminoBusqueda = document.querySelector('#termino').value;
  if (terminoBusqueda === '') {
    mostrarAlerta('Agrega un término de busqueda');
    return;
  }
  buscarImagenes();
}
function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector('.alertas');
  if (!existeAlerta) {
    const alertas = document.createElement('p');
    alertas.classList.add('alerta__error');
    alertas.innerHTML = `
        <strong class="alerta">Error! </strong>
        <span class="bv">${mensaje}</span>
        `;
    formulario.appendChild(alertas);
    setTimeout(() => {
      alertas.remove();
    }, 3000);
  }
}

async function buscarImagenes() {
  const termino = document.querySelector('#termino').value;
  const key = '34242519-8750e7dc97091d192b31e81bc';
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    totalPaginas = calcularPaginas(resultado.totalHits);
    mostrarImagenes(resultado.hits);
  } catch (error) {
    console.log(error);
  }
}
// generador que va registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}
function mostrarImagenes(imagenes) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
  //   iterar sobre arreglo de imagenes y construir html
  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;
    resultado.innerHTML += `
    <div class="contenedor-card">
        <div class="card">

            <img class="card__imagen" src="${previewURL}" alt="">
            <div class="contenedor-card__info">
                <p class="card__info">${likes}: <span class="card__info--bold">Me Gusta</span></p>
                <p class="card__info">${views}: <span class="card__info--bold">Veces Vista</span></p>
                <a class="btn__ver-imagen" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen</a>
            </div>
        </div>

    </div>
    `;
  });
  //   limpiar el paginador previo
  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }
  //   generar el html
  imprimirPaginador();
}
function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  while (true) {
    const { value, done } = iterador.next();
    if (done) return;
    // caso contrario, genera un boton por cada elemento en el generador
    const boton = document.createElement('a');
    boton.href = '#';
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add('siguiente');
    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };
    paginacionDiv.appendChild(boton);
  }
}
function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registroPorPagina));
}
