import config from "../../build.config.js"

// input: [RssItem]
// output: RssXmlString
export default function(items) {
    const RssTemplateBefore = `\
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>${config.title ? config.title : "Markdown Blog"}</title>
<link>${config.homepage ? config.homepage : "https://bhznjns.github.io/markdown-blog-template"}</link>
${config.description ? `<description>${config.description}</description>` : ""}
`
    const RssTemplateAfter = `</channel>
</rss>`

    const itemsString = items.map(item => item.toString()).join("");
    return RssTemplateBefore + itemsString + RssTemplateAfter
}