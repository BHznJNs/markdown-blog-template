import { unlinkSync } from "node:fs"
import getNewest from "../../getNewest.js"
import saveNewest from "./saveNewest.js"
import saveRSS from "./saveRSS.js"
import saveSearchIndex from "./resolveSearch.js"
import config from "../../../build.config.js"
import { indexFilePath, rssFilePath, rssResourcePath } from "../../utils/path.js"
import writeIndexTemplate from "../../indexTemplate.js"
import { Directory } from "../../utils/directory.js"

if (!config.homepage.endsWith("/")) {
    config.homepage += "/"
}

try { unlinkSync(rssFilePath) } catch {}
Directory.clear(indexFilePath)
Directory.clear(rssResourcePath)
writeIndexTemplate()

const staticDir = new Directory("static")
staticDir.read()
staticDir.indexing()

// --- --- --- --- --- ---

if (
    !config.enableRSS &&
    !config.enableNewest &&
    !config.enableSearch
) {
    // if RSS, newest and search are all disabled,
    // there is no need to continue.
    process.exit(0)
}

const newests = getNewest(staticDir)
if (config.enableSearch) {
    await saveSearchIndex(newests.children)
}
if (config.enableNewest) {
    saveNewest(newests.children)
}
if (config.enableRSS) {
    saveRSS(newests.children)
}
