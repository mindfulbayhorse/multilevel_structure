/**
 * Bindings provider
 * Olga Zhilkova
 * Provider that controls even handlers of HTML template
 */
export default function (bindingObject) {
    
    this.bindingObject = bindingObject;

    // determine if an element has any bindings
    this.nodeHasBindings = function(node) {
      return node.getAttribute ? node.getAttribute("data-template") : false;
    };

    // return the bindings given a node and the bindingContext
    this.getBindings = function(node, bindingContext) {
      var result = {};
      var classes = node.getAttribute("data-template");
      if (classes) {
        classes = classes.split(' ');
        // evaluate each class, build a single object to return
        for (var i = 0, j = classes.length; i < j; i++) {

          var bindingAccessor = this.bindingObject[classes[i]];

          if (bindingAccessor) {
            
            let binding =  bindingContext;
          
            if (bindingContext.$index && classes[i]==='_index' ) {
              binding = bindingContext.$index();
            } else {
            
            if (typeof bindingAccessor === "function") {
              
                binding = bindingAccessor.call(bindingContext.$data);
              
            } else {
              binding = bindingAccessor;
            } 
            
            }

            ko.utils.extend(result, binding);
          }
        }
      }

      return result;
    };
  };