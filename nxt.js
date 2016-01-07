javascript:
/*
Scrolls the next image into view, at the end optionally moves to next page
Pass width and height to function which decides how small images to skip
3rd param to function is dir 1=forward -1=backward
*/

(function(w,h,dir){
var l = document.getElementsByTagName('img');
var dir_txt = 'next';
var c=document._au_c||-1;
if(dir==-1){
  dir_txt = 'prev';
  c=document._au_c||l.length;
}
var i=c;
while(1){
  i += dir;
  if(dir==1 && i == l.length){
    break;
  }
  if(dir==-1 && i == -1){
    break;
  }
  var e = l[i];
  if(e.width < w) continue;
  if(e.height < h) continue;
  document._au_c = c = i;
  /* if we are showing anothere image reset done state*/
  document._au_done=false;
  e.scrollIntoView();
  e.style.height = window.innerHeight +'px';
  return;
}

function change_page(){
  var l = document.getElementsByTagName('a');
  for(var i=0;i<l.length;i++){
    var e = l[i];
    if(dir == 1 &&(e.rel=='next'||e.title.match(/next/i))){
      e.click();
      return;
    }
    if(dir == -1 &&(e.rel=='prev'||e.title.match(/prev/i))){
      e.click();
      return;
    }
  }
  alert("No "+dir_txt+" link found.");
}
function show_msg(msg, duration){
  var el = document.createElement("div");
  el.setAttribute("style","position:absolute;top:40%;left:20%;padding:10px;background-color:white;color:red;border:2px solid red;");
  el.innerHTML = msg;
  setTimeout(function(){
    el.parentNode.removeChild(el);
  },duration*1000);
  document.body.appendChild(el);
  el.scrollIntoView();
  console.log(el);
}
/* if we are done go to next page */
if(document._au_done){
  change_page();
  return
}
/* we are done show msg to user*/
show_msg("Reached the end of the page, to go to "+dir_txt+" page, click "+dir_txt+" again <br><small>msg will close in 10 secs</small>", 10);
document._au_done=true;
})(100, 300, -1);

