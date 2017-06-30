import findAll  from './finder';
import analyseFile from './analyser';
import loadData from './loader';

const fs = require('fs');

const pattern: RegExp = /\.cs$/i;
(function () {
    const mainPath: string = (process.argv.length <= 2) ? "" : 
                                 process.argv[2]
                                .replace("\"", "")
                                .replace("'","");

    const findEndpoints: string[] = findAll(mainPath, pattern)
                    .map(x => analyseFile(x))
                    .filter(x => x.length) // filter empty items
                    .reduce((leftArray, rightArray) => leftArray.concat(rightArray)) // concat all APIs;
                    .map(endpoint => "/" + endpoint.toLowerCase()); // lowercase all

    const allEndpoints: string[] = loadData('./input.json');

    const results: string[] = findEndpoints
            .filter(item => allEndpoints.indexOf(item) === -1)
            .sort()
            .filter((item, pos, array) => (!pos || item.toLowerCase() != array[pos - 1].toLowerCase())); // remove duplicates;

    // results.forEach(item => console.log(item));

    fs.writeFileSync('./output.json', JSON.stringify(results, null, 2));
    
    console.log('Find output in `output.json`');
})()