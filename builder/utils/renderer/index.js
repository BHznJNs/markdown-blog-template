import proc from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import Crypto from "crypto-js"
import qrcodeRenderer from "./qrcode.js"
// import echartsRenderer from "./echarts.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const startArgs = [path.resolve(__dirname, "electron-main.js")]

const taskQueue = {
    __list: [],
    push(chartContent, type, savePath) {
        this.__list.push({
            chartContent,
            type,
            savePath,
        })
    },
    async execute() {
        while (this.__list.length) {
            const task = this.__list.shift()
            try {
                await renderer(task)
            } catch(err) {
                console.error("[Renderer Error] " + err)
            }
        }
    }
}

let child    = null
let electron = null
function renderer({chartContent, type, savePath}) {
    // use qrcode-svg 's build-in ssr
    if (type === "qrcode") {
        qrcodeRenderer(chartContent, savePath)
        return
    }
    // use echarts' build-in ssr
    // if (type === "echarts") {
    //     echartsRenderer(chartContent, outputDir + filename)
    //     return
    // }

    return new Promise(async (resolve, reject) => {
        function callback({ msg, errMsg }) {
            if (msg === "page-ready") {
                child.send({ chartContent, savePath })
            }
            if (msg === "window-ready") {
                child.send({ pagename: type })
            }
            if (msg === "render-ended") {
                child.off("message", callback)
                resolve()
            }
            if (msg === "render-error") {
                child.off("message", callback)
                reject(errMsg)
            }
        }

        if (child === null) {
            electron = (await import("electron")).default
            child = proc.spawn(electron, startArgs, {
                stdio: ["inherit", "inherit", "inherit", "ipc"]
            })
        } else {
            child.send({ pagename: type })
        }

        child.on("message", callback)
    })
}
function renderEnd() {
    if (child === null) {
        return
    }
    child.send({ msg: "render-end" })
}

export function render(chartContent, type) {
    const outputDir = "./.rss_resources/"
    const extname = [
        "flowchart",
        "sequence",
        "railroad",
        "qrcode",
    ].includes(type) ? "svg" : "png"
    const filename = `${type}-${Crypto.MD5(chartContent).toString()}.${extname}`
    taskQueue.push(chartContent, type, outputDir + filename)
    return filename
}

export async function execute() {
    await taskQueue.execute()
    renderEnd()
}
