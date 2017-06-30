'use strict';
const fs = require('fs');
const path = require('path');

import { IFileObject } from './types';

const max_depth: number = 100;

let file_list: IFileObject[] = [];

function enumerate_all(root_path: string, pattern: RegExp, depth: number = 0) {
    if (depth >= max_depth) return;
    const files = fs.readdirSync(root_path);
    if (files) {
        for (let i = 0; i < files.length; i++) {
            let file = path.join(root_path, files[i]);
            let fileStat = fs.statSync(file);

            if (file.match(pattern)) {
                let fileObject: IFileObject = {
                    filename: file,
                    shortname: files[i],
                    size: fileStat.size,
                    birthtime: fileStat.birthtime
                };
                
                file_list.push(fileObject);
            }
            else if (fileStat.isDirectory()) {
                enumerate_all(file, pattern, depth + 1);
            }
        }
    }
}

export default function findAll (rootPath: string, pattern: RegExp): IFileObject[] {
    file_list = [];
    enumerate_all(rootPath, pattern);
    return file_list;
}