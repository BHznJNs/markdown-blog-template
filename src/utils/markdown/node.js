import mdResolver from "./index.js"
import inlineResolver from "./inline.js"
import el from "../dom/el.js"
import languageSelector from "../languageSelector.js"
import getInterval from "./utils/getInterval.js"

export class Headline {
    constructor(content) {
        // "### test" -> "###"
        const splited = content.split(" ")
        const numberSignStr = splited[0]
        let numberSignCount = 0
        for (const ch of numberSignStr) {
            if (ch === '#') {
                numberSignCount += 1
            }
        }

        if (numberSignCount > 6) {
            numberSignCount = 0
        }

        const rawContent = splited.slice(1).join(" ")
        this.tagName = "h" + numberSignCount
        this.content = inlineResolver(rawContent)
    }
    toHTML() {
        const options = this.id === undefined
            ? null
            : { id: this.id }
        return el(this.tagName, this.content, options)
    }

    static pattern = source => source.match(/^(#+ )/)
}

export class Para {
    tagName = "p"

    constructor(content) {
        this.content = content.trimStart()
    }
    toHTML() {
        const inline = inlineResolver(this.content)
        return el(this.tagName, inline)
    }
}

export class Quote {
    tagName = "blockquote"
    children = []

    constructor(children) {
        this.children = children
    }
    toHTML() {
        const innerNodes = this.children
            .map(node => node.toHTML())
        return el(this.tagName, innerNodes)
    }

    static pattern = source =>
        (source === ">") || source.startsWith("> ")
}

export class Divider {
    toHTML = () => el("hr")
    static pattern = source =>
        source.match(/(-\s*-\s*-)|(\*\s*\*\s*\*)/) && !source.match(/[a-zA-Z0-9]/)
}

export class List {
    children = []

    constructor(content) {
        this.isOrdered = Boolean(List.orderedPattern(content))
        this.tagName   = (this.isOrdered) ? "ol" : "ul"
        this.children  = [List.getContent(content, this.isOrdered)]
    }

    push = child => this.children.push(child)

    toHTML() {
        const childrenHTML = []
        for (const child of this.children) {
            if (typeof child === "string") {
                const inline = inlineResolver(child)
                childrenHTML.push(el("li", inline))
            } else {
                childrenHTML.push(child.toHTML())
            }
        }
        return el(this.tagName, childrenHTML)
    }

    static unorderedPattern = (source) => Boolean(source.match(/^([\s\t]*[+-]+ )/))
    static orderedPattern = (source) => Boolean(source.match(/^([\s\t]*[0-9]+. )/))

    static isListPattern = (source) =>
        List.orderedPattern(source) || List.unorderedPattern(source)

    static getContent(line, isOrdered) {
        if (isOrdered) {
            // "1. ..." => "..."
            return line.match(/(?<=^([\s\t]*[0-9]+. )).+$/g)[0]
        } else {
            // "- ..." => "..."
            return line.match(/(?<=^([\s\t]*[+-]+ )).+$/g)[0]
        }
    }
}

export class Table {
    headerCells = [""]   // [string]
    bodyRows    = [[""]] // [[string]]

    constructor(headerCells, bodyRows) {
        this.headerCells = headerCells
        this.bodyRows    = bodyRows
    }

    #tableHeaderCell = content => el("th", content)
    #tableBodyCell   = content => el("td", inlineResolver(content))
    #tableHeaderRow  = row => el("tr", row.map(this.#tableHeaderCell))
    #tableBodyRow    = row => el("tr", row.map(this.#tableBodyCell))

    toHTML() {
        const tableHeader = el(
            "thead",
            this.#tableHeaderRow(this.headerCells)
        )
        const tableBody = el(
            "tbody",
            this.bodyRows
                .map(this.#tableBodyRow)
        )
        return el("div", el("table", [tableHeader, tableBody]), {
            "class": "table"
        })
    }

    static pattern = source => source.startsWith("| ")
}

// --- --- --- --- -
// media nodes start
// --- --- --- --- -

class MediaNode {
    source = ""
    description = ""    
    constructor(mdText) {
        mdText = mdText.substr(2)
        this.description = getInterval(mdText, "]")
        mdText = mdText.substr(this.description.length + 2)
        this.source = getInterval(mdText, ")")
    }

    static containerGenerator(content) {
        return el("div", content, {
            "class": "media-container"
        })
    }

    static patternGenerator(identifierSign) {
        return (source) =>
            source.startsWith(identifierSign + "[") && source.endsWith(")")
    }

    static replaceContentGenerator(href, description) {
        const downloadEl = el("a", languageSelector("从这里下载！", "Download Here!"), { href })
        const replaceContent = `${description}<br>${downloadEl}`
        return replaceContent
    }

    static srcUrlResolver(rawUrl) {
        let actualUrl
        if (rawUrl.startsWith("http")) {
            actualUrl = rawUrl
        } else {
            const hash = location.hash.slice(1)
            // get the parent directory path
            const currentPath = hash.split("/").slice(0, -1).join("/")
            actualUrl = currentPath + "/" + rawUrl
        }
        return actualUrl
    }
}

export class Image extends MediaNode {
    static pattern = MediaNode.patternGenerator("!")

    toHTML() {
        const actualUrl = MediaNode.srcUrlResolver(this.source)
        const imageEl = el("img", "", {
            src: actualUrl,
            alt: this.description,
            loading: "lazy",
            tabindex: 0,
        })
        imageEl.onclick = e =>
            window.open(e.target.src)
        imageEl.onerror = e => {
            const target = e.target
            target.onclick = null
            target.title = this.description
            target.classList.add("load-error")
        }
        return MediaNode.containerGenerator(imageEl)
    }
}

export class Audio extends MediaNode {
    static pattern = MediaNode.patternGenerator(":")

    toHTML() {
        const actualUrl = MediaNode.srcUrlResolver(this.source)
        const replaceContent = MediaNode.replaceContentGenerator(actualUrl, this.description)
        const audioEl = el("audio", replaceContent, {
            src: actualUrl,
            controls: true,
        })
        return MediaNode.containerGenerator(audioEl)
    }
}

export class Video extends MediaNode {
    static pattern = MediaNode.patternGenerator("?")

    toHTML() {
        const actualUrl = MediaNode.srcUrlResolver(this.source)
        const replaceContent = MediaNode.replaceContentGenerator(actualUrl, this.description)
        const videoEl = el("video", replaceContent, {
            src: actualUrl,
            controls: "true",
        })
        return MediaNode.containerGenerator(videoEl)
    }
}

export const isIframePattern = (source) =>
    MediaNode.patternGenerator("@")(source)
    || source.startsWith("@@@")

export class Iframe extends MediaNode {
    toHTML() {
        const actualUrl = MediaNode.srcUrlResolver(this.source)
        const iframeEl = el("iframe", this.description, {
            src: actualUrl,
            title: this.description,
            sandbox: "allow-scripts",
            loading: "lazy",
        })
        return MediaNode.containerGenerator(iframeEl)
    }
}

// --- --- --- ---
// media nodes end
// --- --- --- ---

// --- --- --- --- -
// block nodes start
// --- --- --- --- -

export class CodeBlock {
    constructor(content, lang) {
        this.lang = lang
        this.content = content
    }
    append(content) {
        this.content += content
    }
    toHTML() {
        const isPlaintext = ["plaintext", "text", ""].includes(this.lang)
        if (!isPlaintext) {
            globalThis.__LanguageList__.add(this.lang)
        }

        let langName, langClass
        if (isPlaintext) {
            langClass = "nohighlight"
            langName  = "PLAINTEXT"
        } else {
            langClass = `language-${this.lang}`
            langName  = this.lang.toUpperCase()
        }

        const codeEl = el("code", this.content, {
            "class": langClass,
            tabindex: 0
        })
        return el("pre", codeEl, {
            "class": "code-block",
            "data-language": langName
        })
    }

    static pattern = source => source.startsWith("```")
}

export class DetailsBlock {
    summary = ""
    content = ""

    constructor(content, summary) {   
        this.summary = summary
        this.content = mdResolver(content)
    }
    toHTML() {
        const summaryEl = el("summary", this.summary)
        const detailsEl = el("details", summaryEl)

        const innerNodes = this.content
            .map(node => node.toHTML())
        const childrenEl = el("div", el("div", innerNodes, {
            "class": "details-children"
        }), {
            "class": "details-children-container"
        })
        return el("div", [detailsEl, childrenEl], {
            "class": "details"
        })
    }

    static pattern = source =>
        source.startsWith(">>>")
}

export class FormulaBlock {
    content = ""
    description = ""

    constructor(content, description) {
        this.content = content
        this.description = description
    }
    toHTML() {
        globalThis.__ContainsFormula__ = true
        return el("div", this.content, {
            "class": "math",
            title: this.description,
        })
    }

    static pattern = source =>
        source.startsWith("$$$")
}

export class IframeBlock {
    // injected html codes, used to auto darkmode
    // and send height message
    static #injectedCodes = id => `\
<style>
@media (prefers-color-scheme: dark) {
  :root {
    color: white;
    background-color: #121212;
  }
}
</style>
<script>
const rootEl = document.documentElement
function postHeight() {
    const parent = window.parent
    const height = parseFloat(getComputedStyle(rootEl).height)
    parent.postMessage({
        height,
        id: "${id}"
    }, "*")
}
window.addEventListener("load", postHeight)
window.addEventListener("message", e => {
  const { fontSize } = e.data
  rootEl.style.fontSize = fontSize
  postHeight()
})
</script>`

    constructor(content, description) {
        globalThis.__IframeCounter__ += 1
        this.id = "iframe_" + globalThis.__IframeCounter__
        this.description = description
        this.content = content + IframeBlock.#injectedCodes(this.id)
    }

    toHTML() {
        const iframeEl = el("iframe", this.description, {
            id: this.id,
            title: this.description,
            srcdoc: this.content,
            sandbox: "allow-scripts",
        })
        return MediaNode.containerGenerator(iframeEl)
    }
}

// types of chart blocks

class EchartsChartType {
    constructor(content) {
        const options = new Function(
            "let option;"
            + content
            + ";return option"
        )()
        this.chartOptions = options
        globalThis.__ChartTypeList__.add("echarts")
    }
    toHTML() {
        const chartEl = el("div", "", {
            "class": "echarts-container",
        })
        chartEl.__ChartOptions__ = this.chartOptions
        return chartEl
    }
}
class FlowChartType {
    constructor(content) {
        this.content = content
        globalThis.__ChartTypeList__.add("flow-chart")
    }
    toHTML() {
        const chartEl = el("div", "", {
            "class": "flowchart-container"
        })
        chartEl.__ChartContent__ = this.content
        return chartEl
    }
}
class SequenceChartType {
    constructor(content) {
        this.content = content
        globalThis.__ChartTypeList__.add("sequence-chart")
    }
    toHTML() {
        const chartEl = el("div", "", {
            "class": "sequencechart-container"
        })
        chartEl.__ChartContent__ = this.content
        return chartEl
    }
}
class GanttChartType {
    constructor(content) {
        this.content = new Function(`const tasks = [${content}]; return tasks`)()
        globalThis.__ChartTypeList__.add("gantt-chart")
    }
    toHTML() {
        const chartEl = el("div", "", {
            "class": "ganttchart-container"
        })
        chartEl.__ChartContent__ = this.content
        return chartEl
    }
}
class RailroadChartType {
    constructor(content) {
        this.content = content
        globalThis.__ChartTypeList__.add("railroad-chart")
    }
    toHTML() {
        const chartEl = el("div", "", {
            "class": "railroad-container"
        })
        chartEl.__ChartContent__ = this.content
        return chartEl
    }
}
class QRCodeType {
    constructor(content) {
        this.content = content
        globalThis.__ChartTypeList__.add("qrcode")
    }
    toHTML() {
        const chartEl = el("div", "", {
            "class": "qrcode-container"
        })
        chartEl.__QRCodeContent__ = this.content
        return chartEl
    }
}
class UnknownChartType {
    constructor(errMsg) {
        this.content = errMsg
    }
    toHTML() {
        return el("span", this.content)
    }
}

export class ChartBlock {
    static pattern = source =>
        source.startsWith("!!!")
    
    #type = null

    constructor(content, type) {
        switch (type) {
            case "": case "echarts":
                this.#type = new EchartsChartType(content)
                break
            case "flow":       case "flowchart":
            case "flow chart": case "flow-chart":
                this.#type = new FlowChartType(content)
                break
            case "sequence":      case "sequencechart":
            case "sequence char": case "sequence-chart":
                this.#type = new SequenceChartType(content)
                break
            case "gantt":       case "ganttchart":
            case "gantt chart": case "gantt-chart":
                this.#type = new GanttChartType(content)
                break
            case "rail": case "railroad": case "railroadchart":
            case "railroad chart":        case "railroad-chart":
                this.#type = new RailroadChartType(content)
                break
            case "qrcode": case "qr-code": case "qr code":
                this.#type = new QRCodeType(content)
                break
            default:
                const errMsg = "Unknown chart type: " + type
                console.error(errMsg)
                this.#type = new UnknownChartType(errMsg)
        }
    }
    toHTML() {
        const chartEl = this.#type.toHTML()
        return MediaNode.containerGenerator(chartEl)
    }
}

// --- --- --- ---
// block nodes end
// --- --- --- ---
