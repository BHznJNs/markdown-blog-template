function propSetter(el, props) {
    if (!props) {
        return
    }
    for (const [key, val] of Object.entries(props)) {
        if (val === undefined) {
            continue
        }
        if (val instanceof Function) {
            el[key] = val
        } else {
            el.setAttribute(key, val)
        }
    }
}

function propToString(props) {
    // input: {prop: "value"}
    // output: "prop='value'"
    const htmlValueFormater = val => val.toString().replaceAll("\"", "&quot;") 
    const resultPropStr = Object.entries(props)
        .filter(([_, val]) => val != undefined)
        .map(([key, val]) => `${key}="${htmlValueFormater(val)}"`)
        .join(" ")
    return resultPropStr
}

function contentSetter(el, content) {
    if (content instanceof Array) {
        // array of html element
        for (const childEl of content) {
            el.appendChild(childEl)
        }
    } else if (content instanceof HTMLElement) {
        // single element
        el.appendChild(content)
    } else if (typeof content === "string") {
        // common text
        el.textContent = content
    } else {
        throw Error("Unexpected element content: " + content)
    }
}

export default function el(tagName, content="", props=null) {
    if ("document" in globalThis) {
        // in browser
        if (tagName === "text") {
            return document.createTextNode(content)
        }

        const targetEl = document.createElement(tagName)
        propSetter(targetEl, props)
        contentSetter(targetEl, content)
        return targetEl
    } else {
        // in node.js
        if (content instanceof Array) {
            content = content.join("")
        }
        switch (tagName) {
            case "text":
                return content
            case "hr":
            case "br":
                return `<${tagName}>`
            case "img":
            case "input":
                return `<${tagName} ${props ? propToString(props) : ""}>`
        }
        return `<${tagName}${props ? " " + propToString(props) : ""}>${content}</${tagName}>`
    }
}
