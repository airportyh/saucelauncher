module.exports = {
  BrowserMatcher: require('./sauce_launcher/browser_matcher'),
  SauceCache:     require('./sauce_launcher/sauce_cache'),
  SauceClient:    require('./sauce_launcher/sauce_client'),
  SauceConfig:    require('./sauce_launcher/sauce_config'),
  SauceConnect:   require('./sauce_launcher/sauce_connect'),
  SauceDriver:    require('./sauce_launcher/sauce_driver'),
  TempFile:       require('./sauce_launcher/temp_file'),
  util:           require('./sauce_launcher/util')
};
