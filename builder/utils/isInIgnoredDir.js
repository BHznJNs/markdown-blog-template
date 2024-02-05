import { staticPath } from "./path.js"

export default function(path, ignoredDirs) {
    if (!ignoredDirs) {
        return false
    }

    for (const dirName of ignoredDirs) {
        if (path.startsWith(staticPath + dirName)) {
            return true
        }
    }
    return false
}
