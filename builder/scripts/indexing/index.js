import saveNewest from "./saveNewest.js"
import saveSearchIndex from "./resolveSearch.js"
import getNewest from "../../getNewest.js"
import config from "../../../build.config.js"
import { Directory } from "../../utils/directory.js"
import { indexFilePath } from "../../utils/path.js"

Directory.clear(indexFilePath)

const staticDir = new Directory("static")
staticDir.read()
staticDir.indexing()

const newests = getNewest(staticDir)
if (config.enableNewest) {
    saveNewest(newests.children)
}
if (config.enableSearch) {
    await saveSearchIndex(newests.children)
}