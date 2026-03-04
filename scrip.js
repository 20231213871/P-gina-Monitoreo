function mostrarMenu() {
    document.getElementById("pantalla1").style.display = "none";
    document.getElementById("pantalla2").style.display = "block";
}

function mostrarHardware() {
    document.getElementById("pantalla2").style.display = "none";
    document.getElementById("pantallaHardware").style.display = "block";
    iniciarRotacion(); // Inicia la rotación solo cuando entras a Hardware
}

function volverMenu() {
    document.getElementById("pantallaHardware").style.display = "none";
    document.getElementById("pantalla2").style.display = "block";
}

let imagenesSensor = [
    "img/sensor.1.jpg",
    "img/sensor.2.jpg",
    "img/sensor.3.jpg"
];

let indiceActual = 0;
let intervalo = null;

function iniciarRotacion() {
    if (intervalo !== null) return; // Evita duplicar intervalos
    
    intervalo = setInterval(() => {
        indiceActual++;
        if (indiceActual >= imagenesSensor.length) {
            indiceActual = 0;
        }
        document.getElementById("imagenSensor").src = imagenesSensor[indiceActual];
    }, 2000);
}

function mostrarAnalisis() {
    document.getElementById("pantalla2").style.display = "none";
    document.getElementById("pantallaAnalisis").style.display = "block";
}

function volverMenuDesdeAnalisis() {
    document.getElementById("pantallaAnalisis").style.display = "none";
    document.getElementById("pantalla2").style.display = "block";
}

document.getElementById("archivoCSV").addEventListener("change", function(event) {

    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function(e) {
        const contenido = e.target.result;
        procesarCSV(contenido);
    };

    lector.readAsText(archivo);
});


function procesarCSV(texto) {

    const filas = texto.trim().split("\n");

    let datos = [];

    filas.forEach(fila => {
        const columnas = fila.split(",");
        if (columnas.length === 2) {
            datos.push({
                hora: columnas[0].trim(),
                estado: parseInt(columnas[1].trim())
            });
        }
    });

    analizarEventos(datos);
    
    graficar(datos);

    mostrarDatos(datos);
}

function mostrarDatos(datos) {

    let tabla = `
        <table border="1" style="width:100%; margin-top:20px; color:white;">
            <tr>
                <th>Hora</th>
                <th>Estado</th>
            </tr>
    `;

    datos.forEach(dato => {
        tabla += `
            <tr>
                <td>${dato.hora}</td>
                <td>${dato.estado}</td>
            </tr>
        `;
    });

    tabla += "</table>";

    document.getElementById("resultado").innerHTML = tabla;
}

function analizarEventos(datos) {

    let aperturas = 0;
    let cierres = 0;

    for (let i = 1; i < datos.length; i++) {

        let anterior = datos[i - 1].estado;
        let actual = datos[i].estado;

        if (anterior === 1 && actual === 0) {
            aperturas++;
        }

        if (anterior === 0 && actual === 1) {
            cierres++;
        }
    }

    document.getElementById("metricas").innerHTML = `
        <p>Aperturas: <strong>${aperturas}</strong></p>
        <p>Cierres: <strong>${cierres}</strong></p>
    `;
}

function graficar(datos) {

    const ctx = document.getElementById('graficaEstado').getContext('2d');

    const tiempos = datos.map(d => d.hora);
    const estados = datos.map(d => d.estado);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [{
                label: 'Estado Puerta',
                data: estados,
                borderColor: '#C9A227',
                borderWidth: 2,
                fill: false,
                stepped: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: -1,
                    max: 2,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (value === -1) return "";
                            if (value === 0) return "Abierto";
                            if (value === 1) return "Cerrado";
                            if (value === 2) return "";
                        }
                    }
                }
            }
        }
    });
}

function mostrarInforme() {
    document.getElementById("pantalla2").style.display = "none";
    document.getElementById("pantallaInforme").style.display = "block";
}

function volverMenuDesdeInforme() {
    document.getElementById("pantallaInforme").style.display = "none";
    document.getElementById("pantalla2").style.display = "block";
}
