import { writeFileSync } from "node:fs"
import { formatEchartsDate, formatEchartsDataPair } from "./formatEchartsData.js"
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

function classifyDataByYear(dataPairs) {
    const yearsMap = new Map()
    for (const [timestamp, data] of dataPairs) {
        const year = new Date(timestamp).getFullYear()
        if (!yearsMap.has(year)) {
            yearsMap.set(year, 0)
        }
        const currentCount = yearsMap.get(year) + data
        yearsMap.set(year, currentCount)
    }
    return {
        years: Array.from(yearsMap.keys()).reverse(),
        data: Array.from(yearsMap.values()).reverse(),
    }
}

function injectedScriptGenerator(lastYearData, multiYearData) {
    const startDate  = formatEchartsDate(now - oneYear)
    const endDate    = formatEchartsDate(now)

    const lastYearOption = {
        width: 900,
        height: 240,
        title: {
            top: 20,
            left: "center",
            text: languageSelector("年度字数统计", "Word Count in the Last Year"),
        },
        visualMap: {
            show: false,
            type: "piecewise",
            pieces: [
                {min: 0, max: 200},
                {min: 200, max: 500},
                {min: 500, max: 1500},
                {min: 1500, max: 3000},
                {min: 3000, max: 6000},
                {min: 6000},
            ]
        },
        calendar: {
            top: 80,
            left: 30,
            right: 30,
            cellSize: ["auto", 16],
            range: [startDate, endDate],
            yearLabel: { show: false }
        },
        series: {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: lastYearData.map(formatEchartsDataPair)
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
    const injectedScript = `\
<script type="module">
import echartsImporter from "./src/scripts/importers/charts/echarts.js"

document.querySelector("#last-year").__ChartOptions__ = ${JSON.stringify(lastYearOption)}
document.querySelector("#past-years").__ChartOptions__ = ${JSON.stringify(pastYearsOption)}
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
</div>`
    return resultContent 
}

export default function(startTime, dateList, totalCount) {
    const startDate = new Intl.DateTimeFormat().format(new Date(startTime))
    const lastYearData = dateList
        .filter(([timestamp, _]) =>
            isWithinLastYear(timestamp))
        .reverse()
    const multiYearData = classifyDataByYear(dateList)
    const injectedScript = injectedScriptGenerator(lastYearData, multiYearData)
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
