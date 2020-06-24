const utils = require('../../utils')

/**
 * Application: English as a foreign language routes
 */
module.exports = router => {
  // Render review page
  // Note: Must be defined before next route declaration
  router.get('/application/:applicationId/english-language/review', (req, res) => {
    res.render('application/english-language/review')
  })

  router.post('/application/:applicationId/english-language', (req, res) => {
    const applicationData = utils.applicationData(req)
    const { applicationId, id } = req.params
    const { referrer } = req.query
    const { answer } = applicationData['english-language']

    if (answer === 'Yes') {
      path = referrer || `/application/${applicationId}/english-language/type`
    } else {
      path = `/application/${applicationId}/english-language/review`
    }

    res.redirect(path)
  })

  // Render type and details pages
  router.get('/application/:applicationId/english-language/:template(details|type)', (req, res) => {
    const applicationData = utils.applicationData(req)
    const { template } = req.params
    const { referrer } = req.query
    const { type } = applicationData['english-language']

    res.render(`application/english-language/${template}`, {
      referrer,
      type
    })
  })
}
