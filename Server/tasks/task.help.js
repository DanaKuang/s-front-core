/**
 * Author: liubin
 * Create Date: 2017-06-21
 * Description: help
 */
/**
 * [exports description]
 * @return {[type]} [description]
 */
module.exports = function () {
  'use strict';
  var colors = require('colors/safe');

  process.stdout.write(colors.green('                                            \n'));
  process.stdout.write(colors.green('********************************************\n'));
  process.stdout.write(colors.green('*              Author: tztx                *\n'));
  process.stdout.write(colors.green('*              Desc: Web                   *\n'));
  process.stdout.write(colors.green('********************************************\n'));
  process.stdout.write(colors.green('Usage:                                      \n'));
  process.stdout.write(colors.green('       node main.js [default] [build] [help]\n\n'));
  process.stdout.write(colors.green('       [init] [commit] [destroy]            \n\n'));
  process.stdout.write(colors.green('Options:                                    \n'));
  process.stdout.write(colors.green('       build        use gulp to build this project.\n'));
  process.stdout.write(colors.green('       default      run this project.\n'));
  process.stdout.write(colors.green('       help         how to use this project.\n'));
  process.stdout.write(colors.green('       commit [log] commit code by git to gitlab.\n'));
  process.stdout.write(colors.green('       init         init this project.\n\n'));
  process.stdout.write(colors.green('       destroy      *************************\n\n'));
  process.stdout.write(colors.green('tips:                                       \n'));
  process.stdout.write(colors.green('       bugs, Thanks![liubin@saotx.cn]\n'));
}