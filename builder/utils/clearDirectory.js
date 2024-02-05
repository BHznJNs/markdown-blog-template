import { readdirSync, statSync, unlinkSync } from "node:fs"
import isExist from "./isExist.js"

export default function(path) {
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