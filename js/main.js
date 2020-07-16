/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
import ko from "knockout";
import ViewWBS from './viewmodels/wbs.js';
import '../less/theme.less';
import '../css/wbs.css';
import '../css/normalize.css';

let viewWBS = new ViewWBS([]);
ko.applyBindings(viewWBS);