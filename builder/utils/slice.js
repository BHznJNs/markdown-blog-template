import config from "../../build.config.js"

// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//                             ||
//                             ||
//                             \/
// [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
// 
// returns deep clone of input iterator
const { pageCapacity } = config
export default function(itemList) {
    let startIndex = 0
    let remainItemCount = itemList.length - (startIndex + 1)
    if (remainItemCount <= pageCapacity) {
        return [ structuredClone(itemList) ]
    } else {
        const slices = []
        while (remainItemCount > pageCapacity) {
            const listSlice = itemList.slice(startIndex, startIndex + pageCapacity)
            slices.push(structuredClone(listSlice))
            remainItemCount -= pageCapacity
            startIndex += pageCapacity
        }
        if (itemList.length) {
            const listSlice = itemList.slice(startIndex, startIndex + pageCapacity)
            slices.push(structuredClone(listSlice))
        }
        return slices
    }
}
