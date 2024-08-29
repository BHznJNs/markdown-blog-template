import { Directory } from "../utils/directory.js"
import { indexFilePath } from "../utils/path.js"

Directory.clear(indexFilePath)

const staticDir = new Directory("static")
staticDir.read()
staticDir.indexing()
