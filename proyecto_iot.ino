#include <WiFi.h>
#include <ArduinoJson.h>
#include <ESP32Ping.h>
#include "config.h"
#include <ESPmDNS.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <HTTPClient.h>
#include <vector>

#define LED 18
#define LED2 19
#define LED3 21

const int max_devices = 13;
int allowed_ips[] = {2};
bool online_devices[max_devices] = {false};
bool led_on = false;
String ip_local="";
std::vector<String> successful_ips;
String my_device = ""; // Variable que almacenará la IP de 'my_device'


AsyncWebServer server(80);

void find_connected_devices() {
  bool ret;
  std::vector<String> current_successful_ips;
  HTTPClient http;
  http.begin("http://192.168.0.7:3000/api/v1/devices");  
  int httpCode = http.GET();

    String payload = http.getString();
    Serial.println(payload);
    
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, payload);




  for (int i = 1; i <= max_devices; i++) {
    IPAddress ip(ip_surname[0], ip_surname[1], ip_surname[2], i);
    ret = Ping.ping(ip, 2);
    online_devices[i - 1] = ret;
    String ipStr = ip.toString();
    if (ret) {
      Serial.print("Success: ");
      Serial.println(ipStr);
      current_successful_ips.push_back(ipStr);

      for (JsonObject device : doc.as<JsonArray>()) {
        String ipv4 = device["IPV4"].as<String>();
        int pin = device["ESP_PIN"];
        IPAddress ip;
        ip.fromString(ipv4);
        
        if (ip.toString() == ipStr) {
          digitalWrite(pin, HIGH);  // Enciende el LED
          break;
        }
    }

    } else {
      Serial.print("Error: ");
      Serial.println(ipStr);

      for (JsonObject device : doc.as<JsonArray>()) {
        String ipv4 = device["IPV4"].as<String>();
        int pin = device["ESP_PIN"];
        IPAddress ip;
        ip.fromString(ipv4);
        
        if (ip.toString() == ipStr) {
          digitalWrite(pin, LOW);  // Enciende el LED
          break;
        }
    }
    }
  }

  // Actualizar successful_ips con las IPs que tuvieron éxito
  successful_ips = current_successful_ips;
}




void handle_my_device_led() {
  bool my_device_found = std::find(successful_ips.begin(), successful_ips.end(), my_device) != successful_ips.end();
  
  if (my_device_found && !led_on) {
    digitalWrite(LED, HIGH);
    Serial.println("LED ON due to my_device");
    led_on = true;
  } else if (!my_device_found && led_on) {
    digitalWrite(LED, LOW);
    Serial.println("LED OFF due to my_device");
    led_on = false;
  }
}


void switch_led_if_any_allowed_connected()
{
  for (int ip : allowed_ips)
  {
    if (online_devices[ip - 1])
    {
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

void printArrayBool(bool a[], int n)
{
  Serial.print("{");
  for (int i = 0; i < n; i++)
  {
    Serial.print(a[i]);
    Serial.print(", ");
  }
  Serial.println("}");
}

void setup()
{
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  
  if(!SPIFFS.begin()){
    Serial.println("Error al montar SPIFFS");
    return;
  }
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
  Serial.print("ESP32 IP Address: ");
  
  Serial.println(WiFi.localIP());  // Imprime la dirección IP del ESP32


    // Ruta para cargar el archivo index.html
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html",String(), false);
  });
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
            request->send(SPIFFS, "/style.css", "text/css");
            });     



  server.on("/getDevicesStatus", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<256> jsonDoc;
    
    JsonArray successfulIpsArray = jsonDoc.createNestedArray("successful_ips");

    for (const String &ip : successful_ips) {
        successfulIpsArray.add(ip);
    }
    
    jsonDoc["led_on"] = led_on;

    String response;
    serializeJson(jsonDoc, response);
    request->send(200, "application/json", response);
  });

server.on("/setMyDevice", HTTP_POST, [](AsyncWebServerRequest *request){
  if (request->hasParam("ip", true)) {
    AsyncWebParameter* p = request->getParam("ip", true);
    my_device = p->value();
    request->send(200, "text/plain", "IP set successfully");
  } else {
    request->send(400, "text/plain", "No IP provided");
  }
});


    

  server.on("/turnOn", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    digitalWrite(LED, HIGH);
    led_on = true;
    request->send(200, "application/json", "{\"led_on\":true}"); });

  server.on("/turnOff", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    digitalWrite(LED, LOW);
    led_on = false;
    request->send(200, "application/json", "{\"led_on\":false}"); });


  server.on("/turnOn2", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    digitalWrite(LED2, HIGH);
    led_on = true;
    request->send(200, "application/json", "{\"led_on\":true}"); });

  server.on("/turnOff2", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    digitalWrite(LED2, LOW);
    led_on = false;
    request->send(200, "application/json", "{\"led_on\":false}"); });



      server.on("/turnOn3", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    digitalWrite(LED3, HIGH);
    led_on = true;
    request->send(200, "application/json", "{\"led_on\":true}"); });

  server.on("/turnOff3", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    digitalWrite(LED3, LOW);
    led_on = false;
    request->send(200, "application/json", "{\"led_on\":false}"); });






  server.on("/assets/1.svg", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/assets/1.svg", "image/svg");
  });

  server.begin();
}

void loop(){
  printArrayBool(online_devices, max_devices);
  find_connected_devices();
  handle_my_device_led();
}
