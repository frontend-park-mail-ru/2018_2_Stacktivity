/**
 * dummy!
 * @return {null}
 */
function noop() {
    return null;
}

/**
 * dummy, latter will be used to handle errors
 * @return {null}
 */
export function errorHandler(error) {
    console.log(error);
    return null;
}

/**
 * @function getEventTarget - Returns <a> element
 * @param target - Element on which event was called
 * @return element <a>
 */
export function getEventTarget(target) { // для перехода по ссылкам без перезагрузки
    if (!(target instanceof HTMLAnchorElement)) {
        target = target.closest("a");

        if (!target) {
            return null;
        }
    }

    return target;
}