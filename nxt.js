/*
Scrolls the next image into view, at the end optionally moves to next page
Pass width and height to function which decides how small images to skip
3rd param to function is dir 1=forward -1=backward
*/

function au_next_prev(w,h,dir){

document._au_play_delay = document._au_play_delay||3;

function play_pause(){
  if(!document._au_play_id){
    var delay = document._au_play_delay||1;
    document._au_play_id = setInterval(_play, delay*1000);
  }else{
    clearInterval(document._au_play_id);
    document._au_play_id = null;
  }
  update_info(); //refresh
}

function _play(){
  au_next_prev(w,h,dir);
}
/* bind arrow keys */
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var stop = false;
    switch (evt.keyCode) {
        case 37:
            au_next_prev(w,h,-1);
            stop=true;
            break;
        case 39:
            au_next_prev(w,h,1);
            stop=true;
            break;
        case 'P'.charCodeAt(0):
            play_pause();
            stop=true;
            break;
    }
    /* if a number pressed, change delay*/
    if(evt.keyCode >= 49 && evt.keyCode <= 57){
      document._au_play_delay=evt.keyCode-48;
      play_pause();p
      play_pause();
      stop = true;
    }
    if(stop){
      evt.preventDefault();
      evt.stopPropagation();
    }
};

function create_elem(){
  if(document._au_display) return;
  var container = document.createElement("div");
  container.setAttribute("style","position:absolute;");
  var bar = document.createElement("div");
  var display = document.createElement("div");
  container.appendChild(bar);
  container.appendChild(display);
  document.body.appendChild(container);
  document._au_display = display;
  document._au_container = container;
  document._au_bar = bar;
}

function update_info(){
  //info
  var bar = document._au_bar;
  var img = images[document._au_c];
  bar.setAttribute("style","display:block;padding-left:5px;font-size:14px;color:white;background-color:blue;width:100%;height:20px;");
  var html = (document._au_c+1)+'/'+images.length+" ";
  html+= " <small>"
  if(document._au_play_id) html+="(playing ";
  else html += "(paused ";
  html+= document._au_play_delay+"s)"
  html += " <small>"+img.src+" "+img.width+"x"+img.height+ "</small>"
  bar.innerHTML = html;
}

function show_current_image(){
  var img = images[document._au_c];
  create_elem();
  var display = document._au_display;
  var container = document._au_container;
  display.setAttribute("style","display:table-cell;vertical-align:middle;text-align:center;box-sizing:border-box;top:0%;left:0%;padding:4px;background-color:white;;border:2px solid blue;");
  display.setAttribute("id", "audisplay");
  display.style.height = (window.innerHeight-20) +'px';
  display.style.width = window.innerWidth +'px';
  if (display.hasChildNodes()) {
    display.removeChild(display.childNodes[0]);
  }
  var cimg = img.cloneNode(true);
  cimg.style.maxWidth = '100%';
  cimg.style.maxHeight = '100%';
  display.appendChild(cimg);

  update_info();
  document._au_container.scrollIntoView();
}

function get_images(){
  var l = document.getElementsByTagName('img');
  /* filter out images*/
  var images = [];
  for(var i=0;i<l.length;i++){
    var e = l[i];
    if(e.width < w) continue;
    if(e.height < h) continue;
    images.push(e);
  }
  return images;
}

var images = get_images();
var dir_txt = 'next';
var c=document._au_c;
if(c==null) c= -1;
if(dir==-1){
  dir_txt = 'prev';
  c=document._au_c||images.length;
}
c += dir;
console.log(c);
if(c >=0 && c < images.length){
  document._au_done=false; //reset
  document._au_c = c;
  console.log("--",document._au_c)
  show_current_image();
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
};

