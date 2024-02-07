import "./styles/style.css"

import "./scripts/mainManager.js"
import config from "../build.config.js"
import pageController from "./components/paging.js"
import keydownEvent from "./utils/dom/keydownEvent.js"
import pathManager from "./scripts/pathManager"

// import optional components
if (config.enableFab) {
    import("./components/fab.js")
}
if (config.enableCatalog) {
    import("./components/catalog.js")
}

// set theme switcher button event
const lightBtn = document.querySelector("#light-btn")
const darkBtn = document.querySelector("#dark-btn")
lightBtn.onkeydown = keydownEvent(lightBtn)
darkBtn.onkeydown = keydownEvent(darkBtn)

// --- --- --- --- --- ---

window.addEventListener("popstate", () => {
    if (location.hash.endsWith("/")) {
        // in a directory
        pageController.back()
    }
})

window.addEventListener("beforeunload", e => {
    if (!pathManager.isIn.article()) {
        return
    }
    // when leave an article remember current scroll position
    sessionStorage.setItem("last-leave-page", location.hash)
    sessionStorage.setItem("last-leave-position", window.scrollY)
})

// set embedded iframe theme
const darkmodeObserver    = new MutationObserver(_ => {
    const isDarkMode      = document.body.classList.contains("dark")
    const theme           = isDarkMode ? "dark" : "light"
    const embeddedIframes = document.querySelectorAll("iframe[srcdoc]")
    embeddedIframes.forEach(el =>
        el.contentWindow.postMessage({ theme }, "*"))
})
darkmodeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
})

// set embedded iframe height
window.addEventListener("message", e => {
    if (e.origin != "null") {
        return
    }
    const { id, height } = e.data
    const targetIframeEl = document.getElementById(id)
    targetIframeEl.style.height = height + "px"
})

if ("serviceWorker" in navigator) {
    // if support service worker, register
    navigator.serviceWorker
        .register("./sw.js")
        .catch(function(error) {
            // registration failed
            console.error("Registration failed with " + error);
        })
}
