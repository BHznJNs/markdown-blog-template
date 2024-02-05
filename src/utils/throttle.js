export default function(callback, waitMillisecond) {
    let timer = null
    let hasBeenCalled = false

    return function(...args) {
        let result
        if (!hasBeenCalled) {
            result = callback(...args)
            hasBeenCalled = true;
        }

        timer = setTimeout(() => {
            hasBeenCalled = false
        }, waitMillisecond)
        return result
    }
}
