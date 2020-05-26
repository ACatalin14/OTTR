const USER_ROLES = {
    ADMIN: 1,
    USER: 2,
    GUEST: 3,
};

const LAYOUT_ELEMENTS = {
    SEAT_LEFT: 1,
    SEAT_RIGHT: 2,
    SEAT_UP: 3,
    SEAT_DOWN: 4,
    LUGGAGE_RACK: 5,
    TABLE: 6,
    WALL: 7,
    RESERVED_SEAT_LEFT: 8,
    RESERVED_SEAT_RIGHT: 9,
    RESERVED_SEAT_UP: 10,
    RESERVED_SEAT_DOWN: 11,
    SELECTED_SEAT_LEFT: 12,
    SELECTED_SEAT_RIGHT: 13,
    SELECTED_SEAT_UP: 14,
    SELECTED_SEAT_DOWN: 15,
    RESERVING_SEAT_LEFT: 16,
    RESERVING_SEAT_RIGHT: 17,
    RESERVING_SEAT_UP: 18,
    RESERVING_SEAT_DOWN: 19
};

const CONSTANTS = {
    USER_ROLES,
    USER_GROUPS: {
        AUTHENTICATED: [
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ],
        ADMIN_ONLY: [
            USER_ROLES.ADMIN
        ],
        UNAUTHENTICATED: [
            USER_ROLES.GUEST
        ]
    },
    LAYOUT: {
        GRID_MARGIN: 1,
        ELEMENTS: LAYOUT_ELEMENTS
    },
    ERRORS: {
        LOGIN_FAILED: 'Login failed. Please check your credentials.',
        UNREACHABLE_SERVER: 'Couldn\'t contact the server.'
    },

    // refresh selected seats to remind server to not unselect them
    SEAT_SELECTION_REFRESH_TIMEOUT: 4 * 60 * 1000,

    SERVER_URL: '/api'
};

export default CONSTANTS;