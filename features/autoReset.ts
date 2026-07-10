let lastResetProblemSlug = ""

function getProblemSlug(url: string) {
  // Matches "leetcode.com/problems/two-sum" and extracts "two-sum"
  const match = url.match(/\/problems\/([^/]+)/)
  return match ? match[1] : null
}

export async function checkAndReset() {
  const currentSlug = getProblemSlug(window.location.href)
  if (!currentSlug) return

  // Prevent redundant resets when clicking on tabs (description, solutions, etc.)
  if (lastResetProblemSlug === currentSlug) return

  // 1. Wait for the Monaco code editor (or generic code area) to be mounted in the DOM
  await waitForEditor()

  // 2. Wait for the reset button to appear
  const resetBtn = await waitForResetButton()
  if (!resetBtn) return

  // 3. Extra delay to ensure React state and Monaco are fully initialized
  // before we simulate a click (fixes issues where clicks were ignored)
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Click reset
  resetBtn.click()

  // 4. Wait for the confirmation modal to appear
  const confirmBtn = await waitForConfirmButton()
  if (confirmBtn) {
    // Small delay to allow modal entrance animation to complete
    await new Promise((resolve) => setTimeout(resolve, 300))
    confirmBtn.click()

    // Remember that we reset this problem so we don't do it again this session
    lastResetProblemSlug = currentSlug
  }
}

function waitForEditor(): Promise<void> {
  return new Promise((resolve) => {
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      // LeetCode uses Monaco editor, typically identifiable by '.view-lines' or '.monaco-editor'
      const editorLoaded =
        document.querySelector(".view-lines") ||
        document.querySelector(".monaco-editor") ||
        document.querySelector(".react-codemirror2") ||
        document.querySelector("[class*='code-area']")

      if (editorLoaded) {
        clearInterval(interval)
        resolve()
      } else if (attempts > 50) {
        // Timeout after 5s, resolve anyway in case selectors changed
        clearInterval(interval)
        resolve()
      }
    }, 100)
  })
}

function waitForResetButton(): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      const buttons = Array.from(document.querySelectorAll("button"))
      const resetBtn = buttons.find(
        (b) =>
          b
            .getAttribute("aria-label")
            ?.toLowerCase()
            .includes("reset to default") ||
          (b.getAttribute("data-state") === "closed" &&
            (b.innerHTML.includes("fa-arrow-rotate-left") ||
              b.innerHTML.includes("fa-rotate-right"))) ||
          b.title?.toLowerCase().includes("reset")
      )

      if (resetBtn) {
        clearInterval(interval)
        resolve(resetBtn as HTMLElement)
      } else if (attempts > 50) {
        // Timeout after 5s
        clearInterval(interval)
        resolve(null)
      }
    }, 100)
  })
}

function waitForConfirmButton(): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      const buttons = Array.from(document.querySelectorAll("button"))
      const confirmBtn = buttons.find(
        (b) =>
          (b.textContent?.toLowerCase() === "confirm" ||
            b.textContent?.toLowerCase() === "yes" ||
            b.textContent?.toLowerCase() === "reset") &&
          b.offsetParent !== null // Ensure it's currently visible
      )

      if (confirmBtn) {
        clearInterval(interval)
        resolve(confirmBtn as HTMLElement)
      } else if (attempts > 50) {
        // Timeout after 5s
        clearInterval(interval)
        resolve(null)
      }
    }, 100)
  })
}
