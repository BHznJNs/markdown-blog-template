import { readdirSync, writeFileSync, readFileSync, statSync, unlinkSync } from "node:fs"
import slice from "./slice.js"
import isExist from "./isExist.js"
import { indexFilePath } from "./path.js"

export class Directory {
    name  = ""
    items = [] // [`Directory` | `File`]
    createTime = 0

    constructor(name, createTime) {
        this.name = name
        this.createTime = createTime
    }
    push(item) {
        this.items.push(item)
    }
    read(base="") {
        const dirPath = base + this.name
        const dirContent = readdirSync(dirPath)

        for (const item of dirContent) {
            const itemPath = dirPath + "/" + item
            const itemStat = statSync(itemPath)
            const itemCreateTime = itemStat.birthtime.getTime()

            if (itemStat.isDirectory()) {
                if (item.startsWith(".")) {
                    // ignore directories whose name starts with '.'
                    continue
                }
                const subDir = new Directory(item, itemCreateTime)
                subDir.read(dirPath + "/")
                this.push(subDir)
            } else {
                const itemModifyTime = itemStat.mtime.getTime()
                const file = new File(
                    item,
                    itemPath,
                    itemCreateTime,
                    itemModifyTime,
                )
                this.push(file)
            }
        }
        this.items.sort((a, b) => {
            // put directories at the front
            if (a instanceof Directory && b instanceof File) {
                return -1
            }
            if (b instanceof Directory && a instanceof File) {
                return 1
            }

            // newer at the fronter position
            return b.createTime - a.createTime
        })
    }
    indexing(indexName="static") {
        if (!isExist(indexFilePath)) {
            mkdirSync(indexFilePath)
        }
    
        const currentFiles = []
        const currentDirs  = []
        let directoryDescription
        let isInversed = false

        for (const item of this.items) {
            if (item instanceof File) {
                if (["README.md", "readme.md", "读我.md"].includes(item.name)) {
                    directoryDescription = readFileSync(item.path, "utf-8")
                    continue
                }
                if (item.name === "rev" || item.name === "倒序") {
                    isInversed = true
                    continue
                }
                currentFiles.push(item.name)
            } else if (item instanceof Directory) {
                currentDirs.push(item.name + "/")
                item.indexing(indexName + "+" + item.name)
            } else { /* unreachable */ }
        }
    
        if (isInversed) {
            currentFiles.reverse()
            currentDirs.reverse()
        }
        const currentDirItems = currentDirs.concat(currentFiles)
    
        const sliced = slice(currentDirItems)
        const count  = sliced.length
    
        let index = 0
        for (const slice of sliced) {
            index += 1
            const indexFileContent = {
                total: count,
                current: index,
                content: slice,
            }
            if (index === 1 && directoryDescription !== undefined) {
                // directory description only appear at page 1
                indexFileContent.directoryDescription = directoryDescription
            }
            writeFileSync(
                `${indexFilePath}${indexName}_${index}`,
                JSON.stringify(indexFileContent)
            )
        }
    }

    static clear(path) {
        if (!isExist(path)) {
            return
        }
    
        const dirContent = readdirSync(path)
        for (const file of dirContent) {
            const filePath = path + file
            const isFile = statSync(filePath).isFile()
            if (isFile) {
                unlinkSync(filePath)
            }
        }
    }
}

export class File {
    name = ""
    path = ""
    createTime = 0
    modifyTime = 0

    constructor(name, path, createTime, modifyTime) {
        this.name = name
        this.path = path
        this.createTime = createTime
        this.modifyTime = modifyTime
    }
}
