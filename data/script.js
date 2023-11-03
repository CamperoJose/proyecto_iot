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

document.addEventListener("DOMContentLoaded", function() {
    var btnOn = document.getElementById('btnOn');
    var btnOff = document.getElementById('btnOff');
    var btnScan = document.getElementById('btnScan');
    var tbody = document.getElementById('tbody');
    var ledStatus = document.getElementById('ledStatus');
    
    function turnOn() {
        fetch('http://IP_DEL_ESP32/turnOn')
            .then(response => response.json())
            .then(data => {
                updateLedStatus(data.led_on);
            })
            .catch(error => console.error('Error:', error));
    }

    function turnOff() {
        fetch('http://IP_DEL_ESP32/turnOff')
            .then(response => response.json())
            .then(data => {
                updateLedStatus(data.led_on);
            })
            .catch(error => console.error('Error:', error));
    }
    
    function scanNetwork() {
        fetch('http://IP_DEL_ESP32/getDevicesStatus')
            .then(response => response.json())
            .then(data => {
                updateTable(data.online_devices);
                updateLedStatus(data.led_on);
            })
            .catch(error => console.error('Error:', error));
    }
    
    function updateTable(devices) {
        tbody.innerHTML = "";
        for (var i = 0; i < devices.length; i++) {
            var tr = document.createElement('tr');
            var tdIP = document.createElement('td');
            var tdStatus = document.createElement('td');
            
            tdIP.textContent = "192.168.1." + (i+1);
            tdStatus.textContent = devices[i] ? "Conectado" : "Desconectado";
            
            tr.appendChild(tdIP);
            tr.appendChild(tdStatus);
            tbody.appendChild(tr);
        }
    }
    
    function updateLedStatus(isOn) {
        ledStatus.textContent = "El foco está: " + (isOn ? "Encendido" : "Apagado");
    }

    btnOn.addEventListener('click', turnOn);
    btnOff.addEventListener('click', turnOff);
    btnScan.addEventListener('click', scanNetwork);
});
