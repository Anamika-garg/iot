#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#include <time.h>

#define DHTPIN 15
#define DHTTYPE DHT11

// -------- SENSOR PINS ----------
#define PIN_FLAME 23
#define PIN_MOTION 4
#define PIN_BUZZER 5
#define LDR_PIN 34
#define LED_PIN 2
#define LED_PIN_YELLOW 25

// LED pins
#define LED1 13
#define LED2 12
#define LED3 14
#define LED4 27
#define LED5 26

int ldrDigital = 0;
int lightThreshold = 1500;

// WiFi credentials
const char* ssid = "Anamika";
const char* password = "anamika29";

/* ThingSpeak configuration */
const char* serverName = "http://api.thingspeak.com/update";
String apiKey = "J7HWFZ4R9U442CRI";

unsigned long lastTimeESP = 0;
unsigned long timerDelay = 5000;

// Sensor values
float currentTemp = 0.0;
float currentHum = 0.0;
int flameDetected = 0;
int motionDetected = 0;
int ldrValue = 0;

// System states
bool buzzerEnabled = false;
bool lightState = false;
bool systemArmed = true;

DHT dht(DHTPIN, DHTTYPE);

WebServer server(80);

const long utcOffsetInSeconds = 19800;

// ---------- CORS OPTIONS HANDLER ----------
void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(204);  // No content
}

void handleRoot() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  String html = "<html><body><h1>Smart Monitoring System</h1></body></html>";
  server.send(200, "text/html", html);
}

String getTimestamp() {
  time_t now = time(nullptr);
  if (now < 100000) return "Time not synced";

  struct tm* timeinfo = localtime(&now);
  char buffer[50];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", timeinfo);
  return String(buffer);
}

void readSensors() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (!isnan(t)) currentTemp = t;
  if (!isnan(h)) currentHum = h;

  flameDetected = digitalRead(PIN_FLAME);
  motionDetected = digitalRead(PIN_MOTION);
  ldrValue = analogRead(LDR_PIN);
  ldrDigital = (ldrValue < lightThreshold) ? 1 : 0;

  if (systemArmed) {
    if (flameDetected == HIGH) {
      digitalWrite(PIN_BUZZER, HIGH);
      digitalWrite(LED_PIN, HIGH);
      lightState = true;
    } else if (motionDetected == HIGH) {
      digitalWrite(LED_PIN_YELLOW, HIGH);
      if (buzzerEnabled) digitalWrite(PIN_BUZZER, HIGH);
      lightState = true;
    } else {
      digitalWrite(LED_PIN_YELLOW, LOW);
      digitalWrite(LED_PIN, LOW);
      digitalWrite(PIN_BUZZER, LOW);
      lightState = false;
    }
  } else {
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(LED_PIN, LOW);
    digitalWrite(LED_PIN_YELLOW, LOW);
    lightState = false;
  }

  if (ldrDigital == 0) {
    digitalWrite(LED1, HIGH);
    digitalWrite(LED2, HIGH);
    digitalWrite(LED3, HIGH);
    digitalWrite(LED4, HIGH);
    digitalWrite(LED5, HIGH);
  } else {
    digitalWrite(LED1, LOW);
    digitalWrite(LED2, LOW);
    digitalWrite(LED3, LOW);
    digitalWrite(LED4, LOW);
    digitalWrite(LED5, LOW);
  }

  Serial.print("Timestamp: ");
  Serial.print(getTimestamp());
  Serial.print(" | Temp: ");
  Serial.print(currentTemp);
  Serial.print("°C | Hum: ");
  Serial.print(currentHum);
  Serial.print("% | Flame: ");
  Serial.print(flameDetected);
  Serial.print(" | Motion: ");
  Serial.print(motionDetected);
  Serial.print(" | LDR: ");
  Serial.print(ldrValue);
  Serial.print(" | LDR DIGITAL: ");
  Serial.println(ldrDigital);
  Serial.print(" | System Armed: ");
  Serial.println(systemArmed ? "YES" : "NO");
}

