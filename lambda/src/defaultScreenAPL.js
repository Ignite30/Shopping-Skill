function generateDefaultScreenDocument() {
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
                'data'
            ],
            items: [
                {
                    type: 'Container',
                    width: '100%',
                    height: '100%',
                    items: [
                        {
                            type: 'AlexaHeadline',
                            headerAttributionImage: "https://ask-portiao.s3-us-west-2.amazonaws.com/list.png",
                            headerTitle: 'Grocery List',
                            headerDivider: true,
                            headerBackgroundColor: 'transparent',
                            primaryText: '',
                            secondaryText: '${data.prompt}',
                            // "footerHintText": "footerHintText",
                            backgroundColor: 'transparent',
                            backgroundScale: 'best-fill',
                            backgroundAlign: 'center',
                        }
                    ]
                }
            ]
        }
    };
}

module.exports = {
    generateDefaultScreenDocument
};
