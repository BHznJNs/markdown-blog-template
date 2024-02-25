import { readFileSync, writeFileSync } from "node:fs"
import config from "../../build.config.js"
import renderer from "../utils/markdown/renderer.js"
import { rssResourcePath } from "../utils/path.js"
import rssTimeFormater from "./formatTime.js"

function getPathParts(filePath) {
    const splited = filePath.split("/")
    const fileNameWithExt = splited.pop()
    const filename = fileNameWithExt.split(".").slice(0, -1).join(".")
    const parent = splited.join("/")
    return { filename, parent }
}

export class RssItem {
    title         = ""
    link          = ""
    pubTime       = null
    lastBuildTime = null
    description   = ""

    constructor(title, link, pubTime, lastBuildTime, description) {
        this.title         = title
        this.link          = link
        this.pubTime       = pubTime
        this.lastBuildTime = lastBuildTime
        this.description   = description
    }
    toString() {
        return `<item>
<title>${this.title}</title>
<link>${this.link}</link>
<pubDate>${rssTimeFormater(this.pubTime)}</pubDate>
<lastBuildDate>${rssTimeFormater(this.lastBuildTime)}</lastBuildDate>
<description>${this.description || " "}</description>
</item>
`
    }
}

export default function rssItemGenerator(file) {
    const { filename, parent } = getPathParts(file.path)
    const fileContent = readFileSync(file.path, "utf-8")

    globalThis.__ResourcePath__ = config.homepage + parent
    globalThis.__IframeCounter__ = 0
    const articleInfo = renderer(fileContent)
    globalThis.__ResourcePath__ = undefined

    const articlePath = rssResourcePath + filename + ".html"
    writeFileSync(articlePath, articleInfo.htmlContent)

    const rssItem = new RssItem(
        articleInfo.title,
        config.homepage + articlePath,
        file.createTime,
        file.modifyTime,
        articleInfo.description
    )
    return rssItem
}