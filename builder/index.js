import { unlinkSync } from "node:fs"
import indexing from "./indexing.js"
import getNewest from "./getNewest.js"
import saveNewest from "./saveNewest.js"
import config from "../build.config.js"
import { indexFilePath, rssFilePath, rssResourcePath } from "./utils/path.js"
import clearDirectory from "./utils/clearDirectory.js"
import writeIndexTemplate from "./indexTemplate.js"
import readDir, { Directory } from "./utils/readDir.js"
import saveRSS from "./saveRSS.js"

if (!config.homepage.endsWith("/")) {
    config.homepage += "/"
}

try { unlinkSync(rssFilePath) } catch {}
clearDirectory(indexFilePath)
clearDirectory(rssResourcePath)
writeIndexTemplate()

const staticDir = new Directory("static")
readDir(staticDir, "")
indexing(staticDir, "static")

// --- --- --- --- --- ---

if (!config.enableRSS && !config.enableNewest) {
    // if RSS and newest are both disabled,
    // there is no need to continue.
    process.exit(0)
}

const newests = getNewest(staticDir)
if (config.enableNewest) {
    saveNewest(newests.children)
}
if (config.enableRSS) {
    saveRSS(newests.children)
}
