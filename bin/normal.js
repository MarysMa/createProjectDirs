#!/usr/bin/env node

let fs = require('fs');
let path = require('path');
let jade = require('jade');
let index_opt = {
    'css': [],
    'js': []
};
let root_dir = '';

let normal = (type, globalpath) => {
    var dirsJson;
    root_dir = globalpath;
    switch (type) {
        case 'pc':
            dirsJson = require('../libs/dir_conf/normal_pc.json');
            break;
        case 'mobile':
            dirsJson = require('../libs/dir_conf/normal_m.json');
            break;
    }
    createDir(type, dirsJson);
}

let createDir = (type, create_dir) => {
    let parent_dir = root_dir;
    if (!create_dir.SubDir || !create_dir.SubDir.length) return false;
    let count = 0;
    for (let i = 0; i < create_dir.SubDir.length; i++) {
        let dir_path = parent_dir + '\\' + create_dir.SubDir[i].Name;
        if (fs.existsSync(dir_path)) continue;
        fs.mkdir(dir_path, (err) => {
            if (err) throw err;
            count++;
            copyeFile(dir_path, create_dir.SubDir[i].Plgs);
            createFile(dir_path, create_dir.SubDir[i].Files);
            if (count === create_dir.SubDir.length) {
                createIndexHtml(type);
            }
            createDir(dir_path, create_dir.SubDir[i]);
        })
    }
}

let createFile = (filedir, files) => {
    if (!files || !files.length) return false;
    let dir_path = '',
        writable;
    for (let i = 0; i < files.length; i++) {
        dir_path = filedir + '\\' + files[i];
        let file_ex = path.extname(dir_path).replace('.', '');
        index_opt[file_ex].push(dir_path.replace(root_dir, '.').split('\\').join('/'))
        writable = fs.createWriteStream(dir_path);
    }
}

let copyeFile = (filedir, files) => {
    if (!files || !files.length) return false;
    let dir_path = '',
        readable,
        writable;
    for (let i = 0; i < files.length; i++) {
        dir_path = filedir + '\\' + files[i];
        if (!fs.existsSync(path.join(__dirname, '../libs/plgs/') + files[i])) continue;
        let file_ex = path.extname(dir_path).replace('.', '');
        index_opt[file_ex].push(dir_path.replace(root_dir, '.').split('\\').join('/'))
        readable = fs.createReadStream(path.join(__dirname, '../libs/plgs/') + files[i]);
        writable = fs.createWriteStream(dir_path);
        readable.pipe(writable);
    }
}

let createIndexHtml = (mode, link) => {
    let mode_dir = '';
    switch (mode) {
        case 'pc':
            mode_dir = path.join(__dirname, '../libs/jade/index_pc.jade');
            break;
        case 'mobile':
            mode_dir = path.join(__dirname, '../libs/jade/index_m.jade');
            break;
    }
    let html = jade.renderFile(mode_dir, {
        filename: 'index',
        pretty: true,
        css_link: index_opt['css'],
        js_src: index_opt['js']
    })
    var html_file = fs.writeFile('./index.html', html)
}

module.exports = normal;