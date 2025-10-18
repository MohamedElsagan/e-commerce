const langMiddleWare = (req, res, next) => {
    let lang = req.params.lang || req.query.lang || req.cookies.lang || "en";
    if (lang !== "en" && lang !== "ar")
        lang = "en";
    req.lang = lang;
    res.cookie("lang", req.lang, {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 1,
        httpOnly: false,
        sameSite: "lax"
    })
    req.i18n.changeLanguage(req.lang);
    req.t = req.i18n.getFixedT(req.lang);

    // console.log("langMiddleWare = " , req.lang);
    // console.log(1);


    next();
}

export { langMiddleWare };