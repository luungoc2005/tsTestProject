'use strict';
const fs = require('fs');

import { RootObject, Error, Payload } from './types'

export default function loadData(inputFile: string): string[] {
    try {
        const content: RootObject = JSON.parse(fs.readFileSync(inputFile));
        let retVal: string[] = [];

        if (content.payload) {
            return content.payload
                        .map(item => item.endpoints)
                        .filter(item => item.length)
                        .reduce((leftArray, rightArray) => leftArray.concat(rightArray))
        }
        else {
            return [];
        }
    }
    catch (err) {
        return [];
    }
}