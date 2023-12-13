const { DateControlValidations, ContainerControl, DateControl } = require('ask-sdk-controls');

class DeliveryInformationControl extends ContainerControl {
    constructor(props) {
        super(props);

        this.addChild(
            new DateControl({
                id: 'deliveryDate',
                interactionModel: {
                    targets: ['deliveryDate'],
                },
                validation: DateControlValidations.FUTURE_DATE_ONLY,
                prompts: {
                    requestValue: 'When would you like to buy these items?',
                    valueSet: (act) => `Okay! Shopping is scheduled to be on ${act.payload.value}.`
                }
            })
        );
    }
}

module.exports = {
    DeliveryInformationControl
};
