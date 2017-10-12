#!/usr/bin/env node
let program = require('commander');
let jade = require('jade');
let fs = require('fs');
let normal = require('./normal');
let globalPath = process.cwd();

program
    .version('0.0.1')
    .option('-n, --normal', 'create normal project dir')
    .option('-p, --pc', 'create pc project dir')
    .option('-m, --mobile', 'create mobile project dir')
    // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);
if (program.normal && program.pc) normal('pc', globalPath);
if (program.normal && program.mobile) normal('mobile', globalPath);

// if (program.pc) console.log('pc');
// if (program.normal) console.log('normal');
// console.log('  - %s cheese', program.cheese);