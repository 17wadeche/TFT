(function() {
  var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  function addScript( src, d) {
    var s = d.createElement( 'script' );
    s.setAttribute( 'src', src );
    d.body.appendChild( s );
  }
  function loadStyle(href, d, callback){
    for(var i = 0; i < d.styleSheets.length; i++){
      if(d.styleSheets[i].href == href){
        return;
      }
    }
    var head  = d.getElementsByTagName('head')[0];
    var link  = d.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    if (callback) { link.onload = function() { callback(); }; }
    head.appendChild(link);
  }
    if (isIE11) {
      addScript('https://wwwpi-test.corp.medtronic.com/overlaysecureconfigfiles/Interface_ie.js', top.document);
    } else {
      setTimeout(function() {
        addScript('https://wwwpi-test.corp.medtronic.com/overlaysecureconfigfiles/Interface.js', top.document);
      },1000);
      
    }
})();
