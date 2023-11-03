#include <WiFi.h>
#include <ArduinoJson.h>
#include <ESP32Ping.h>
#include "config.h"
#include <ESPmDNS.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#define LED 2

const int max_devices = 13;
int allowed_ips[] = {2};
bool online_devices[max_devices] = {false};
bool led_on = false;
String ip_local="";

AsyncWebServer server(80);

void find_connected_devices()
{
  bool ret;
  for (int i = 1; i <= max_devices; i++)
  {
    IPAddress ip(ip_surname[0], ip_surname[1], ip_surname[2], i);
    ret = Ping.ping(ip, 2);
    online_devices[i - 1] = ret;
    if (ret)
    {
      Serial.print("Success: ");
      Serial.print(ip);
      
      char host[16];
      sprintf(host, "%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3]);
      char resolved_name[32] = {0};
      if(WiFi.hostByName(host, ip)) {
        Serial.print(", Nombre de Host: ");
        Serial.println(host);
      } else {
        Serial.println(", No se pudo resolver el nombre de Host");
      }
    }
    else
    {
      Serial.print("Error: ");
      Serial.println(ip);
    }
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

  find_connected_devices();

    // Ruta para cargar el archivo index.html
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html",String(), false);
  });
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
            request->send(SPIFFS, "/style.css", "text/css");
            });     

  server.on("/getDevicesStatus", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    find_connected_devices();
    switch_led_if_any_allowed_connected();
    
    StaticJsonDocument<256> jsonDoc;
    jsonDoc["online_devices"] = online_devices;
    jsonDoc["led_on"] = led_on;

    String response;
    serializeJson(jsonDoc, response);
    request->send(200, "application/json", response); });

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

  server.begin();
}

void loop()
{
  printArrayBool(online_devices, max_devices);
  delay(1000);
  find_connected_devices();
}
