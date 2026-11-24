// Practica 5: ADS1115 + temperature and humidity sensors, served as a web dashboard.
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

const char* WIFI_SSID = "Simge";
const char* WIFI_PASS = "YOUR_HOTSPOT_PASSWORD";

#define channelValue 0     // temperature sensor channel
#define humChannel 1       // humidity sensor channel (change if wired elsewhere)
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
float humedad = 0;

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

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  String realSsid = "";
  while (realSsid == "") {
    Serial.println("--- redes visibles ---");
    int n = WiFi.scanNetworks();
    for (int i = 0; i < n; i++) {
      Serial.print("["); Serial.print(WiFi.SSID(i)); Serial.println("]");
      if (WiFi.SSID(i).startsWith(WIFI_SSID)) realSsid = WiFi.SSID(i);
    }
    delay(3000);
  }
  Serial.println("Hotspot encontrado, conectando...");
  WiFi.begin(realSsid.c_str(), WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.print("\nIP: ");
  Serial.println(WiFi.localIP());

  server.on("/", []() { server.send_P(200, "text/html", INDEX_HTML); });
  server.on("/data", []() {
    char buf[80];
    snprintf(buf, sizeof(buf), "{\"temp\":%.1f,\"hum\":%.1f,\"name\":\"ADS1115\"}", temperatura, humedad);
    server.send(200, "application/json", buf);
  });
  server.begin();
}

void loop() {
  static unsigned long last = 0;
  server.handleClient();
  if (millis() - last < 1000) return;
  last = millis();

  // Humidity sensor needs GAIN_TWOTHIRDS; restore GAIN_ONE for the temperature reading.
  ads.setGain(GAIN_TWOTHIRDS);
  int16_t sensorValue = ads.readADC_SingleEnded(humChannel);
  ads.setGain(GAIN_ONE);
  humedad = constrain(0.0135 * (sensorValue - 18400), 0, 100);

  float adc0 = averageSample(ArrayLength, samples);
  float V0 = adc0 * Vmax / 32767.0;
  temperatura = (V0 - b) / m;

  Serial.print("Vd = ");
  Serial.print(adc0, 0);
  Serial.print("   V0 = ");
  Serial.print(V0, 3);
  Serial.print(" V   T = ");
  Serial.print(temperatura, 1);
  Serial.print(" C   Hum = ");
  Serial.print(humedad, 1);
  Serial.println(" %");

  digitalWrite(LED_20, temperatura >= 20 && temperatura < 40);
  digitalWrite(LED_40, temperatura >= 40 && temperatura < 60);
  digitalWrite(LED_60, temperatura >= 60);
}
