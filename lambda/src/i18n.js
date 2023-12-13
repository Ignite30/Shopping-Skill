const i18n = require('i18next').default;
// i18n strings for all supported locales
const languageStrings = require('./languageStrings');

function updateI18n(locale) {
    i18n.init({
        lng: locale,
        fallbackLng: 'en',
        resources: languageStrings,

    });
}

module.exports = {
    i18n,
    updateI18n
};
