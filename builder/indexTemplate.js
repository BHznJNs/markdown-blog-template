import { writeFileSync } from "node:fs"
import config from "../build.config.js"
import { indexHTMLPath } from "./utils/path.js"
import renderer from "../src/utils/markdown/index.js"
import languageSelector from "../src/utils/languageSelector.js"

export const header = `\
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light dark">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
${config.description ? `    <meta name="description" content="${config.description}">` : ""}
    <title>${config.title ? config.title : "MarkdownBlog"}</title>
    <link rel="shortcut icon" href="./dist/imgs/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="./dist/style.min.css">
</head>`

export const inlineDarkmodeSwitcherScript = `\
<script>
const darkModeMediaQuery = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
const darkModeSwitcher = () => {
    const isDarkMode = darkModeMediaQuery.matches
    document.body.classList.toggle("dark", isDarkMode)
}
if (darkModeMediaQuery) {
    darkModeMediaQuery.addListener(darkModeSwitcher)
    darkModeSwitcher()
}
</script>`

export const navigator = `\
<nav>
    <a
        id="homepage"
        class="icon-btn underline-side left"
        href="./"
        onclick="globalThis.__CurrentPage__=1"
    >
        <img src="./dist/imgs/homepage.svg" alt="${languageSelector("主页", "home")}">
        <span class="underline-target">${languageSelector("主页", "Home")}</span>
    </a>
    <span>
${(config.enableSearch) ? `\
        <button
            id="search-btn"
            class="icon-btn"
            title="${languageSelector("搜索", "Search")}"
        >
            <img
                src="./dist/imgs/search.svg"
                alt="${languageSelector("搜索", "Search")}"
            >
        </button>` : ""}
${(config.enableRSS) ? `\
        <a
            id="rss-icon"
            class="icon-btn"
            href="./rss.xml"
            title="${languageSelector("RSS 订阅", "RSS Subscribe")}"
        >
            <img
                src="./dist/imgs/rss.svg"
                alt="${languageSelector("RSS 订阅", "RSS Subscribe")}"
            >
        </a>` : ""}
        <span>
            <span
                id="light-btn"
                class="icon-btn"
                role="button"
                tabindex="0"
                title="${languageSelector("亮色模式", "Light Mode")}"
                onclick="document.body.classList.remove('dark')"
            >
                <img
                    src="./dist/imgs/sun.svg"
                    alt="${languageSelector("亮色模式图标", "Light Mode Icon")}"
                >
            </span>
            <span
                id="dark-btn"
                class="icon-btn"
                role="button"
                tabindex="0"
                title="${languageSelector("黑暗模式", "Dark Mode")}"
                onclick="document.body.classList.add('dark')"
            >
                <img
                    src="./dist/imgs/moon.svg"
                    alt="${languageSelector("黑暗模式图标", "Dark Mode Icon")}"
                >
            </span>
        </span>
    </span>
</nav>`

const main = `\
<main data-is-root=true>
    <header id="directory-description"></header>
${config.enableNewest ? `\
    <ul id="newest">
        <li
            tabindex="0"
            onclick="location.hash = 'newest/'"
        >
            ${languageSelector("最新博文", "Newests")}
        </li>
    </ul>` : ""}
    <ul id="previous-dir"><li tabindex="0">../</li></ul>
    <ul id="article-list"></ul>
    <paging-view></paging-view>
</main>`

const article = `\
<div id="article-container">
${config.enableCatalog
    ? "<article-catalog></article-catalog>"
    : ""
}
<article></article>
</div>`

export const footer = config.footer
    ? `<footer>${
        renderer(config.footer)
            .map(node => node.toHTML())
            .join("")
        }</footer>`
    : ""

// --- --- --- --- --- ---

const template = `\
<!DOCTYPE html>
<html lang="${languageSelector("zh-CN", "en")}">
${header}
<body>
<script src="./dist/index.min.js" type="module" defer></script>
${inlineDarkmodeSwitcherScript}
${config.enableSearch
    ? "<search-box></search-box>"
    : ""
}
${config.enableFab
    ? "<fab-icon></fab-icon>"
    : ""
}
${navigator}
${main}
${article}
${footer}
</body>
</html>`

export default () => writeFileSync(indexHTMLPath, template)
