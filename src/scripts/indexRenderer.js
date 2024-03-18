import articleRender from "./articleRenderer.js"
import el from "../utils/dom/el.js"
import keydownEvent from "../utils/dom/keydownEvent.js"
import { scrollToTop } from "../utils/dom/scrollControl.js"

export function newestItemRenderer(item) {
    const createDate = new Date(item.timestamp)
    const formatedDate = new Intl.DateTimeFormat().format(createDate)
    const dateEl  = el("code", formatedDate)
    const titleEl = el("span", item.title, {
        "class": "underline-target"
    })
    return el("li",
        [dateEl, el("text", ": "), titleEl],
        {
            tabindex: 0,
            "class": "underline-through",
            "data-target-blog": item.link,
        }
    )
}
export function directoryItemRenderer(item) {
    const contentEl = el("span", item, {
        "class": "underline-target"
    })
    return el("li", contentEl, {
        "class": "underline-through",
        tabindex: 0,
    })
}

const mainEl           = document.querySelector("main")
const articleEl        = document.querySelector("article")
const articleContainer = document.querySelector("#article-container")
const articleList      = mainEl.querySelector("#article-list")
const dirDescriptionEl = mainEl.querySelector("#directory-description")
const pagingComponent  = mainEl.querySelector("paging-view")

export default function indexRender(indexing, itemResolver) {
    const {current, total} = indexing
    pagingComponent.setPage(current, total)

    // --- --- --- --- --- ---
    
    // reset directory description
    dirDescriptionEl.innerHTML = ""
    if ("directoryDescription" in indexing) {
        articleRender(dirDescriptionEl, indexing.directoryDescription)
    }

    // reset articleList content
    const fragment = document.createDocumentFragment()
    indexing.content
        .map(itemResolver)
        .forEach(el => fragment.appendChild(el))
    articleList.innerHTML = ""
    articleList.appendChild(fragment)

    // set keyboard event
    articleList.querySelectorAll("[tabindex='0']").forEach((el) => {
        el.onkeydown = keydownEvent(el)
    })

    // --- --- --- --- --- ---

    articleEl.innerHTML = ""
    mainEl.classList.remove("hidden")
    scrollToTop()
}
