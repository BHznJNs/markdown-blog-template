import {
    FormulaBlock, ChartBlock,
    DetailsBlock, CodeBlock,
    IframeBlock, Iframe,
 } from "./node.js"
import { blockResolverGenerator } from "../../../src/utils/markdown/resolvers/index.js"
export {
    listResolver, quoteResolver, tableResolver,
} from "../../../src/utils/markdown/resolvers/index.js"

export const chartResolver   = blockResolverGenerator("!!!", ChartBlock)
export const formulaResolver = blockResolverGenerator("$$$", FormulaBlock)

export const codeResolver    = blockResolverGenerator("```", CodeBlock)
export const detailsResolver = blockResolverGenerator(">>>", DetailsBlock)
export function iframeResolver(firstLine, lines) {
    const blockResolver = blockResolverGenerator("@@@", IframeBlock)

    if (!firstLine.startsWith("@@@")) {
        // link to out resource
        return new Iframe(firstLine)
    }
    return blockResolver(firstLine, lines)
}
