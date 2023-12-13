const { ContainerControl, ContainerControlProps, ControlInput, InputUtil, ControlResultBuilder, LiteralContentAct, NonUnderstandingAct } = require('ask-sdk-controls');
const { ShoppingCartControl } = require('./shoppingCart/shoppingCartControl');
const { DeliveryInformationControl } = require('./checkout/deliveryInformationControl');         

const { i18n } = require('./i18n');
/* personalization Utility */
const personalizationUtil = require('./personalizationUtil')

class GroceryShopControl extends ContainerControl {
    /**
     * Constructs a new instance of the GroceryShopControl
     *
     * @param {ContainerControlProps} props
     */
    constructor(props) {
        super(props);
        this.handleFunc = undefined;

        this.cartControl = new ShoppingCartControl({ id: 'cart' });
         this.deliveryControl = new DeliveryInformationControl({ id: 'delivery' });
        this.addChild(this.cartControl)
            .addChild(this.deliveryControl);
            

    }
    async canHandle(input) {
        if (await this.canHandleByChild(input)) { // NOTE: The await is important (and easy to forget)
            this.handleFunc = this.handleByChild;
            return true;
        }
        else if (InputUtil.isLaunchRequest(input)) {
            this.handleFunc = this.handleLaunchRequest;
            return true;
        }
        else if (InputUtil.isSessionEndedRequest(input)) {
            this.handleFunc = this.handleSessionEndedRequest;
            return true;
        }
        else if (InputUtil.isFallbackIntent(input)) {
            this.handleFunc = this.handleFallbackIntent;
            return true;
        }
        else if (input.request.type === 'IntentRequest' && input.request.intent.name === 'AMAZON.CancelIntent') {
            this.handleFunc = this.handleCancelIntent;
            return true;
        }
        else if (input.request.type === 'IntentRequest' && input.request.intent.name === 'AMAZON.StopIntent') {
            this.handleFunc = this.handleStopIntent;
            return true;
        }
        else if (input.request.type === 'IntentRequest' && input.request.intent.name === 'AMAZON.HelpIntent') {
            this.handleFunc = this.handleHelpIntent;
            return true;
     }
        console.log('WARN: Nothing wants this input. A new clause may be required.');
        return false;
    }

    /**
     * Handle the input
     *
     * This implementation assumes that canHandle() has returned true and that it set `this.handleFunc` appropriately
     *
     * @param {ControlInput} input
     * @param {ControlResultBuilder} resultBuilder
     */
    async handle(input, resultBuilder) {
        await this.handleFunc(input, resultBuilder);
    }

    async handleLaunchRequest(input, resultBuilder) {
        const name = personalizationUtil.getPersonalizedPrompt(input.handlerInput);
        if (name && name.length > 0) {
            resultBuilder.addAct(new LiteralContentAct(this, { promptFragment: i18n.t('WELCOME_MSG_PERSONALIZED', { name }) }));
        } else {
            resultBuilder.addAct(new LiteralContentAct(this, { promptFragment: i18n.t('WELCOME_MSG', { name }) }));
        }
    }

    async handleSessionEndedRequest(input, resultBuilder) {
        resultBuilder.endSession();
    }

    async handleCancelIntent(input, resultBuilder) {
        resultBuilder.enterIdleState();
    }
    async  handleHelpIntent(input, resultBuilder) {
             resultBuilder.addAct(new LiteralContentAct(this, { promptFragment: i18n.t('CATEGORY_CONTROL_ALL_VALUE')}));
    }

    async handleStopIntent(input, resultBuilder) {
        resultBuilder.endSession();
    }
    async handleFallbackIntent(input, resultBuilder) {
        resultBuilder.addAct(new NonUnderstandingAct(this));
    }

    async decideHandlingChild(candidates, input) {
        // always decide in favor of the cart as checkout only makes sense when the cart is complete.
        // expect for the special-case of FallbackIntent. (see super.decideHandlingChild())
        return !InputUtil.isFallbackIntent(input) && candidates.includes(this.cartControl)
            ? this.cartControl
            : super.decideHandlingChild(candidates, input);
    }

    async decideInitiativeChild(candidates, input) {
        // always decide in favor of the cart as checkout only makes sense when the cart is complete.
        return candidates.includes(this.cartControl) ? this.cartControl : super.decideHandlingChild(candidates, input);
    }

    renderAct(act, input, responseBuilder) {
        if (act instanceof NonUnderstandingAct) {
            console.log('GroceryShopControl is handling this specific FallbackIntent / NonUnderstandingAct');
            responseBuilder.addPromptFragment(i18n.t('GROCERY_SHOP_CONTROL_NON_UNDERSTANDING'));
            return;
        }
        super.renderAct(act, input, responseBuilder);
    }
}

exports.GroceryShopControl = GroceryShopControl;
