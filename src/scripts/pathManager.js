import pageController from "../components/paging.js"
import { fetchJSON, fetchMD } from "./fetchResources.js"
import articleRender from "./articleRenderer.js"
import indexRender, { newestItemRenderer, directoryItemRenderer } from "./indexRenderer.js"
import { scrollToTop } from "../utils/dom/scrollControl.js"

const mainEl = document.querySelector("main")
const articleEl = document.querySelector("article")
const indexDirPath = "./.index/"

export async function hashChangeEvent(e) {
    if (!location.hash) {
        pathManager.homepage()
        return
    }
    const hash = location.hash.slice(1)
    mainEl.classList.add("disabled")

    if (pathManager.isIn.newestPage()) {
        // open newest page
        const indexPath = indexDirPath
            + "newest_"
            + pageController.current()
        const newestIndex = await fetchJSON(indexPath)
        if (!newestIndex) return
        indexRender(newestIndex, newestItemRenderer)
    } else
    if (pathManager.isIn.directory()) {
        // open directory
        const splited = hash.split("/").slice(0, -1)
        const indexFilePath = indexDirPath
            + splited.join("+") + "_"
            + pageController.current()
        const index = await fetchJSON(indexFilePath)
        if (!index) return
        indexRender(index, directoryItemRenderer)
    } else
    if (pathManager.isIn.article()) {
        // open article
        articleEl.innerHTML = ""
        mainEl.classList.add("hidden")
        const articleContent = await fetchMD("./" + hash)
        if (!articleContent) return
        articleRender(articleEl, articleContent)
    } else {
        pathManager.homepage()
    }

    mainEl.setAttribute("data-is-root", hash === "static/")
    mainEl.classList.remove("disabled")

    const getHash = url => new URL(url).hash
    if (e instanceof HashChangeEvent
        && pathManager.isIn.directory(getHash(e.oldURL))
        && pathManager.isIn.article(getHash(e.newURL))) {
        // when enters an article from directory
        scrollToTop()
    }
}

window.addEventListener("hashchange", hashChangeEvent)
window.addEventListener("load", hashChangeEvent)

const homepagePath = "static/"
const newestPath = "newest/"
const pathManager = {
    homepage() {
        location.hash = homepagePath
    },

    open(name) {
        location.hash += name
    },
    jumpTo(target) {
        location.hash = target
    },
    parent() {
        if (this.isIn.root() || this.isIn.newestPage()) {
            return homepagePath
        }
        const splited = location.hash.slice(1).split("/")
        if (this.isIn.directory()) {
            return splited.slice(0, -2).join("/") + "/"
        }
        if (this.isIn.article()) {
            return splited.slice(0, -1).join("/") + "/"
        }
        throw new Error("Unexpected hash: " + location.hash)
    },
    isIn: {
        root() {
            return location.hash === "#" + homepagePath
        },
        newestPage() {
            return location.hash === "#" + newestPath
        },
        directory(test) {
            const testTarget = test || location.hash
            return testTarget.startsWith("#static")
                && testTarget.endsWith("/")
        },
        article(test) {
            const testTarget = test || location.hash
            return testTarget.startsWith("#static")
                && testTarget.endsWith(".md")
        }
    }
}
export default pathManager
