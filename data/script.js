function obtenerFechaHora() {
    const ahora = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    return ahora.toLocaleDateString('es-ES', opciones);
}

function actualizarFechaHora() {
    const fechaHoraElemento = document.getElementById('fecha-hora');
    if (fechaHoraElemento) {
        fechaHoraElemento.textContent = "Fecha y Hora: " + obtenerFechaHora();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
});
