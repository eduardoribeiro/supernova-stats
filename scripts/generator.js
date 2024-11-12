var date = new Date(),
 formattedDate = date.toISOString().split('T')[0].replaceAll('-', ''),
 fileName = process.argv.slice(2)[2],
 crawlFrom = process.argv.slice(2)[3],
 regex;
switch(fileName){
    case('shared'):
        regex = /^[^\/]+\/shared\/?(?:[^\/]+\/?)*$/;
        break;
    case ('supernova'):
        regex = /^@icapitalnetwork\/supernova-[^\/]*(\/[^\/]*)*$/;
        break;
    case ('rcl'):
        regex = /^@icapitalnetwork\/react-component-library(\/[^\/]*)*$/;
        break;
    case ('bootstrap'):
        regex = /^react-bootstrap(\/[^\/]*)*$/;
        break;
    default:
        regex = /^[^\/]+\/shared\/?(?:[^\/]+\/?)*$/;
        break;
}

console.log('Generating reports for '+fileName);
console.log('Now crawling '+ crawlFrom);

module.exports = {
    crawlFrom: crawlFrom,
    includeSubComponents: true,
    importedFrom: regex,
    exclude: [
        `${crawlFrom}/**/!(*.test|*.spec).@(js|ts)?(x)`,
        `${crawlFrom}/__tests__/**/*.@(js|ts)?(x)`
    ],
    processors: [
        ["count-components", {
            outputTo: `./${fileName}/stats-${formattedDate}.json`
        }],
        ["raw-report", {
            outputTo: `./${fileName}/details-${formattedDate}.json`
        }]
    ]
};
