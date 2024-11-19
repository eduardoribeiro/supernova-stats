var date = new Date(),
 formattedDate = date.toISOString().split('T')[0].replaceAll('-', ''),
 args = process.argv.slice(2),
 flags = {},
 regex;


args.forEach(function(arg, index){
    if(arg.startsWith('--')){
        flags[arg.replace('--', '')] = args[index + 1];
    }
});

switch(flags.package){
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

console.log('Generating reports for '+flags.package);
console.log('Now crawling '+flags.from);

module.exports = {
    crawlFrom: flags.from,
    includeSubComponents: true,
    importedFrom: regex,
    exclude: [
        `${flags.from}/**/!(*.test|*.spec).@(js|ts)?(x)`,
        `${flags.from}/__tests__/**/*.@(js|ts)?(x)`
    ],
    processors: [
        ["count-components", {
            outputTo: `./${flags.package}/stats-${formattedDate}.json`
        }],
        ["raw-report", {
            outputTo: `./${flags.package}/details-${formattedDate}.json`
        }]
    ]
};
