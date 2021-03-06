const application = require('./application')
const applicationApplyAgain = require('./application-apply-again')
const applicationWithChoices = require('./application-with-choices')

module.exports = {
  applications: {
    12345: application,
    12346: applicationApplyAgain,
    ABCDE: applicationWithChoices
  },
  find_url: 'http://search-and-compare-ui-pr-442.herokuapp.com',
  flags: {
    address_lookup: false,
    self_amend_email_address: false,
    self_amend_contact_details: false
  },
  visits_from_find: 0
}
