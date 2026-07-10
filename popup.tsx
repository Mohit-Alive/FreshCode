import { useEffect, useState } from "react"

function IndexPopup() {
  const [autoReset, setAutoReset] = useState(false)
  const [interviewMode, setInterviewMode] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(["autoReset", "interviewMode"], (result) => {
      setAutoReset(result.autoReset ?? false)
      setInterviewMode(result.interviewMode ?? false)
    })
  }, [])

  const toggleAutoReset = (checked: boolean) => {
    setAutoReset(checked)
    chrome.storage.local.set({ autoReset: checked })
  }

  const toggleInterviewMode = (checked: boolean) => {
    setInterviewMode(checked)
    chrome.storage.local.set({ interviewMode: checked })
  }

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "36px",
        height: "20px",
        backgroundColor: checked ? "#2cbb5d" : "#5c5c5c",
        borderRadius: "10px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s"
      }}>
      <div
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: checked ? "18px" : "2px",
          transition: "left 0.3s",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
        }}
      />
    </div>
  )

  return (
    <div
      style={{
        padding: "16px",
        minWidth: "260px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        backgroundColor: "#282828",
        color: "#eff1f6"
      }}>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #282828;
        }
      `}</style>
      <h2
        style={{
          fontSize: "16px",
          marginBottom: "12px",
          fontWeight: "600",
          color: "#eff1f6",
          display: "flex",
          alignItems: "center"
        }}>
        <span style={{ color: "#ffa116", marginRight: "8px", fontSize: "18px", fontWeight: "bold" }}>|</span>
        LeetCode Assistant
      </h2>

      <div style={{ height: "1px", backgroundColor: "#424242", marginBottom: "16px" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center"
        }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Auto Reset Code
          </span>
          <span style={{ fontSize: "12px", color: "#8a8a8a" }}>
            Reset code automatically
          </span>
        </div>
        <ToggleSwitch checked={autoReset} onChange={toggleAutoReset} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Interview Mode
          </span>
          <span style={{ fontSize: "12px", color: "#8a8a8a" }}>
            Hide examples and constraints
          </span>
        </div>
        <ToggleSwitch checked={interviewMode} onChange={toggleInterviewMode} />
      </div>
    </div>
  )
}

export default IndexPopup
