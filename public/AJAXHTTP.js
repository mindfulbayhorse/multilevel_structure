(function() {
  let httpRequest;

  httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    console.log('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }
  
  httpRequest.onreadystatechange = alertContents;
  httpRequest.open('GET', '/multilevel_structure/manifest.json');
  httpRequest.setRequestHeader('Cache-Control', 'no-cache');
  httpRequest.send();

  function alertContents() {
    try{
       if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          
          let response = JSON.parse(httpRequest.responseText);
  
          let vendor = document.createElement('script');
          vendor.setAttribute('src', response.vendor);
          let body = document.querySelector('body');
          body.appendChild(vendor);
          
          let scriptMain = document.createElement('script');
          scriptMain.setAttribute('src', response.main[1]);
          body.appendChild(scriptMain);
          
          let cssMain = document.createElement('link');
          cssMain.setAttribute('href', response.main[0]);
          cssMain.setAttribute('rel', 'stylesheet');
          let head = document.querySelector('head');
          head.appendChild(cssMain);
          
        } else {
          console.log('There was a problem with the request.');
        }
      }
    }  catch( e ) {
      console.log('Caught Exception: ' + e.description);
    }
  }

}) ();