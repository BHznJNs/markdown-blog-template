import { writeFileSync } from "node:fs"
import { formatEchartsDate, insertDataIntoMap } from "./utils.js"
import { countHTMLPath } from "../../utils/path.js"
import languageSelector from "../../../src/utils/languageSelector.js"
import {
    header, navigator, footer,
    inlineDarkmodeSwitcherScript,
} from "../../indexTemplate.js"

const now = Date.now()
const oneYear = 365 * 24 * 60 * 60 * 1000
function isWithinLastYear(timestamp) {
    return now - oneYear <= timestamp
}

function classifyDataByDay(metadataList) {
    const resultMap = new Map()
    for (const {date, count} of metadataList) {
        if (!isWithinLastYear(date)) {
            continue;
        }
        insertDataIntoMap(resultMap, [formatEchartsDate(date), count])
    }
    return Array.from(resultMap.entries())
}

function classifyDataByYear(metadataList) {
    const yearsMap = new Map()
    for (const { date, count } of metadataList) {
        const year = new Date(date).getFullYear()
        insertDataIntoMap(yearsMap, [year, count])
    }
    return {
        years: Array.from(yearsMap.keys()).reverse(),
        data: Array.from(yearsMap.values()).reverse(),
    }
}

function classifyDataByCatalog(metadataList) {
    const historyCatalogMap = new Map()
    const annualCatalogMap = new Map()
    for (const { date, catalog, count } of metadataList) {
        const kvPair = [catalog, count]
        insertDataIntoMap(historyCatalogMap, kvPair)
        if (isWithinLastYear(date)) {
            insertDataIntoMap(annualCatalogMap, kvPair)
        }
    }

    const historyData = []
    const annualData = []
    for (const [key, value] of historyCatalogMap) {
        historyData.push({ name: key, value })
    }
    for (const [key, value] of annualCatalogMap) {
        annualData.push({ name: key, value })
    }
    return { historyData, annualData }
}

function injectedScriptGenerator(lastYearData, multiYearData, multiCatalogData) {
    const startDate = formatEchartsDate(now - oneYear)
    const endDate = formatEchartsDate(now)
    const paddingWidth = 4

    const lastYearOption = {
        width: 1200,
        height: 280,
        title: {
            top: 20,
            left: "center",
            text: languageSelector("年度字数统计", "Word Count in the Last Year"),
        },
        visualMap: {
            show: false,
            type: "piecewise",
            pieces: [
                { min: 0, max: 300 },
                { min: 300, max: 600 },
                { min: 600, max: 1500 },
                { min: 1500, max: 3000 },
                { min: 3000, max: 6000 },
                { min: 6000 },
            ]
        },
        calendar: {
            top: 80,
            left: 36,
            right: 30,
            cellSize: 24,
            range: [startDate, endDate],
            yearLabel: { show: false }
        },
        series: {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: lastYearData,
        }
    }
    const pastYearsOption = {
        title: {
            top: 30,
            left: "center",
            text: languageSelector("历年字数统计", "Word Counts for the Past Years")
        },
        xAxis: {
            type: "category",
            data: multiYearData.years,
        },
        yAxis: { type: "value" },
        grid: {
            top: 80,
            left: 75,
        },
        dataZoom: {
            type: "slider",
            startValue: 0,
            endValue: 5,
            zoomLock: true,
        },
        series: {
            data: multiYearData.data,
            type: "bar",
        }
    }
    const catalogsOption = {
        title: [
            {
                text: languageSelector("各分类年度字数统计", "Word Counts of Catalogs\nfor the Last Year"),
                left: "2%",
                top: "10%",
                textAlign: "left",
            },
            {
                text: languageSelector("各分类历年字数统计", "Word Counts of Catalogs\nfor the Past Years"),
                left: "96%",
                bottom: "10%",
                textAlign: "right",
            },
        ],
        series: [
            {
                type: "pie",
                left: "42%",
                right: paddingWidth,
                top: paddingWidth,
                bottom: "40%",
                data: multiCatalogData.annualData,
            },
            {
                type: "pie",
                left: paddingWidth,
                right: "42%",
                top: "40%",
                bottom: paddingWidth,
                data: multiCatalogData.historyData,
            }
        ],
    }

    const injectedScript = `\
<script type="module">
import echartsImporter from "./src/scripts/importers/charts/echarts.js"

document.querySelector("#last-year").__ChartOptions__ = ${JSON.stringify(lastYearOption)}
document.querySelector("#past-years").__ChartOptions__ = ${JSON.stringify(pastYearsOption)}
document.querySelector("#catalogs").__ChartOptions__ = ${JSON.stringify(catalogsOption)}
echartsImporter()
</script>`
    return injectedScript
}

function bodyContentGenerator(startDate, totalCount) {
    const resultContent = `\
<h1>${languageSelector("统计信息", "Statistics")}</h1>
<p>${languageSelector(
    `自 <b>${startDate}</b> 以来，你共撰写 <b>${totalCount}</b> 字。`,
    `Since <b>${startDate}</b>, You have written <b>${totalCount}</b> words.`,
)}</p>
<p>${languageSelector(
    "下面是你在过去一年中每一天输出的字数：",
    "The chart following shows the word count you outputed in the last year:"
)}</p>
<div class="media-container">
<div class="echarts-container" id="last-year"></div>
</div>
<p>${languageSelector(
    "下面是你在过去几年中每一年输出的字数：",
    "The chart following shows the word count you outputed in the past few years:"
)}</p>
<div class="media-container">
<div class="echarts-container" id="past-years"></div>
</div>
<p>${languageSelector(
    "下面是你在各个分类下输出的字数：",
    "The chart following shows the word count you outputed in the different catalogs:"
)}</p>
<div class="media-container">
<div class="echarts-container" id="catalogs"></div>
</div>`
    return resultContent
}

export default function (startTime, metadataList, totalCount) {
    const lastYearData = classifyDataByDay(metadataList)
    const multiYearData = classifyDataByYear(metadataList)
    const multiCatalogData = classifyDataByCatalog(metadataList)
    
    const startDate = new Intl.DateTimeFormat().format(new Date(startTime))
    const injectedScript = injectedScriptGenerator(lastYearData, multiYearData, multiCatalogData)
    const bodyContent = bodyContentGenerator(startDate, totalCount)

    const template = `\
<!DOCTYPE html>
<html lang="${languageSelector("zh-CN", "en")}">
${header}
<body>
${inlineDarkmodeSwitcherScript}
${navigator}
<article>
${bodyContent}
</article>
${footer}
${injectedScript}
</body>
</html>`
    writeFileSync(countHTMLPath, template)
}
