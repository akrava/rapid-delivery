export const CURRENT_PATH_REDIRECT = 'CURRENT_PATH_REDIRECT';

export function redirect(method, path) {
    return {
        type: CURRENT_PATH_REDIRECT,
        payload: {
            method,
            path
        }
    };
}