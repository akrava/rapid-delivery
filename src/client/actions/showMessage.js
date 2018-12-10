export const MESSAGE_SHOW = 'MESSAGE_SHOW';
export const MESSAGE_HIDE = 'MESSAGE_HIDE';

export const typesMessages = {
    error: "ERROR",
    info: "INFO",
    success: "SUCCESS"
};

export const defaultPayload = {
    text: "",
    type: "",
    isViewing: false
};

export function showMessage(text, type) {
    return (dispatch) => {
        dispatch({
            type: MESSAGE_SHOW,
            payload: {
                text,
                type,
                isViewing: true
            }
        });
    
        setTimeout(() => {
            dispatch({
                type: MESSAGE_HIDE,
                payload: { isViewing: false }
            });
        }, 3000);
    };
}