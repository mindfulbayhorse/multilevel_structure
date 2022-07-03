/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
import ko from "knockout";
import ViewWBS from './viewmodels/wbs.js';
import css from '../less/rss_theme.less';

import html from '../assets/html/wbs.html';
let appRoot = document.createElement('div');
appRoot.innerHTML = html;
document.body.appendChild(appRoot);

let viewWBS = new ViewWBS([]);
ko.applyBindings(viewWBS);