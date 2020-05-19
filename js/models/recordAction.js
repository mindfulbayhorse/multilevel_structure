/**
 * Deliverables attributes
 * Olga Zhilkova
 * Actions for each deliverable
 */
export default function(id, title, exec) {

    this.id = id;
    this.text = title;
    this.disabled = ko.observable(false);
    this.click = exec;
    
    return this;
    
}