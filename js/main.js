/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
import ko from "knockout";
import ViewWBS from './viewmodels/wbs.js';
import css from '../less/rss_theme.less';

let viewWBS = new ViewWBS([]);
ko.applyBindings(viewWBS);