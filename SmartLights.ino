#include <WiFi.h>
#include <ESP32Ping.h>
#include "config.h"

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }

  IPAddress ip (192, 168, 0, 8);
  bool ret = Ping.ping(ip);

  if(!ret){
    Serial.println("Ping failed");
    return;
  }

  Serial.println("Ping successful");

}

void loop() {
  // put your main code here, to run repeatedly:

}
