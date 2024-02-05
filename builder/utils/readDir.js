import { readdirSync, statSync } from "node:fs"

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

export default function readDir(dir, base) {
    const dirPath = base + dir.name
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
            dir.push(readDir(subDir, dirPath + "/"))
        } else {
            const itemModifyTime = itemStat.mtime.getTime()
            const file = new File(
                item,
                itemPath,
                itemCreateTime,
                itemModifyTime,
            )
            dir.push(file)
        }
    }
    dir.items.sort((a, b) => {
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
    return dir
}
