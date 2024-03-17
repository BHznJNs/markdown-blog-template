import { writeFileSync, mkdirSync } from "node:fs"
import config from "../../../build.config.js"
import { rssFileGenerator, rssItemGenerator } from "../../rss/index.js"
import { rssFilePath, rssResourcePath } from "../../utils/path.js"
import isInIgnoredDir from "../../utils/isInIgnoredDir.js"
import { execute } from "../../utils/renderer/index.js"
import isExist from "../../utils/isExist.js"

export default function(newestItems) {
    if (!isExist(rssResourcePath)) {
        mkdirSync(rssResourcePath)
    }

    const rssItemSize = config.RSSCapacity
    const rssIgnoredDirs = config.rssIgnoreDir
    const rssItems = newestItems
        .filter(item =>
            !isInIgnoredDir(item.path, rssIgnoredDirs)
        )
        .slice(0, rssItemSize)
        .map(rssItemGenerator)
    execute() // render images

    const rssContent = rssFileGenerator(rssItems)
    writeFileSync(rssFilePath, rssContent)
}