const fs = require('fs');

const excludedPatterns: RegExp[] = [
    /^\/api\/biztalkconnector\//i,
    /^\/api\/authentication\//i,    
    /^\/api\/authorization\//i,  
    /^\/api\/workflow\//i,
];

(function () {
    const inputFile: string = fs.readFileSync('./output.json', "utf8");
    const input: string[] = JSON.parse(inputFile);

    let retVal = [];

    retVal = input.filter(item => {
        for (let i = 0; i < excludedPatterns.length; i++) {
            if (excludedPatterns[i].exec(item) != null) return false;
        }
        return true;
    });

    fs.writeFileSync('./output.json', JSON.stringify(retVal, null, 2));
    
    console.log('Find output in `output.json`');
})();