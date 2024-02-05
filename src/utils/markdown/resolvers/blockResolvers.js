import { ChartBlock, CodeBlock, DetailsBlock, FormulaBlock, Iframe, IframeBlock } from "../node.js"

export function blockResolverGenerator(endSign, targetClass) {
    return function(firstLine, lines) {
        const description = firstLine.slice(3)

        let content = ""
        while (lines.length) {
            const l = lines.shift()

            if (l === endSign) {
                break
            }

            content += l + "\n"
        }
        return new targetClass(content, description)
    }
}

export const codeResolver    = blockResolverGenerator("```", CodeBlock)
export const chartResolver   = blockResolverGenerator("!!!", ChartBlock)
export const detailsResolver = blockResolverGenerator(">>>", DetailsBlock)
export const formulaResolver = blockResolverGenerator("$$$", FormulaBlock)
export function iframeResolver(firstLine, lines) {
    const blockResolver = blockResolverGenerator("@@@", IframeBlock)

    if (!firstLine.startsWith("@@@")) {
        // link to out resource
        return new Iframe(firstLine)
    }
    return blockResolver(firstLine, lines)
}
