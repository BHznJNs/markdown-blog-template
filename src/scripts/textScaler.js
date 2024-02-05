import getRem from "../utils/dom/getRem.js"

const articleEl = document.querySelector("article")

let fontSizeOffset = 0
function setIframesRem(fontSize) {
    const embeddedIframes = document.querySelectorAll("article iframe[srcdoc]")
    embeddedIframes.forEach(el =>
        el.contentWindow.postMessage({ fontSize }, "*"))
}
function textScalerCreator(callback) {
    return function() {
        callback()
        const baseSize = getRem()
        const targetFontSize = baseSize + fontSizeOffset + "px"
        articleEl.style.fontSize = targetFontSize
        setIframesRem(targetFontSize)
    }
}
export const enlargeText  = textScalerCreator(() => fontSizeOffset += 1)
export const downsizeText = textScalerCreator(() => fontSizeOffset -= 1)
