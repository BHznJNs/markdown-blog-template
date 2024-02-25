import { readFileSync } from "node:fs"
import readDir, { Directory } from "../../utils/readDir.js"
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


try { unlinkSync(countHTMLPath) } catch {}
const staticDir = new Directory("static")
readDir(staticDir, "")
const newests = getNewest(staticDir)

// total word count & write dates
const dateList  = []
let totalCount = 0
for (const file of newests.children) {
    const date  = file.createTime
    const count = countFile(file.path)

    dateList.push([ date, count ])
    totalCount += count
}

// start writing date
const firstArticle = newests.children[newests.length - 1]
const startTime = firstArticle.createTime
countTemplate(startTime, dateList, totalCount)