// ------------- API ENDPOINTS -------------

void apiUpdate() {
  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Sensors updated\"}");
}

void apiStatus() {
  server.sendHeader("Access-Control-Allow-Origin", "*");


  String json = "{";
  json += "\"temperature\":" + String(currentTemp, 2) + ",";
  json += "\"humidity\":" + String(currentHum, 2) + ",";
  json += "\"ldrValue\":" + String(ldrValue) + ",";
  json += "\"motionDetected\":" + String(motionDetected) + ",";
  json += "\"flameDetected\":" + String(flameDetected) + ",";
  json += "\"lightState\":" + String(lightState ? "true" : "false") + ",";
  json += "\"buzzerEnabled\":" + String(buzzerEnabled ? "true" : "false") + ",";
  json += "\"systemArmed\":" + String(systemArmed ? "true" : "false") + ",";
  json += "\"timestamp\":\"" + getTimestamp() + "\"";
  json += "}";

  server.send(200, "application/json", json);
}

void toggleLight() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  lightState = !lightState;
  digitalWrite(LED_PIN, lightState ? HIGH : LOW);

  String response = "{\"lightState\":\"" + String(lightState ? "ON" : "OFF") + "\"}";
  server.send(200, "application/json", response);
}

void toggleBuzzer() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  buzzerEnabled = !buzzerEnabled;
  if (!buzzerEnabled) digitalWrite(PIN_BUZZER, LOW);

  String response = "{\"buzzerEnabled\":" + String(buzzerEnabled ? "true" : "false") + "}";
  server.send(200, "application/json", response);
}

void systemControl() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  if (server.hasArg("plain")) {
    String command = server.arg("plain");
    if (command == "arm=true") {
      systemArmed = true;
    } else if (command == "arm=false") {
      systemArmed = false;
      digitalWrite(PIN_BUZZER, LOW);
      digitalWrite(LED_PIN, LOW);
      digitalWrite(LED_PIN_YELLOW, LOW);
    }
    server.send(200, "application/json", "{\"systemArmed\":" + String(systemArmed ? "true" : "false") + "}");
  }
}

void getSensorLogs() {
  server.sendHeader("Access-Control-Allow-Origin", "*");


  String logs = "Smart Monitoring System Logs\n";
  logs += "Timestamp: " + getTimestamp() + "\n";
  logs += "Temperature: " + String(currentTemp, 2) + " °C\n";
  logs += "Humidity: " + String(currentHum, 2) + " %\n";

  server.send(200, "text/plain", logs);
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(PIN_FLAME, INPUT);
  pinMode(PIN_MOTION, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_PIN_YELLOW, OUTPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);
  pinMode(LED5, OUTPUT);


  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());  // <--- this prints the IP
  configTime(utcOffsetInSeconds, 0, "pool.ntp.org", "time.nist.gov");

  server.on("/", handleRoot);
  server.on("/update", HTTP_GET, apiUpdate);
  server.on("/status", HTTP_GET, apiStatus);
  server.on("/status", HTTP_OPTIONS, handleOptions);
  server.on("/toggle-light", HTTP_POST, toggleLight);
  server.on("/toggle-light", HTTP_OPTIONS, handleOptions);
  server.on("/toggle-buzzer", HTTP_POST, toggleBuzzer);
  server.on("/toggle-buzzer", HTTP_OPTIONS, handleOptions);
  server.on("/sensor-logs", HTTP_GET, getSensorLogs);
  server.on("/system-control", HTTP_POST, systemControl);
  server.on("/system-control", HTTP_OPTIONS, handleOptions);

  server.begin();
}

void loop() {
  server.handleClient();

  if ((millis() - lastTimeESP) > timerDelay) {
    lastTimeESP = millis();
  }
  readSensors();
  delay(100);
}