import pageController from "../components/paging.js"
import keydownEvent from "../utils/dom/keydownEvent.js"
import pathManager from "./pathManager.js"

const mainEl       = document.querySelector("main")
const newest       = mainEl.querySelector("#newest")
const parentDirBtn = mainEl.querySelector("#previous-dir li")
const articleList  = mainEl.querySelector("#article-list")

if (newest !== null) {
    const targetEl = newest.children[0]
    targetEl.onkeydown = keydownEvent(targetEl)
}

parentDirBtn.onkeydown = keydownEvent(parentDirBtn)
parentDirBtn.addEventListener("click", () => {
    pageController.back()
    pathManager.jumpTo(pathManager.parent())
})
articleList.addEventListener("click", e => {
    const target = e.target

    if (target === articleList) {
        // when click on the `articleList` itself
        // ignore this event.
        return
    }

    if (!target.getAttribute("data-target-blog")) {
        if (target.innerText.endsWith("/")) {
            // open directory
            pageController.open()
        }
        pathManager.open(target.innerText)
    } else {
        // in `newest` page
        pageController.open()
        pathManager.jumpTo(target.getAttribute("data-target-blog"))
    }
})
