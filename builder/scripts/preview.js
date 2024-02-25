import os from "node:os"
import express from "express"
import config from "../../build.config.js"

const app = express()
const port = config.previewPort

function getLANIpAddress() {
    const ifaces = os.networkInterfaces()

    for (const dev in ifaces) {
        const iface = ifaces[dev]

        for (let i = 0; i < iface.length; i++) {
            const { family, address, internal } = iface[i]

            if (family === "IPv4" && address !== "127.0.0.1" && !internal) {
                return address
            }
        }
    }
}

app.use("/preview", express.static("./"))
app.use("/rss_resources", express.static("./.rss_resources"))

const LAN_IP = getLANIpAddress()
if (LAN_IP) {
    app.listen(port, "0.0.0.0", () => {
        // listen in LAN
        console.log(`Listening: http://${LAN_IP}:${port}/preview/`)
    })
}

app.listen(port, () => {
    // listen in localhost
    console.log(`Listening: http://localhost:${port}/preview/`)
})
