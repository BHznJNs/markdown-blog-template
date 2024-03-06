import highlightRender from "./importers/highlight.js"
import katexRender from "./importers/katex.js"
import chartRender from "./importers/charts/index.js"

import mdResolver from "../utils/markdown/index.js"
import keydownEvent from "../utils/dom/keydownEvent.js"
import eventbus from "../utils/eventbus/inst.js"
import config from "../../build.config.js"
import { Headline } from "../utils/markdown/node.js"
import languageSelector from "../utils/languageSelector.js"
import { scrollToPos } from "../utils/dom/scrollControl.js"
import { allIframeLoaded, setIframeTheme } from "./iframeController.js"
import { parseEntry } from "../utils/markdown/inline.js"

const articleEl = document.querySelector("article")
const emptyArticlePlaceHolder = languageSelector("空文章", "Empty Article")

eventbus.on("catalog-toggle", () => {
    articleEl.classList.toggle("with-catalog")
})
eventbus.on("catalog-closed", () => {
    articleEl.classList.remove("with-catalog")
})

function getHeadlines(structure) {
    return structure
        .filter(node => node instanceof Headline)
        .map((node, index) => {
            const id = node.id = "headline-" + index
            const content = parseEntry(node.content)
            return {
                id, content,
                level: node.tagName,
            }
        })
}

export default function articleRender(articleEl, mdText) {
    // language names to import for `highlight.js`
    globalThis.__LanguageList__ = new Set()
    // to deside which chart library to import
    globalThis.__ChartTypeList__ = new Set()
    // to deside whether to import `katex`
    globalThis.__ContainsFormula__ = false
    // used to dynamic generate iframe id
    globalThis.__IframeCounter__ = 0

    const structure = mdResolver(mdText)
    if (config.enableCatalog) {
        const headlineItems = getHeadlines(structure)
        eventbus.emit("article-rendered", headlineItems)
    }

    let resultNodes = structure.map(node => node.toHTML())
    if (!resultNodes.length) {
        resultNodes = el("h1", emptyArticlePlaceHolder)
    }

    // --- --- --- --- --- ---

    articleEl.innerHTML = ""
    resultNodes.forEach(el => articleEl.appendChild(el))
    // set iframes' theme after all loaded
    allIframeLoaded().then(setIframeTheme)

    articleEl.querySelectorAll("[tabindex='0']").forEach((el) => {
        el.onkeydown = keydownEvent(el)
    })

    Promise.all([
        highlightRender(globalThis.__LanguageList__),
        katexRender(globalThis.__ContainsFormula__),
        chartRender(globalThis.__ChartTypeList__),
    ]).then(() => {
        globalThis.__LanguageList__    = null
        globalThis.__ContainsFormula__ = false
        globalThis.__ChartTypeList__   = null

        // scroll to the position last leaved
        const lastLeavePage = sessionStorage.getItem("last-leave-page")
        const lastLeavePos  = sessionStorage.getItem("last-leave-position") || 0
        sessionStorage.removeItem("last-leave-page")
        sessionStorage.removeItem("last-leave-position")

        if (window.scrollY > 0) {
            // when is scrolled, skip position restoring
            return
        }
        if (location.hash !== lastLeavePage) {
            return
        }
        scrollToPos(Number.parseInt(lastLeavePos))
    })
}
