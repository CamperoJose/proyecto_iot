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
String my_device = ""; 
String my_ip_host_back = "172.20.10.6"; 


AsyncWebServer server(80);
String getCurrentDateTimeFromServer() {
  HTTPClient http;
  http.begin("http://172.20.10.6:3000/api/v1/currentDateTime");
  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();
    DynamicJsonDocument doc(256);
    deserializeJson(doc, payload);
    String datetime = doc["datetime"].as<String>();

    Serial.println("Datetime extraído: " + datetime);
    http.end();
    return datetime;
  } else {
    Serial.println("Error en la solicitud GET: " + String(httpCode));
    http.end();
    return "";
  }
}


void sendPostRequest(int ledId, int userId, const char* description) {
  HTTPClient http;
  http.begin("http://172.20.10.6:3000/api/v1/actions");
  http.addHeader("Content-Type", "application/json");

  DynamicJsonDocument doc(256);

  
  doc["description"] = description;
  doc["datetime"] = getCurrentDateTimeFromServer();
  doc["ledsLedId"] = ledId;
  doc["usersUserId"] = userId;

  String requestBody;
  serializeJson(doc, requestBody);

  int httpCode = http.POST(requestBody);

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println("Respuesta POST: " + payload);
  } else {
    Serial.println("Error en la solicitud POST: " + String(httpCode));
  }
  
  http.end();
}




void find_connected_devices() {
  bool ret;
  std::vector<String> current_successful_ips;
  HTTPClient http;
  http.begin("http://172.20.10.6:3000/api/v1/devices");  
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
    request->send(SPIFFS, "/dashboard.html",String(), false);
  });


  server.begin();
}

void loop(){

}
