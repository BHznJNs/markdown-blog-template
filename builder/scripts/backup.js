import { writeFileSync } from "node:fs"
import { Directory } from "../utils/directory.js"
import { backupFilePath } from "../utils/path.js"

const staticDir = new Directory("static")
staticDir.read()

const backupData = JSON.stringify(staticDir)
writeFileSync(backupFilePath, backupData)
