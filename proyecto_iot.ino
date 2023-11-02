#include <WiFi.h>
#include <ESP32Ping.h>
#include "config.h"

#define LED 2 // Pin del led

const int max_devices = 13; // Cantidad maxima de dispositivos en la red
int allowed_ips[] = {2}; // IPs de los dispositivos que pueden encender el led, solo el útlimo valor es relevante
bool online_devices[max_devices] = {false}; // Arreglo de booleanos que indica si el dispositivo con esa IP está conectado
bool led_on = false; // Indica si el led está encendido o no

void find_connected_devices(){
  // Función que busca los dispositivos conectados a la red y actualiza el arreglo online_devices
 bool ret;
  for (int i = 1; i <= max_devices; i++) {
    IPAddress ip (ip_surname[0], ip_surname[1], ip_surname[2], i);
    ret = Ping.ping(ip, 2); //Se realizan 2 ping a la IP
    online_devices[i-1] = ret;
    if (ret) {
      Serial.print("Success: ");
      Serial.println(ip);
    } else {
      Serial.print("Error: ");
      Serial.println(ip);
    }
  } 
}

void switch_led_if_any_allowed_connected(){
  // Función que revisa si alguno de los dispositivos con IP en allowed_ips está conectado y enciende el led
  for(int ip : allowed_ips){
    if(online_devices[ip-1]){
      digitalWrite(LED, HIGH);
      Serial.println("LED ON");
      led_on = true;
      break;
    }
    digitalWrite(LED, LOW);
    Serial.println("LED OFF");
    led_on = false;
  }
}

void printArrayBool(bool a[], int n){
  Serial.print("{");
  for(int i=0; i<n; i++){
    Serial.print(a[i]);
    Serial.print(", ");
  }
  Serial.println("}");
}

void setup() {
  Serial.begin(115200);

  pinMode(LED, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }

  find_connected_devices();
  
  
  

}

void loop() {

  printArrayBool(online_devices, max_devices);

  switch_led_if_any_allowed_connected();

  delay(1000);
  find_connected_devices();

}
