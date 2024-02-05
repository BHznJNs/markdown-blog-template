// input: [RssItem]
// output: RssXmlString
export default function(items) {
    const RssTemplateBefore = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>BHznJNs' Blog</title>
<link>https://bhznjns.github.io/markdown-blog/#static/</link>
<description>一个 Markdown 静态博客站。</description>
`
    const RssTemplateAfter = `</channel>
</rss>`

    const itemsString = items.map(item => item.toString()).join("");
    return RssTemplateBefore + itemsString + RssTemplateAfter
}