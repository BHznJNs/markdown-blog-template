import config from "../../../../build.config.js"
import debounce from "../../../utils/debounce.js"
import eventbus from "../../../utils/eventbus/inst.js"
import mergeObj from "../../../utils/mergeObj.js"
import ChartImporter from "./importer.js"

let [
    echarts,
    importChart,
    importComponent,
] = [null, null, null]
const globalOptions = config.echartsOptions

function chartOptionResolver(options={}, libsToImport) {
    const ignoredProps = [
        "color",
        "backgroundColor",
        "darkMode",
        "textStyle",
        "aria",
        "axisPointer",
        "animation",
        "animationThreshold",
        "animationDuration",
        "animationEasing",
        "animationDelay",
        "animationDurationUpdate",
        "animationEasingUpdate",
        "animationDelayUpdate",
        "stateAnimation",
        "blendMode",
        "hoverLayerThreshold",
        "options",
        "useUTC",
        "media",
    ]

    for (const key in options) {
        if (ignoredProps.includes(key)) {
            continue
        }
        if (key === "series") {
            for (const item of options.series) {
                if (!("type" in item)) {
                    continue
                }
                libsToImport.charts.add(item.type)
            }
            continue
        }

        switch (key) {
            case "xAxis":
            case "yAxis":
                libsToImport.components.add("grid")
                continue
            case "radiusAxis":
            case "angleAxis":
                libsToImport.components.add("polar")
                continue
            case "parallelAxis":
                libsToImport.components.add("parallel")
                continue
        }
        libsToImport.components.add(key)
    }
}

async function importChartLibs(chartOptions) {
    const libsToImport = {
        charts: new Set(),
        components: new Set(),
    }
    chartOptionResolver(globalOptions, libsToImport)
    chartOptions.forEach(options =>
        chartOptionResolver(options, libsToImport))

    const chartsToImport = Array.from(libsToImport.charts).map(importChart)
    const componentsToImport = Array.from(libsToImport.components).map(importComponent)
    await Promise.all(chartsToImport.concat(componentsToImport))
        .then(echarts.use)
}

class EchartsImporter extends ChartImporter {
    _targetElList = () => document.querySelectorAll(".echarts-container")

    // event listeners
    #darkmodeObserver = new MutationObserver(_ => {
        for (const el of this._targetElList()) {
            // rerender all chart elements to reset color theme
            this._module.dispose(el)
            this.renderItem(el)
        }
    })
    #resizeEvent() {
        this._targetElList()
            .forEach(el =>
                echarts.getInstanceByDom(el).resize())
    }

    // --- --- --- --- --- ---

    renderItem(el) {
        const isDarkMode = document.body.classList.contains("dark")
        const renderMode = isDarkMode ? "another-dark" : "light"
        const chartInst  = this._module.init(el, renderMode)

        // options merging
        const currentOptions = el.__ChartOptions__
        const globalOptionsCloned = mergeObj({}, globalOptions)
        const finalOptions = mergeObj(globalOptionsCloned, currentOptions)
        chartInst.setOption(finalOptions)
    }

    async beforeRender() {
        const chartOptions = Array.from(this._targetElList())
            .map(el => el.__ChartOptions__)
        try {
            await importChartLibs(chartOptions)
        } catch(err) {
            this.loadErrResolver(err)
        }
    }

    async importModule() {
        const [module, darkTheme] = await Promise.all([
            import("../../../libs/echarts/core.js"),
            import("./echartsAnotherDarkTheme.js"),
        ])
        echarts         = module.default
        importChart     = module.importChart
        importComponent = module.importComponent
        echarts.registerTheme("another-dark", darkTheme.default)

        // dark mode toggling listener
        const body = document.body
        this.#darkmodeObserver.observe(body, {
            attributes: true,
            attributeFilter: ["class"]
        })

        // resize event listeners
        eventbus.on("catalog-toggle", () => {
            setTimeout(this.#resizeEvent.bind(this), 1000)
        })
        window.addEventListener("resize",
            debounce(this.#resizeEvent.bind(this), 200))
        return echarts
    }
}

const inst = new EchartsImporter()
export default inst.render.bind(inst)
