/*
 * To delete yahoo email, I have to take three actions, 1. select all 2. delete 3. confirm on modal box
 * This automates that
 */
(function(){
  var l=document.getElementsByTagName('input');
  for(var i=0;i<l.length;i++){
    var e=l[i];
    if(e.getAttribute('data-action')=="selectAll-message" && e.type=="checkbox"){
      e.click();
      setTimeout(function(){document.getElementById('btn-delete').click()}, 1000);
      setTimeout(function(){document.getElementById('okModalOverlay').click()}, 1000);
      return;
    }
  }
})();
