import { accessSync, constants } from "node:fs"

export default function(path) {
    try {
        accessSync(path, constants.R_OK | constants.W_OK)
        return true
    } catch(err) {
        return false
    }
}
