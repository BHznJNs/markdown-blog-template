export default function mergeObj(destObj={}, srcObj={}) {
    for (const key of Object.keys(srcObj)) {
        if (!(key in destObj)) {
            destObj[key] = srcObj[key]
            continue
        }
        // for properties that is in the `destObj`
        if (typeof destObj[key] !== "object") {
            continue
        }

        // for object properties
        mergeObj(destObj[key], srcObj[key])
    }
    return destObj
}
