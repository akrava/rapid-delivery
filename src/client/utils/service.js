export function isAdmin(role) {
    return role === 3;
}

export function isDefaultUser(role) {
    return role === 0;
}

export function isOrganization(role) {
    return role === 1;
}

export function isStaffUser(role) {
    return role === 2;
}

export function authorizationHeaders(jwt) {
    return {
        headers: { Authorization: `Bearer ${jwt}` }
    }; 
}

export function formDataToJson(formData) {
    const object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    return JSON.stringify(object);
}