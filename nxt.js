/*
Scrolls the next image into view, at the end optionally moves to next page
Pass width and height to function which decides how small images to skip
*/

(function(w,h){
var c=(document._c||-1)+1;
var l = document.getElementsByTagName('img');
for(var i=c;i<l.length;i++){
  var e = l[i];
  if(e.width < w) continue;
  if(e.height < h) continue;
  document._c = c = i;
  e.scrollIntoView();
  e.style.height = window. innerHeight +'px';
  return;
}
if(confirm('Done with all images, go to next page?')){
  var l = document.getElementsByTagName('a');
  for(var i=0;i<l.length;i++){
    var e = l[i];
    if(e.rel=='next'||e.title.match(/next/i)){
      e.click();
      return;
    }
  }
  alert("No next link found.");
}
})(100, 300);
