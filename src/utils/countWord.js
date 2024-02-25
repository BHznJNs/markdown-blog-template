const cjkCharPattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu
const euCharPattern  = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+/g
const grCharPattern  = /\p{Script=Greek}+/gu
const arCharPattern  = /\p{Script=Arabic}+/gu
const cyCharPattern  = /\p{Script=Cyrillic}+/gu
const numberPattern  = /(\-|\+)?\d+(\.\d+)?/g

const patternList = [
    cjkCharPattern,
    euCharPattern,
    grCharPattern,
    arCharPattern,
    cyCharPattern,
    numberPattern,
]

export default function countWord(para="") {
    if (para.length === 0) {
        return 0
    }

    const totalCount = patternList
        .map(pattern => {
            const matched = para.match(pattern)
            const count   = matched !== null ? matched.length : 0
            return count
        })
        .reduce((accumulator, current) =>
            accumulator += current)
    
    return totalCount
}