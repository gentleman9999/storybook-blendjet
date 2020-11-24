    (function(e,a){
      var t,r=e.getElementsByTagName("head")[0],c=e.location.protocol;
      t=e.createElement("script");t.type="text/javascript";
      t.charset="utf-8";t.async=!0;t.defer=!0;
      t.src=c+"//front.optimonk.com/public/"+a+"/js/preload.js";r.appendChild(t);
  })(document,"58417");

  (function (win) {
    var history = win.history;
    var htmlTag = document.querySelector('html');
    if (htmlTag) {
      htmlTag.addEventListener('optimonk#ready', function () {
        if (win.OMHistoryOverrided) return;
        var pushState = history.pushState;
        var replaceState = history.replaceState;
        history.pushState = function (state) {
          if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
          }
          return pushState.apply(history, arguments);
        }
        history.replaceState = function(state) {
          if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
          }
          return replaceState.apply(history, arguments);
        }
        history.onpushstate = history.onpopstate = reloadOM;
        function reloadOM() {
          delete OptiMonk.preloadInitialized
          var holders = document.querySelectorAll('.optimonk-holder, .om-holder');
          for (var i = 0; i < holders.length; i++) {
            holders[i].remove();
          }
          OptiMonkRegistry = {};
          var head = document.querySelector('head');
          var oldScriptTag = head.querySelector('script[src*="preload.js"]');
          var scriptTag = document.createElement('script');
 
          scriptTag.setAttribute('src', oldScriptTag.getAttribute('src'));
          oldScriptTag.remove();
          head.appendChild(scriptTag);
        }
        win.OMHistoryOverrided = true;
      });
    }
  })(window);