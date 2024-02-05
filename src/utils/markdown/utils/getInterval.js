// ("abc]", "]") -> "abc"
export default function getInterval(text, endSign, includeEscape=false) {
    if (!text.includes(endSign)) {
        return null
    }

    let intervalText = ""
    let isEscape = false

    while (text.length) {
        const ch = text.slice(0, 1)
        text = text.substr(1)

        if (ch === "\\") {
            isEscape = !isEscape
            if (!includeEscape) {
                continue
            }
        }
        if (ch === endSign && !isEscape) {
            break
        }
        intervalText += ch
        isEscape = false
    }

    return intervalText
}
