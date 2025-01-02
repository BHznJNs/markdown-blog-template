import renderer from "./index.js"
import { Para } from "./node.js"
import languageSelector from "../../../src/utils/languageSelector.js"
import config from "../../../build.config.js"

export class ArticleInfo {
    title       = ""
    description = ""
    htmlContent = ""
    constructor(title, description, htmlContent) {
        this.title       = title
        this.description = description
        this.htmlContent = htmlContent
    }
}

function getDescription(htmlNodes) {
    let description = ""
    for (const node of htmlNodes) {
        if (node instanceof Para) {
            description = node.content
            break
        }
    }
    return description
}

const htmlLang = languageSelector("zh-CN", "en")
function pageTemplate(title, body, origin) {
    return `\
<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="../dist/style.min.css">
</head>
<body>
<script>
const darkModeMediaQuery = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
const darkModeSwitcher = () => {
    const isDarkMode = darkModeMediaQuery.matches
    document.body.classList.toggle("dark" ,  isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)
}
if (darkModeMediaQuery) {
    darkModeMediaQuery.addListener(darkModeSwitcher)
    darkModeSwitcher()
}
</script>
<article>
    ${body}
    <p><a href="${config.homepage + "#" + origin}">
        ${languageSelector("点此查看原文", "Click here to read original article")}
    </a></p>
</article>
</body>
</html>`
}

export default function(path, source) {
    const htmlNodes = renderer(source)

    const title       = htmlNodes[0].content
    const description = getDescription(htmlNodes)
    const htmlBody    = htmlNodes.map(node => node.toHTML()).join("")
    const htmlContent = pageTemplate(title, htmlBody, path)

    return new ArticleInfo(title, description, htmlContent)
}
