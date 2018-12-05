function authenticate(login, password) {
    return {
        type: 'USER_AUTHENTICATE',
        payload: {
            login,
            password
        },
    };
}

export { authenticate };