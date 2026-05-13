import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Moon, Sun, Activity, AlertTriangle, Clock, Wifi, WifiOff } from "lucide-react"
import { Button } from "./components/ui/Button"
import PatientPanel from "./components/PatientPanel"
import ActivityLog from "./components/ActivityLog"
import StatusBar from "./components/StatusBar"
import SystemHeader from "./components/SystemHeader"
import { AlertPanel } from "./components/AlertPanel"
import { usePatientData } from "./usePatientData"
import SensorGrid from "./components/SensorGrid"

export default function Dashboard({ onBack }) {

  const [isDark, setIsDark] = useState(true)
  const [demoMode, setDemoMode] = useState(false) // ✅ OFF by default
  const [selectedPatient, setSelectedPatient] = useState("")
  const [alerts, setAlerts] = useState([])

  const hasConnected = useRef(false) // prevent spam alerts

  const {
    data: patientData,
    loading,
    error,
    toggleBuzzer,
    toggleLight,
    fetchData
  } = usePatientData()

  // 🌙 Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  // 📡 Poll ESP32
  useEffect(() => {
    if (demoMode) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://192.168.43.210/status") // ⚠️ PUT YOUR ESP IP

        if (!res.ok) throw new Error("HTTP " + res.status)

        const data = await res.json()

        const formattedData = {
          temp: data.temperature,
          hum: data.humidity,
          motion: data.motionDetected,
          flame: data.flameDetected,
          lightState: data.lightState,
          buzzerEnabled: data.buzzerEnabled,
          timestamp: data.timestamp
        }

        fetchData(formattedData)

      } catch (err) {
        console.error("Fetch error:", err)
      }
    }, 2000) // ✅ stable interval

    return () => clearInterval(interval)

  }, [demoMode])

  // 🚨 Alerts logic
  useEffect(() => {
    if (demoMode || !patientData) return

    const newAlerts = []

    if (patientData.flame) {
      newAlerts.push({
        id: `flame-${Date.now()}`,
        type: "danger",
        message: "🔥 FLAME DETECTED!",
        timestamp: new Date()
      })
    }

    if (patientData.motion && !patientData.lightState) {
      newAlerts.push({
        id: `motion-${Date.now()}`,
        type: "warning",
        message: "Movement detected in dark",
        timestamp: new Date()
      })
    }

    if (patientData.temp > 30) {
      newAlerts.push({
        id: `temp-${Date.now()}`,
        type: "warning",
        message: `High Temp: ${patientData.temp}°C`,
        timestamp: new Date()
      })
    }

    if (patientData.hum > 70) {
      newAlerts.push({
        id: `hum-${Date.now()}`,
        type: "warning",
        message: `High Humidity: ${patientData.hum}%`,
        timestamp: new Date()
      })
    }

    if (patientData.hum < 30) {
      newAlerts.push({
        id: `humlow-${Date.now()}`,
        type: "info",
        message: `Low Humidity: ${patientData.hum}%`,
        timestamp: new Date()
      })
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 8))
    }

  }, [patientData, demoMode])

  // ⏳ Auto remove alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev =>
        prev.filter(a => Date.now() - a.timestamp.getTime() < 10000)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // 🔌 Connection alert (only once)
  useEffect(() => {
    if (demoMode) return

    if (error) {
      setAlerts(prev => [{
        id: `error-${Date.now()}`,
        type: "danger",
        message: `Connection failed: ${error}`,
        timestamp: new Date()
      }, ...prev])
      hasConnected.current = false
    }

    if (patientData && !loading && !hasConnected.current) {
      setAlerts(prev => [{
        id: `connected-${Date.now()}`,
        type: "success",
        message: "Device connected",
        timestamp: new Date()
      }, ...prev])
      hasConnected.current = true
    }

  }, [error, patientData, loading, demoMode])

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">

        {/* HEADER */}
        <header className="border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button onClick={onBack}><ArrowLeft /></Button>
            <h1 className="text-xl font-bold">MediTrack Pro</h1>
          </div>

          <div className="flex items-center gap-3">
            <span>
              {demoMode ? "Demo" :
                loading ? "Connecting..." :
                  error ? "Disconnected" :
                    patientData ? "Connected" : "Idle"}
            </span>

            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
            />

            <Button onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun /> : <Moon />}
            </Button>
          </div>
        </header>

        {/* MAIN */}
        <main className="p-6 space-y-6">

          <SystemHeader alerts={alerts} />
          <StatusBar patientData={patientData} demoMode={demoMode} />

          <SensorGrid
            demoMode={demoMode}
            patientData={patientData}
            loading={loading}
          />

          <AlertPanel alerts={alerts} />
          <ActivityLog demoMode={demoMode} patientData={patientData} />

        </main>
      </div>
    </div>
  )
}