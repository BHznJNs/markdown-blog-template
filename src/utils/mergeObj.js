export default 
function mergeObj(destObj={}, srcObj={}) {
    for (const key of Object.keys(srcObj)) {
        const isDestKeyObj = typeof destObj[key] === "object"
        const isSrcKeyObj  = typeof srcObj [key] === "object"
        const isKeyInDest  = key in destObj

        if (isKeyInDest && !isDestKeyObj) {
            continue
        }
        if (isKeyInDest && isDestKeyObj) {
            if (isSrcKeyObj) {
                mergeObj(destObj[key], srcObj[key])
            }
            continue
        }
        if (!isKeyInDest) {
            if (isSrcKeyObj) {
                destObj[key] = structuredClone(srcObj[key])
            } else {
                destObj[key] = srcObj[key]
            }
        }
    }
    return destObj
}
