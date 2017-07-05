'use strict';
const fs = require('fs');

import { RootObject, Error, Payload } from './types'

export default function loadData(inputFile: string): string[] {
    try {
        const content: string = fs.readFileSync(inputFile, "utf8");

        let retVal: string[] = [];

        try {
            const input: RootObject = JSON.parse(content);
            if (input.payload) {
                retVal = input.payload
                            .map(item => item.endpoints)
                            .filter(item => item.length)
                            .reduce((leftArray, rightArray) => leftArray.concat(rightArray))
                            .map(endpoint => endpoint.toLowerCase())
            }
        }
        catch (parseErr) {
            return loadLines(content);
        }

        return retVal;
    }
    catch (err) {
        return [];
    }
}


export function loadFilter() {
    try {
        const content: string = fs.readFileSync('./filter.json', "utf8");
        return loadLines(content);
    }
    catch (err) {
        return [];
    }
}

function loadLines(content: string): string[] {
    if (typeof(content) === 'string' && content.length > 0) {
        return content.split(/\r\n/g)
                    .filter(item => item.length)
                    .map(endpoint => endpoint.toLowerCase());
    }
    else {
        return [];
    }
}