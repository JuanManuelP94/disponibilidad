// ===============================
// ALMACENAMIENTO DE HORARIOS
// ===============================
const horarios = {
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
    domingo: []
};

// ===============================
// MOSTRAR / OCULTAR FORMULARIO DE AGREGAR HORARIOS
// ===============================
function abrirFormDia(dia) {
    const solapa = document.getElementById(`form-${dia}`);
    solapa.classList.toggle("d-none");
}

// ===============================
// GUARDAR HORARIO
// ===============================
function guardarHorario(dia) {
    const desde = document.getElementById(`${dia}-desde`).value;
    const hasta = document.getElementById(`${dia}-hasta`).value;

    // Validación básica
    if (!desde || !hasta) {
        alert("Tenés que completar ambas horas");
        return;
    }

    if (desde >= hasta) {
        alert("La hora 'desde' debe ser menor que 'hasta'");
        return;
    }

    // Guardamos en el array
    horarios[dia].push({ desde, hasta });

    // Dibujar en la pantalla
    dibujarHorarios(dia);

    // Limpiar inputs
    document.getElementById(`${dia}-desde`).value = "";
    document.getElementById(`${dia}-hasta`).value = "";

    // Cerrar solapa
    document.getElementById(`form-${dia}`).classList.add("d-none");
}

// ===============================
// DIBUJAR LISTA DE HORARIOS
// ===============================
function dibujarHorarios(dia) {
    const lista = document.getElementById(`lista-${dia}`);
    lista.innerHTML = ""; // Limpiar antes de redibujar

    horarios[dia].forEach((hora, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        li.innerHTML = `
            ${hora.desde} - ${hora.hasta}
            <button class="btn btn-danger btn-sm" onclick="eliminarHorario('${dia}', ${index})">Eliminar</button>
        `;

        lista.appendChild(li);
    });
}

// ===============================
// ELIMINAR HORARIO
// ===============================
function eliminarHorario(dia, index) {
    horarios[dia].splice(index, 1);
    dibujarHorarios(dia);
}

// ===============================
// ENVIAR TODO AL SPREADSHEET
// ===============================
function enviarFormulario() {
    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();

    if (!codigo || !nombre) {
        alert("Completá código y nombre antes de enviar.");
        return;
    }

    // Convertir días a fechas reales
    const fechas = {
        lunes: "2025-12-15",
        martes: "2025-12-16",
        miercoles: "2025-12-17",
        jueves: "2025-12-18",
        viernes: "2025-12-19",
        sabado: "2025-12-20",
        domingo: "2025-12-21"
    };

    // Armar paquete final
    const paquete = [];

    for (let dia in horarios) {
        horarios[dia].forEach(hora => {
            paquete.push({
                codigo,
                nombre,
                fecha: fechas[dia],
                desde: hora.desde,
                hasta: hora.hasta
            });
        });
    }

    if (paquete.length === 0) {
        alert("No agregaste ningún horario.");
        return;
    }

    console.log("DATOS A ENVIAR:", paquete);

    // FETCH para enviar al Apps Script (cuando tengas la URL la pegamos acá)
    
    fetch("https://script.google.com/macros/s/AKfycbwQ3gXGEHBmxV8QLd8M17QDWVhaVEgaezt52qcOVzmEskYkgW1_dCunHaMff75LSk5UoA/exec", {
        method: "POST",
        body: JSON.stringify(paquete)
    })
    .then(res => res.text())
    .then(r => {
        if (r === "OK") {
            alert("Datos enviados correctamente!");
            location.reload();
        } else if (r === "CODIGO_INVALIDO") {
            alert("Código incorrecto. No se registró nada.");
        } else {
            alert("Error inesperado: " + r);
        }
    })
    .catch(err => alert("No se pudo conectar con el servidor."));
    
}


