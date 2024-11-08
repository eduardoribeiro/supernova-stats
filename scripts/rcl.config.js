module.exports = {
    crawlFrom: "../icn_react/src",
    includeSubComponents: true,
    importedFrom: /^@icapitalnetwork\/react-component-library(\/[^\/]*)*$/,
    exclude: [
        "../icn_react/src/**/!(*.test|*.spec).@(js|ts)?(x)",
        "../icn_react/src/__tests__/**/*.@(js|ts)?(x)"
    ],
    processors: [
        ["count-components", {
            outputTo: "./rcl/usage.json"
        }],
        ["raw-report", {
            outputTo: "./rcl/usage-details.json"
        }]
    ]
};
