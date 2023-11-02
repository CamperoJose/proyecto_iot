#include <WiFi.h>
#include <ESP32Ping.h>
#include "config.h"

const int max_devices = 20;
bool online_devices[max_devices] = {false};

void find_connected_devices(){
 bool ret;
  for (int i = 1; i < max_devices; i++) {
    IPAddress ip (ip_surname[0], ip_surname[1], ip_surname[2], i);
    ret = Ping.ping(ip, 2);
    online_devices[i] = ret;
    if (ret) {
      Serial.print("Success: ");
      Serial.println(ip);
    } else {
      Serial.print("Error: ");
      Serial.println(ip);
    }
  } 
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }

  find_connected_devices();
  
  
  

}

void loop() {
  // put your main code here, to run repeatedly:

}
