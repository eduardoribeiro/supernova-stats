module.exports = {
    crawlFrom: "../icn_react/src",
    includeSubComponents: true,
    importedFrom: /^@icapitalnetwork\/supernova-[^\/]*(\/[^\/]*)*$/,
    exclude: [
        "../icn_react/src/**/!(*.test|*.spec).@(js|ts)?(x)",
        "../icn_react/src/__tests__/**/*.@(js|ts)?(x)"
    ],
    processors: [
        ["count-components", {
            outputTo: "./supernova/usage.json"
        }],
        ["raw-report", {
            outputTo: "./supernova/usage-details.json"
        }]
    ]
};
