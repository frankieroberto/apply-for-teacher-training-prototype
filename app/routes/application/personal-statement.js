/**
 * Application: Personal statement routes
 */
module.exports = router => {
  router.get('/application/:applicationId/personal-statement/:view', (req, res) => {
    const referrer = req.query.referrer
    const view = req.params.view

    res.render(`application/personal-statement/${view}`, {
      formaction: referrer || `/application/${req.params.applicationId}`,
      referrer
    })
  })
}
