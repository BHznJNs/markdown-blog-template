import { Directory, File } from "./utils/readDir.js"

class FileMonoStack {
    // `children`: where the data are stored,
    // the biggest at the the leftest and
    // the smallest at the rightest.
    children = []
    constructor() {}

    #insert = (index, item) =>
        this.children.splice(index, 0, item)
    get length() {
        return this.children.length
    }

    push(file) {
        if (!this.length) {
            this.children.push(file)
            return
        }

        for (const index in this.children) {
            const item = this.children[index]

            // Since the `createTime` is a timestamp,
            // there is no need to consider the condition of
            // the two number equals.
            if (item.createTime < file.createTime) {
                this.#insert(index, file)
                return
            }
        }
        this.children.push(file)
    }
    pop = () => this.children.shift()
    concat(other) {
        while (other.length) {
            const item = other.children.pop()
            this.push(item)
        }
    }
}

const ignoredFileNames = [
    "README.md", "readme.md", "读我.md",
    "rev", "倒序",
]
export default function getNewest(dir) {
    const fileStack = new FileMonoStack()

    for (const item of dir.items) {
        if (item instanceof File) {
            if (ignoredFileNames.includes(item.name)) {
                continue
            }
            fileStack.push(item)
        } else if (item instanceof Directory) {
            // recursively read folder
            const subFileStack = getNewest(item)
            fileStack.concat(subFileStack)
        }
    }
    return fileStack
}
