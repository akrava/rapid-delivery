export const CURRENT_PATH_REDIRECT   = 'CURRENT_PATH_REDIRECT';
export const HISTORY_BROWSER_GO_BACK = 'HISTORY_BROWSER_GO_BACK';

export function redirect(method, path) {
    return {
        type: CURRENT_PATH_REDIRECT,
        payload: {
            method,
            path
        }
    };
}

export function goBack() {
    return {
        type: HISTORY_BROWSER_GO_BACK,
        payload: {}
    };
}