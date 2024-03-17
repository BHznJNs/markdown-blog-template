export default {
    /**
     * homepage: String
     * the URL that this site deployed, is used to generate the rss.xml file
     * 此站点部署的 URL，用于生成 rss.xml 文件
     */
    homepage: "https://bhznjns.github.io/markdown-blog-template/",

    /**
     * title: String
     * the title of blog HTML document, will be shown in the tabbar of browser
     * 博客 HTML 文档的标题，会被展示在浏览器的标签栏
     */
    title: "Markdown Blog Template Documentation",

    /**
     * description: String
     * the description for the site, is necessary for RSS.
     * 网站的描述，对于 RSS 功能是必要的。
     */
    description: "A markdown static blog site.",

    /**
     * footer: String
     * the footer for this site, can be deleted if you do not need it
     * 站点的脚注，如果你不需要可以删除
     */
    footer: "Powered by [MarkdownBlogTemplate](https://github.com/BHznJNs/markdown-blog-template)::",

    /**
     * language: String
     * "zh" => Simplified Chinese 简体中文
     * "en" => English            英文
     */
    language: "en",

    /**
     * enableFab: Boolean
     * used to enable / disable the FAB buttons
     * 用来启用/禁用浮动操作按钮
     */
    enableFab: true,
    /**
     * fabOrdering: [String]
     * defines the ordering of FAB buttons, if you do need some FAB button, just remove it
     * 定义浮动操作按钮的顺序，如果你不需要某个浮动操作按钮，直接将其移除即可
     */
    fabOrdering: [
        "catalogSwitcher",
        "downsizeText",
        "enlargeText",
        "backToParent",
        "backToTop",
    ],

    /**
     * enableCatalog: Boolean
     * used to enable / disable the catalog feature
     * 用来启用/禁用文章目录功能
     */
    enableCatalog: true,

    /**
     * enableRSS: Boolean
     * used to enable / disable the RSS function, if you do not want add blogs in some directory to the `rss.xml` , just add it into the `rssIgnoreDir`
     * 用来启用/禁用 RSS 发布功能，如果你不想将某些文件夹的内容添加到 `rss.xml` 中，将其添加到 `rssIgnoreDir` 中
     */
    enableRSS: false,
    rssIgnoreDir: [/* directories in `static`*/],

    /**
     * enableNewest: Boolean | Object<value: Boolean, ignoreDir: [String]>
     * used to enable / disable the Newest function, if you do not want add blogs in some directory, just add it into the `newestIgnoreDir`
     * 用来启用/禁用 最新博文 功能，如果你不想将某些文件夹的内容添加到其中，将其添加到 `newestIgnoreDir` 中
     */
    enableNewest: false,
    newestIgnoreDir: [/* directories in `static`*/],

    /**
     * enableSearch: Boolean
     * used to enable / disable the Search feature
     * 用来启用/禁用搜索功能
     */
    enableSearch: true,

    /**
     * searchPageThreshold: Number
     * used to set the paging threshold for the search index, larger to set less page and slower index loading
     * 用来设置搜索索引的分页阈值，越大分页越少且索引加载越慢
     */
    searchPageThreshold: 30000,

    /**
     * pageCapacity: Number
     * defined the amount of the items in every page
     * 定义每一页展示的博文数
     */
    pageCapacity: 10,

    /**
     * RSSCapacity: Number
     * defined the amount of the items in `rss.xml`
     * 定义 `rss.xml` 中包含的博文个数
     */
    RSSCapacity: 16,

    /**
     * previewPort: Number
     * defined the port id for preview server
     * 为预览服务器定义端口
     */
    previewPort: 3000,

    /**
     * katexOptions: Object
     * options for katex.js rendering, see here: https://katex.org/docs/options
     * katex.js 用于渲染数学公式的配置项，见此：https://katex.org/docs/options
     */
    katexOptions: {
        // leqno: false, // like `\usepackage[leqno]{amsmath}` in LaTeX
        // fleqn: false, // like `\documentclass[fleqn]` in LaTeX with the amsmath package
        // macros: {},
        // minRuleThickness: 0.04,
        // maxSize: Infinity,
        // maxExpand: 1000,
        // globalGroup: false,
    },

    /**
     * echartsOptions: Object
     * the global general config options for echarts.js rendering, see here: https://echarts.apache.org/zh/option.html
     * echarts.js 用于渲染图表的通用配置项，见此：https://echarts.apache.org/zh/option.html
     */
    echartsOptions: {
        tooltip: {
            show: true,
            backgroundColor: "rgb(255,255,255,.9)"
        }
    },

    /**
     * flowchartOptions: Object
     * the global general config options for flow chart rendering, see here: https://flowchart.js.org/
     * 流程图渲染的全局配置项，见此：https://flowchart.js.org/
     */
    flowchartOptions: {
        // "x": 0,
        // "y": 0,
        // "line-width": 3,
        // "line-length": 50,
        // "text-margin": 10,
        // "font-size": 14,
        // "font-color": "black",
        // "line-color": "black",
        // "element-color": "black",
        // "fill": "white",
        // "yes-text": "yes",
        // "no-text": "no",
        // "arrow-end": "block",
        // "scale": 1,
        //// style symbol types
        // "symbols": {
        //     "start": {
        //         "font-color": "red",
        //         "element-color": "green",
        //         "fill": "yellow"
        //     },
        //     "end": {
        //         "class": "end-element"
        //     }
        // },
        //// even flowstate support ;-)
        // "flowstate": {
        //     "past": { "fill": "#CCCCCC", "font-size": 12 },
        //     "current": { "fill": "yellow", "font-color": "red", "font-weight": "bold" },
        //     "future": { "fill": "#FFFF99" },
        //     "request": { "fill": "blue" },
        //     "invalid": { "fill": "#444444" },
        //     "approved": { "fill": "#58C4A3", "font-size": 12, "yes-text": "APPROVED", "no-text": "n/a" },
        //     "rejected": { "fill": "#C45879", "font-size": 12, "yes-text": "n/a", "no-text": "REJECTED" }
        // }
    },

    /**
     * ganttOptions: Object
     * the global general config options for gantt chart rendering, see here: https://github.com/frappe/gantt
     * 甘特图渲染的全局配置项，见此：https://github.com/frappe/gantt
     */
    ganttOptions: {
        // header_height: 50,
        // column_width: 30,
        // step: 24,
        // view_modes: ["Quarter Day", "Half Day", "Day", "Week", "Month"],
        // bar_height: 20,
        // bar_corner_radius: 3,
        // arrow_curve: 5,
        // padding: 18,
        // view_mode: "Day",
        // date_format: "YYYY-MM-DD",
        // custom_popup_html: null

        //// language options: "es", "it", "ru", "ptBr", "fr", "tr", "zh", "de", "hu"
        //// 语言选项："es", "it", "ru", "ptBr", "fr", "tr", "zh", "de", "hu"
        //// languages property here will be the same with upper `language` as default
        //// 这里的 languages 属性默认会与前文中指定的 `language` 相同
        // language: "en",
    },

    /**
     * railroadOptions: Object
     * the global general config options for railroad chart rendering, see here: https://github.com/tabatkins/railroad-diagrams/blob/gh-pages/README-js.md
     * 铁路图渲染的全局配置项，见此：https://github.com/tabatkins/railroad-diagrams/blob/gh-pages/README-js.md
     */
    railroadOptions: {
        verticalGap: 8, // the minimum amount of vertical separation between two items
        arcRadius: 10,  // the radius of the arcs

        // when some branches of a container are narrower than others, this determines how they're aligned in the extra space.
        // values: "center" | "left" | "right"
        internalAlignment: "center",

        charWidth: 8.5, // the approximate width of characters in normal text, ignored for text diagrams
        commentCharWidth: 7, // the approximate width of character in Comment text
    },

    /**
     * qrcodeOptions: Object
     * the global general config options for qrcode rendering, see here: https://github.com/papnkukn/qrcode-svg
     * 二维码渲染的全局配置项，见此：https://github.com/papnkukn/qrcode-svg
     */
    qrcodeOptions: {
        content: "default content", // default content for all qrcodes
        padding: 4, // white space padding, 4 modules by default, 0 for no border
        width: 256, // QR Code width in pixels
        height: 256, // QR Code height in pixels
    }
}
