# Proyecto de Control de Foco y Escaneo de Red con ESP32
Este proyecto utiliza un módulo ESP32 para crear un servidor web en una red WiFi local. Permite escanear los dispositivos presentes en la red, controlar el encendido y apagado de un foco y gestionar la seguridad de los dispositivos que intentan acceder.

![ESP32](https://m.media-amazon.com/images/I/611SuZX5oYL._AC_UF1000,1000_QL80_.jpg)

## Características
- **Carpeta data**: Contiene el archivo `index.html` que se sirve al cliente para mostrar la interfaz de usuario.
- **Escaneo de Red WiFi**: El ESP32 escanea la red local y muestra los dispositivos conectados.
- **Control de Foco**: Permite encender y apagar un foco de forma remota a través de la interfaz web.
- **Seguridad**: Solo los dispositivos identificados previamente pueden acceder y realizar acciones.
- **Uso de Arduino**: Todo el código está escrito utilizando el entorno de desarrollo de Arduino.

## Pre-requisitos
Antes de comenzar, asegúrate de tener lo siguiente:
- **Placa ESP32**: Puedes comprarla [aquí](https://www.amazon.com).
- **Entorno de desarrollo Arduino**: Instalado y configurado para el ESP32.
- **Foco y Relay**: Para el control del encendido y apagado del foco.

## Configuración y Uso
### Carpeta Data
La carpeta `data` contiene el archivo `index.html` que es la interfaz de usuario. Este archivo debe ser cargado en el sistema de archivos SPIFFS del ESP32.

### Escaneo de Red
El ESP32 escanea la red WiFi y lista los dispositivos conectados mostrándolos en la interfaz web.


### Control de Foco
Desde la interfaz web, se puede encender o apagar un foco conectado a un relay.


### Seguridad
Sólo los dispositivos previamente identificados pueden acceder al servidor y controlar el foco.

### Código Arduino
Utiliza el IDE de Arduino para programar el ESP32. Deberás incluir las bibliotecas necesarias para manejar WiFi, servidor web y el sistema de archivos SPIFFS.

## Notas Adicionales
_2023/11/01_

Para que pueda funcionar apropiadamente se debe crear un archivo config.h con la siguiente información:

```
#define WIFI_SSID "ssid_de_tu_red"
#define WIFI_PASSWORD "contraseña_de_tu_red"
const int ip_surname[3] = {192, 168, 0}; // Los primeros 3 octetos de la IP de tu red
```

De momento se debe fijar de antemano los ip de los dispositivos que tienen autorizacion para controlar el foco. Para ello se debe modificar la variable `allowed_ips` en el archivo `proyecto_iot.ino` con el último octeto del ip de los dispositivos autorizados.

Dado que el programa utiliza el protocolo ping para verificar si los dispositivos están conectados a la red, es necesario que el router tenga habilitado el protocolo ICMP. **Nótese que esto tiene un efecto que demora considerablemente el tiempo entre que un dispositivo se conecta y el ESP32 se enciende**. En el peor de los casos no hay ningún dispositivo conectado más que el router y cada solicitud tiene una demora máxima. Por ejemplo, si se tienen 255 dispositivos conectados, el tiempo máximo de espera es de 255 segundos (4.25 minutos) Por instancia de ping. 
