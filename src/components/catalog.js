import "../styles/components/catalog.css"
import pathManager from "../scripts/pathManager"
import throttle from "../utils/throttle.js"
import eventbus from "../utils/eventbus/inst.js"
import el from "../utils/dom/el.js"
import { scrollToEl } from "../utils/dom/scrollControl.js"
import importStyle from "../scripts/importers/style"

function catalogItemRenderer({ level, content, id }) {
    const contentEl = el("span", content, {
        "class": "underline-target"
    })
    return el("li", contentEl, {
        "class": [
            "level-" + level,
            "underline-through",
        ].join(" "),
        "data-target-headline": id
    })
}

class Catalog extends HTMLElement {
    rootNode = null
    constructor() {
        super()

        this.style.visibility = "hidden"
        importStyle("./dist/chunks/catalog.min.css")
            .then(() => this.style.visibility = "visible")

        this.rootNode = el("ol")
        this.classList.add("hidden")
        this.appendChild(this.rootNode)
        this.#appendEvent()
    }

    #appendEvent() {
        this.rootNode.addEventListener("click", throttle(e => {
            const targetId = e.target.getAttribute("data-target-headline")
            if (!targetId) {
                return
            }
            const targetHeadlineEl = document.getElementById(targetId)
            scrollToEl(targetHeadlineEl, 16)
        }, 200))
        window.addEventListener("hashchange", () => {
            if (pathManager.isIn.article()) {
                return
            }
            this.classList.add("hidden")
            eventbus.emit("catalog-closed")
        })
        eventbus.on("catalog-toggle", () => {
            this.classList.toggle("hidden")
        })
        eventbus.on(
            "article-rendered",
            this.render.bind(this)
        )
    }

    // input: [{ level, content }]
    async render(items) {
        this.rootNode.innerHTML = ""
        items
            .map(catalogItemRenderer)
            .forEach(el => this.rootNode.appendChild(el))
    }
}
customElements.define("article-catalog", Catalog)
