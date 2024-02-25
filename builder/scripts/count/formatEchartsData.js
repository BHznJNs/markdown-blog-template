export function formatEchartsDate(timestamp) {
    const date  = new Date(timestamp)
    const year  = date.getFullYear()
    const month = date.getMonth() + 1
    const day   = date.getDate()
    return `${year}-${month}-${day}`
}

export function formatEchartsDataPair([timestamp, data]) {
    const dateStr = formatEchartsDate(timestamp)
    return [dateStr, data]
}
