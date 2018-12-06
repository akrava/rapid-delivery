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