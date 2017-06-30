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
            if (content.length > 0) {
                retVal = content.split(/\r\n/g)
                        .filter(item => item.length)
                        .map(endpoint => endpoint.toLowerCase())
            }
        }

        return retVal;
    }
    catch (err) {
        return [];
    }
}