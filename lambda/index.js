const { SkillBuilders, getLocale } = require('ask-sdk-core');
const { getSupportedInterfaces } = require('ask-sdk-core');
const { ControlManager, ControlResponseBuilder, renderActsInSequence, ControlResult, ControlInput, Control, ControlHandler } = require('ask-sdk-controls');
const { GroceryShopControl } = require('./src/GroceryShopControl');
const { generateDefaultScreenDocument } = require('./src/defaultScreenAPL');

const { updateI18n } = require('./src/i18n');
class GroceryShopControlManager extends ControlManager {
    createControlTree() {
        return new GroceryShopControl({ id: 'root' });
    }
    render(result, input, responseBuilder) {
        renderActsInSequence(result.acts, input, responseBuilder);

        if (!responseBuilder.isDisplayUsed()) {
            console.log('ShowDefaultScreenAct: rendering...');
            if (getSupportedInterfaces(input.handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                const aplDataSource = {
                    data: {
                        prompt: responseBuilder.getPrompt()
                    }
                };
                responseBuilder.addAPLRenderDocumentDirective('defaultScreen', generateDefaultScreenDocument(), aplDataSource);
            }
        }
    }
}

const controlHandler = new ControlHandler(new GroceryShopControlManager());

const LocalizationRequestInterceptor = {
    process(handlerInput) {
        const locale = getLocale(handlerInput.requestEnvelope);
        updateI18n(locale);
    }
};

// Export the handler for AWS Lambda and local-debugger.js
exports.handler = SkillBuilders.custom()
    .addRequestHandlers(controlHandler)
    .withCustomUserAgent(`FruitShopDemo(JS) ${controlHandler.userAgentInfo()}`)
    .addRequestInterceptors(LocalizationRequestInterceptor)
    .lambda();

// Export the control manager for use in build_interaction_model and tests
exports.GroceryShopControlManager = GroceryShopControlManager;
