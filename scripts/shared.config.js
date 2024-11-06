module.exports = {
    crawlFrom: "../icn_react/src",
    includeSubComponents: true,
    importedFrom: /^[^\/]+\/shared\/?(?:[^\/]+\/?)*$/gm,
    exclude: [
        "../icn_react/src/**/!(*.test|*.spec).@(js|ts)?(x)",
        "../icn_react/src/__tests__/**/*.@(js|ts)?(x)"
    ],
    processors: [
        ["count-components", {
            outputTo: "./legacy/usage.json"
        }],
        ["raw-report", {
            outputTo: "./legacy/usage-details.json"
        }]
    ]
};
