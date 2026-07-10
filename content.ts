import type { PlasmoCSConfig } from "plasmo"

import { checkAndReset } from "./features/autoReset"
import {
  disableInterviewMode,
  enableInterviewMode
} from "./features/interviewMode"

export const config: PlasmoCSConfig = {
  matches: ["https://leetcode.com/problems/*"]
}

let autoResetEnabled = false
let interviewModeEnabled = false

// Initialize settings
chrome.storage.local.get(["autoReset", "interviewMode"], (result) => {
  autoResetEnabled = result.autoReset ?? false
  interviewModeEnabled = result.interviewMode ?? false

  if (interviewModeEnabled) {
    enableInterviewMode()
  }

  if (autoResetEnabled) {
    checkAndReset()
  }
})

// Listen for changes from the popup
chrome.storage.onChanged.addListener((changes) => {
  if (changes.interviewMode) {
    interviewModeEnabled = changes.interviewMode.newValue
    if (interviewModeEnabled) {
      enableInterviewMode()
    } else {
      disableInterviewMode()
    }
  }

  if (changes.autoReset) {
    autoResetEnabled = changes.autoReset.newValue
  }
})

// Listen for SPA navigation from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "NAVIGATION_UPDATE") {
    // Re-check and run reset code if enabled
    if (autoResetEnabled) {
      checkAndReset()
    }

    // Ensure Interview mode persists on SPA navigation if it is enabled
    if (interviewModeEnabled) {
      enableInterviewMode()
    }
  }
})
