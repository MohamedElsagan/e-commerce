const cookieUtlis = {
    HTTP_ONLY: true,
    SAME_SITE: "lax",
    SECURE: true,
    MAX_AGE_ACCESS_TOKEN: 1000 * 60 * 30,
    MAX_AGE_REFRESH_TOKEN: 1000 * 60 * 60 * 24 * 7,
    PATH: "/"
}
export { cookieUtlis }