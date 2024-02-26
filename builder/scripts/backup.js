import { writeFileSync } from "node:fs"
import readDir, { Directory } from "../utils/readDir.js"
import { backupFilePath } from "../utils/path.js"

const staticDir = new Directory("static")
readDir(staticDir, "")

const backupData = JSON.stringify(staticDir)
writeFileSync(backupFilePath, backupData)
