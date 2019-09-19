const journeys = require('./../../utils/journeys')
const utils = require('./../../utils')

const hasDisclosedEthnicity = (req) => {
  const applicationData = utils.applicationData(req)

  if (applicationData['equality-monitoring']) {
    const answer = applicationData['equality-monitoring']['ethnic-group']
    return answer !== 'Prefer not to say'
  }
}

const hasDisclosedDisability = (req) => {
  const applicationData = utils.applicationData(req)

  if (applicationData['equality-monitoring'] && applicationData['equality-monitoring']['disability-status']) {
    const answer = applicationData['equality-monitoring']['disability-status']
    return answer === 'Yes'
  }
}

const questionPaths = (req) => {
  const applicationId = req.params.applicationId
  const basePath = `/application/${applicationId}/equality-monitoring`

  const paths = [
    basePath,
    `${basePath}/sex`,
    // `${basePath}/sexual-orientation`,
    `${basePath}/disability-status`,
    ...(hasDisclosedDisability(req) ? [`${basePath}/disabilities`] : []),
    `${basePath}/ethnic-group`,
    ...(hasDisclosedEthnicity(req) ? [`${basePath}/ethnic-background`] : []),
    // `${basePath}/religious-belief`,
    `${basePath}/review`
  ]

  return journeys.nextAndBackPaths(paths, req)
}

/**
 * Application: Equality monitoring routes
 */
module.exports = router => {
  router.get('/application/:applicationId/equality-monitoring/:view?', (req, res) => {
    const applicationId = req.params.applicationId
    const basePath = `/application/${applicationId}/equality-monitoring`
    const referrer = req.query.referrer
    const referrerPath = referrer ? `?referrer=${referrer}` : ''
    const view = req.params.view || 'index'
    const paths = questionPaths(req)
    let formaction = referrer || paths.next

    if (view === 'ethnic-group') {
      formaction = `${basePath}/ethnic-group/answer${referrerPath}`
    }

    if (view === 'disability-status') {
      formaction = `${basePath}/disability-status/answer${referrerPath}`
    }

    res.render(`application/equality-monitoring/${view}`, {
      formaction,
      paths,
      referrer
    })
  })

  // Ethnic group answer branching
  router.post('/application/:applicationId/equality-monitoring/ethnic-group/answer', (req, res) => {
    const applicationId = req.params.applicationId
    const basePath = `/application/${applicationId}/equality-monitoring`
    const referrer = req.query.referrer

    let path
    if (hasDisclosedEthnicity(req)) {
      path = `${basePath}/ethnic-background`
    } else {
      path = referrer || `${basePath}/review`
    }

    res.redirect(`${path}?${utils.queryString(req)}`)
  })

  // Disability answer branching
  router.post('/application/:applicationId/equality-monitoring/disability-status/answer', (req, res) => {
    const applicationId = req.params.applicationId
    const basePath = `/application/${applicationId}/equality-monitoring`
    const referrer = req.query.referrer

    let path
    if (hasDisclosedDisability(req)) {
      path = `${basePath}/disabilities`
    } else {
      path = referrer || `${basePath}/ethnic-group`
    }

    res.redirect(`${path}?${utils.queryString(req)}`)
  })
}
