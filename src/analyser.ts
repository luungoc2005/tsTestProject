'use strict';
const fs = require('fs');
const path = require('path');

import { IFileObject } from './types';

const baseModuleRegex: RegExp = /\s:\sbasemodule/i;
const baseAPIRegex: RegExp = /base\(("(?:[^"\\]+|\\.)*")/i;

export default function analyseFile (inputFile: IFileObject): string[] {
    try {
        const content: string = stripComments(fs.readFileSync(inputFile.filename, "utf8"));
        let retVal: string[] = [];

        if (!baseModuleRegex.exec(content)) return retVal;

        const matches = baseAPIRegex.exec(content);

        if (matches) {
            const basePath: string = matches[1]
                                    .replace(/"|'/gi, "")

            retVal = getAllRoutes(content)
                    .map(route => path.join(basePath, route))
                    .map(path => normalizePath(path));
            // retVal.push(basePath);
            return retVal;
        }
        else {
            return retVal;
        }
    }
    catch (err) {
        console.error(`Error analysing file ${JSON.stringify(inputFile)}`)
        console.error(`Error message: ${err}`)
        return [];
    }
}

const allAPIRegex: RegExp = /((get)|(put)|(post)|(delete))(\[.*\])/gi;
function getAllRoutes(content: string) : string[] {
    let retVal: string[] = [];
    let apiMatches: string[];
    while ((apiMatches = allAPIRegex.exec(content)) !== null) {
        let routes: string[] = JSON.parse(apiMatches[apiMatches.length - 1]);

        if (routes && routes.length > 0) {
            retVal = retVal.concat([routes[routes.length - 1]]);
        }
    }

    retVal = retVal
            .filter(x => x.length > 0) // Remove empty items
            .map(route => sanitizeRoute(route))
            .filter(x => x.indexOf(' ') === -1) // Remove items with spaces
            .sort()
            .filter((item, pos, array) => !pos || item.toLowerCase() != array[pos - 1].toLowerCase()); // remove duplicates

    return retVal;
}

const routeParamRegex: RegExp = /{.*}/gi;

function sanitizeRoute(route: string): string {
    return route
        .replace(/"|'/gi, "")
        .replace(routeParamRegex, ''); // Remove all route params
}

function normalizePath(path: string): string {
    return path.split('\\')
            .filter(seg => seg.length > 0)
            .join('/');
}

const commentsRegex: RegExp = /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/mg;
function stripComments(fileContent: string): string {
    return fileContent.replace(commentsRegex, '');
}