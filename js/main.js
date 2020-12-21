/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
import ko from "knockout";
import ViewWBS from './viewmodels/wbs.js';
import '../less/rss_theme.less';

let viewWBS = new ViewWBS([]);
ko.applyBindings(viewWBS);