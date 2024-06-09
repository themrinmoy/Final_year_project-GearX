module.exports = (req, res, next) => {

    res.locals.warningMessage = req.query.warning || '';
    res.locals.warningMessage = req.query.success || '';
    res.locals.warningMessage = req.query.info || '';
    next();
}
