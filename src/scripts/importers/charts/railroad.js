import importStyle from "../style.js"
import ChartImporter from "./importer.js"
import config from "../../../../build.config.js"

const { railroadOptions } = config

class RailroadImporter extends ChartImporter {
    _targetElList = () => document.querySelectorAll(".railroad-container")

    renderItem(el, chartContent) {
        const renderArgs = this._module.concat(el)
        const renderFn = new Function(
            "Diagram",
            "ComplexDiagram",
            "Sequence",
            "Stack",
            "OptionalSequence",
            "AlternatingSequence",
            "Choice",
            "HorizontalChoice",
            "MultipleChoice",
            "Optional",
            "OneOrMore",
            "ZeroOrMore",
            "Group",
            "Start",
            "End",
            "Terminal",
            "NonTerminal",
            "Comment",
            "Skip",
            "Block",
            "targetElement",
            chartContent + ".addTo(targetElement)",
        )
        renderFn.apply(null, renderArgs)
    }

    async importModule() {
        importStyle("./dist/libs/railroad-diagrams/railroad.css")
        const module = await import("../../../libs/railroad-diagrams/railroad.min.js")
        const {
            default: rr,
            Options,
        } = module
        Object.assign(Options, {
            VS                : railroadOptions.verticalGap,
            AR                : railroadOptions.arcRadius,
            INTERNAL_ALIGNMENT: railroadOptions.internalAlignment,
            CHAR_WIDTH        : railroadOptions.charWidth,
            COMMENT_CHAR_WIDTH: railroadOptions.commentCharWidth,
        })
        return [
            rr.Diagram,
            rr.ComplexDiagram,
            rr.Sequence,
            rr.Stack,
            rr.OptionalSequence,
            rr.AlternatingSequence,
            rr.Choice,
            rr.HorizontalChoice,
            rr.MultipleChoice,
            rr.Optional,
            rr.OneOrMore,
            rr.ZeroOrMore,
            rr.Group,
            rr.Start,
            rr.End,
            rr.Terminal,
            rr.NonTerminal,
            rr.Comment,
            rr.Skip,
            rr.Block,
        ]
    }
}

const inst = new RailroadImporter()
export default inst.render.bind(inst)
