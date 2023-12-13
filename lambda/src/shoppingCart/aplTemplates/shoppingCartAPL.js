
const { i18n } = require('../../i18n');

function generateCartListDocument(controlId) {
    return {
        type: 'APL',
        version: '1.3',
        import: [
            {
                name: 'alexa-layouts',
                version: '1.1.0'
            }
        ],
        mainTemplate: {
            parameters: [
                'textListData'
            ],
            items: [
                {
                    type: 'Container',
                    width: '100%',
                    height: '100%',
                    items: [
                        {
                            type: 'AlexaTextList',
                            position: 'absolute',
                            theme: '${viewport.theme}',
                            headerTitle: '${textListData.headerTitle}',
                            headerDivider: true,
                            headerBackButtonAccessibilityLabel: 'back',
                            headerBackgroundColor: 'transparent',
                            backgroundColor: 'transparent',
                            backgroundScale: 'best-fill',
                            backgroundAlign: 'center',
                            primaryAction: {
                                type: 'SendEvent',
                                arguments: [
                                    controlId,
                                    '${ordinal}'
                                ]
                            },
                            listItems: '${textListData.items}',
                            headerSubtitle: '${textListData.headerSubtitle}'
                        },
                        {
                            type: 'Container',
                            position: 'absolute',
                            right: '0',
                            top: '40dp',
                            width: '100dp',
                            height: '100dp',
                            items: [
                                {
                                    type: 'Image',
                                    width: '60',
                                    height: '60',
                                    source: 'https://ask-portiao.s3-us-west-2.amazonaws.com/cart.png',
                                    align: 'top-right',
                                    scale: 'fill'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        layouts: {}
    };
}

module.exports = {
    generateCartListDocument
};
