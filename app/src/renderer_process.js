import React from 'react';
import ReactDOM from 'react-dom';
import {App} from "./App";
import getQueryFieldNames from "./sql-lexer";
import yaml from "js-yaml";

const fs = require('fs');
const path = require('path');
const {remote} = require('electron');
const win = remote.getCurrentWindow();
const dialog = remote.dialog;

let options = {
    title: "Select a directory with descriptions",
    buttonLabel: "Select",
    properties: ["openDirectory"]
};


function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        if (f.startsWith('.')) return;
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function askForFiles() {
    let filePaths = dialog.showOpenDialog(win, options);
    if (!filePaths) return null;
    const files = [];
    filePaths.forEach(it => walkDir(it, file => {
        files.push(file)
    }));
    const repoBasePath = filePaths[0];
    return {files, repoBasePath}
}

function processFile(fileName, sql_files, descriptions) {
    const data = fs.readFileSync(fileName, 'UTF-8');
    const name = path.basename(fileName);
    if (fileName.endsWith('.sql')) {
        const fieldNames = getQueryFieldNames(data);
        sql_files[name] = {
            name: name,
            file_name: fileName,
            sql: data,
            fields: fieldNames
        }
    } else if (fileName.endsWith('.yaml')) {
        let description = yaml.load(data);
        if (Array.isArray(description)) {
            alert("Incorrect description file: " + fileName);
            return
        }
        description['file_name'] = fileName;
        descriptions[description.sql] = description
    } else {
        // skip
    }
}

function processFiles(files) {
    let sql_files = {};
    let descriptions = {};
    files.forEach(file => processFile(file, sql_files, descriptions));
    return {sql_files, descriptions}
}

function readFileRepository() {
    while (true) {
        const userSelection = askForFiles();
        if (!userSelection) continue;
        const {files, repoBasePath} = userSelection;
        if (!files) continue;
        const data = processFiles(files);
        if (data && Object.keys(data.sql_files).length > 0) {
            data['repo_base_path'] = repoBasePath;
            return data
        }
    }
}

const data = readFileRepository();

ReactDOM.render(<App {...data}/>, document.getElementById('app'));
