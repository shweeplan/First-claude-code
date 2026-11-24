// Practica 5: ADS1115 + temperature sensor, served as a web dashboard.
// Open http://<IP printed in Serial Monitor>/ from a device on the same WiFi.
#include <Adafruit_ADS1X15.h>
#if defined(ESP32)
  #include <WiFi.h>
  #include <WebServer.h>
  WebServer server(80);
#else
  #include <ESP8266WiFi.h>
  #include <ESP8266WebServer.h>
  ESP8266WebServer server(80);
#endif
#include "index.h"

const char* WIFI_SSID = "YOUR_HOTSPOT_NAME";
const char* WIFI_PASS = "YOUR_HOTSPOT_PASSWORD";

#define channelValue 0
Adafruit_ADS1115 ads;

const float m = 0.03295;   // V/C
const float b = 0.7912;    // V
const float Vmax = 4.096;  // GAIN_ONE full scale

const int ArrayLength = 10;
int16_t samples[ArrayLength];

const int LED_20 = 4;
const int LED_40 = 12;
const int LED_60 = 13;

float temperatura = 0;

float averageSample(int ArrayLength, int16_t *samples) {
  long sum = 0;
  for (int i = 0; i < ArrayLength; i++) {
    samples[i] = ads.readADC_SingleEnded(channelValue);
    sum += samples[i];
  }
  return (float)sum / ArrayLength;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Inicializando el medidor de Temperatura");

  if (!ads.begin()) {
    Serial.println("ADS1115 not found. Check wiring.");
    while (1) delay(10);
  }
  ads.setGain(GAIN_ONE);

  pinMode(LED_20, OUTPUT);
  pinMode(LED_40, OUTPUT);
  pinMode(LED_60, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.print("\nIP: ");
  Serial.println(WiFi.localIP());

  server.on("/", []() { server.send_P(200, "text/html", INDEX_HTML); });
  // No humidity sensor: "hum" is null, the page shows "--".
  server.on("/data", []() {
    char buf[64];
    snprintf(buf, sizeof(buf), "{\"temp\":%.1f,\"hum\":null,\"name\":\"ADS1115\"}", temperatura);
    server.send(200, "application/json", buf);
  });
  server.begin();
}

void loop() {
  static unsigned long last = 0;
  server.handleClient();
  if (millis() - last < 1000) return;
  last = millis();

  float adc0 = averageSample(ArrayLength, samples);
  float V0 = adc0 * Vmax / 32767.0;
  temperatura = (V0 - b) / m;

  Serial.print("Vd = ");
  Serial.print(adc0, 0);
  Serial.print("   V0 = ");
  Serial.print(V0, 3);
  Serial.print(" V   T = ");
  Serial.print(temperatura, 1);
  Serial.println(" C");

  digitalWrite(LED_20, temperatura >= 20 && temperatura < 40);
  digitalWrite(LED_40, temperatura >= 40 && temperatura < 60);
  digitalWrite(LED_60, temperatura >= 60);
}
