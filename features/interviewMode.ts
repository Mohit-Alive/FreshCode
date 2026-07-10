export function enableInterviewMode() {
  let styleTag = document.getElementById("fresh-code-interview-mode-style")
  if (!styleTag) {
    styleTag = document.createElement("style")
    styleTag.id = "fresh-code-interview-mode-style"
    styleTag.textContent = `
      .flexlayout__tab_button:has(#editorial_tab),
      .flexlayout__tab_button:has(#solutions_tab),
      .flexlayout__tab_button:has(#submissions_tab) {
          display: none !important;
      }
      .flexlayout__tab_divider:has(+ .flexlayout__tab_button:has(#editorial_tab)),
      .flexlayout__tab_divider:has(+ .flexlayout__tab_button:has(#solutions_tab)),
      .flexlayout__tab_divider:has(+ .flexlayout__tab_button:has(#submissions_tab)) {
          display: none !important;
      }
    `
    document.head.appendChild(styleTag)
  }
}

export function disableInterviewMode() {
  const styleTag = document.getElementById("fresh-code-interview-mode-style")
  if (styleTag) {
    styleTag.remove()
  }
}
