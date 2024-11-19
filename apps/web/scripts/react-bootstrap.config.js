module.exports = {
    crawlFrom: "../icn_react/src",
    includeSubComponents: true,
    importedFrom: /^react-bootstrap(\/[^\/]*)*$/,
    exclude: [
        "../icn_react/src/**/!(*.test|*.spec).@(js|ts)?(x)",
        "../icn_react/src/__tests__/**/*.@(js|ts)?(x)"
    ],
    processors: [
        ["count-components", {
            outputTo: "./other-packages/react-bootstrap-usage.json"
        }],
        ["raw-report", {
            outputTo: "./other-packages/react-bootstrap-usage-details.json"
        }]
    ]
};
