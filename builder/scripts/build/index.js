import { unlinkSync } from "node:fs"
import getNewest from "../../getNewest.js"
import saveRSS from "./saveRSS.js"
import config from "../../../build.config.js"
import { rssFilePath, rssResourcePath } from "../../utils/path.js"
import writeIndexTemplate from "../../indexTemplate.js"
import { Directory } from "../../utils/directory.js"

if (!config.homepage.endsWith("/")) {
    config.homepage += "/"
}

try { unlinkSync(rssFilePath) } catch {}
Directory.clear(rssResourcePath)
writeIndexTemplate()

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

const staticDir = new Directory("static")
staticDir.read()
const newests = getNewest(staticDir)
if (config.enableRSS) {
    saveRSS(newests.children)
}
