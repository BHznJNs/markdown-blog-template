import { readFileSync } from "node:fs"
import { Directory } from "../../utils/directory.js"
import getNewest from "../../getNewest.js"
import { countHTMLPath } from "../../utils/path.js"
import mdResolver from "../../utils/markdown/index.js"
import countTemplate from "./countTemplate.js"

function countFile(path) {
    const content = readFileSync(path, "utf-8")
    const structure = mdResolver(content)
    const wordCount = structure.reduce((accumulator, current) => {
        if (typeof current.count() === "string") {
            console.log(current)
        }
        return accumulator + current.count()}
    , 0)
    return wordCount
}

function getFileCatalog(path) {
    // path format:
    // static/<catalog>/...subfolders.../<filename>.md
    if (typeof path !== "string" || !path.startsWith("static/")) {
        throw new Error("Invalid file path. It should start with \"static/\"");
    }
    const pathWithoutStatic = path.substring(7)
    const firstSlashIndex = pathWithoutStatic.indexOf("/")
    if (firstSlashIndex === -1) {
        return pathWithoutStatic
    }
    return pathWithoutStatic.substring(0, firstSlashIndex)
}


try { unlinkSync(countHTMLPath) } catch {}
const staticDir = new Directory("static")
staticDir.read()
const newests = getNewest(staticDir)

// total word count & write dates & catalogs
const metadataList  = []
let totalWordCount = 0
for (const file of newests.children) {
    const date  = file.createTime
    const count = countFile(file.path)
    const catalog = getFileCatalog(file.path)

    metadataList.push({ date, count, catalog })
    totalWordCount += count
}

// start writing date
const firstArticle = newests.children[newests.length - 1]
const startTime = firstArticle.createTime
countTemplate(startTime, metadataList, totalWordCount)
