// exports.get404 = (req, res, next) => {

//     res.status(404).render('404', {
//         pageTitle: 'Page Not Found', path: '/404',
//         isAuthenticated: req.isAuthenticated(),
//         username: req.user ? req.user.username : null
//     })

// }


exports.get404 = (req, res, next) => {
   

    // console.log('404 handler called for path:', req.originalUrl);
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404',
        isAuthenticated: req.isAuthenticated(),
    });
};
