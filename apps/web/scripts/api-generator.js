const scanner = require('react-scanner');
const axios = require('axios');
const fs = require('fs');

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
 const config = {
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
}

async function runScanner() {
    const apiUrl = 'http://localhost:4001'
    try { 
        const output = await scanner.run(config);
        const countComponents = fs.readFileSync(`./${flags.package}/stats-${formattedDate}.json`, 'utf-8');
        const rawReport = fs.readFileSync(`./${flags.package}/details-${formattedDate}.json`, 'utf-8');
        // Store data in DB
        await axios.post(`${apiUrl}/update-stats/${flags.package}`, JSON.parse(countComponents));
        await axios.post(`${apiUrl}/update-usage/${flags.package}`, JSON.parse(rawReport));
    } catch(error) {
        console.error('Error running scanner or sending results:', error);
    }
}

runScanner();
