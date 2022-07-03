/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
import ko from "knockout";
import ViewWBS from './viewmodels/wbs.js';
import css from '../less/rss_theme.less';
import html from '../assets/html/wbs.html';
document.createElement('div');
let nameHtml = html.split('\\');
console.log(fetch(nameHtml[nameHtml.length - 1]));

//var _ = require('lodash');

let viewWBS = new ViewWBS([]);
ko.applyBindings(viewWBS);