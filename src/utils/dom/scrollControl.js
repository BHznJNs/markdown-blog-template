export function scrollToPos(pos) {
    window.scroll({
        top: pos,
        behavior: "smooth",
    })
}

// return to the position of specific element
export function scrollToEl(el, offset) {
    const scrollTargetPos = el.offsetTop
    const scrollOffset = -offset
    scrollToPos(scrollTargetPos + scrollOffset)
}

// return to the document top
export function scrollToTop() {
    scrollToPos(0)
}
