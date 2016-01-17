/*
Scrolls the next image into view, at the end optionally moves to next page
Pass width and height to function which decides how small images to skip
3rd param to function is dir 1=forward -1=backward
*/

function au_next_prev(w,h,dir){

document._au_play_delay = document._au_play_delay||3;

function create_elem(){
  if(document._au_display) return;
  var container = document.createElement("div");
  container.id = 'au_container';
  container.setAttribute("style","position:absolute;");
  var bar = document.createElement("div");
  bar.id = 'au_bar';
  var display = document.createElement("div");
  display.id = 'au_display';
  container.appendChild(bar);
  container.appendChild(display);
  document.body.appendChild(container);
  document._au_display = display;
  document._au_container = container;
  document._au_bar = bar;
}

create_elem();

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
        case 'H'.charCodeAt(0):
            if(document._au_help) show_current_image();
            else show_help();
            stop=true;
            break;
    }
    /* if a number pressed, change delay*/
    if(evt.keyCode >= 49 && evt.keyCode <= 57){
      document._au_play_delay=evt.keyCode-48;
      play_pause();
      play_pause();
      stop = true;
    }
    if(stop){
      evt.preventDefault();
      evt.stopPropagation();
    }
};

function update_container(){
  var display = document._au_display;
  var container = document._au_container;
  var bar = document._au_bar;
  bar.setAttribute("style","display:block;padding-left:5px;font-size:14px;color:white;background-color:blue;width:100%;height:20px;");
  container.setAttribute("style", "box-sizing:border-box;padding:0;width:100%;border:2px solid blue;")
  display.setAttribute("style","width:100%;display:table-cell;vertical-align:middle;text-align:center;padding:4px;background-color:white;");
  display.setAttribute("id", "audisplay");
  display.style.height = (window.innerHeight-24) +'px';
  display.style.width = (window.innerWidth-12) +'px';
}

function update_info(){
  var html = "";
  if(images.length==0){
    html = "No Images > "+w+"x"+h+" found.";
  }else{
    var img = images[document._au_c];
    var html = (document._au_c+1)+'/'+images.length+" ";
    html+= " <small> - "
    if(document._au_play_id) html+="playing";
    else html += "paused";
    html+= " "+document._au_play_delay+"s - h for help"
    html += " - "+img.src+" "+img.width+"x"+img.height+ "</small>"
  }
  show_msg(html);
}
function show_msg(msg){
  var bar = document._au_bar;
  bar.innerHTML = msg;
  update_container();
  document._au_container.scrollIntoView();
}

function show_timed_msg(msg, duration){
  show_msg(msg);
  setTimeout(function(){
    update_info();
  },duration*1000);
}
function show_help(){
  update_container();
  document._au_help = true;
  var display = document._au_display;
  if (display.hasChildNodes()) {
    display.removeChild(display.childNodes[0]);
  }
  var help = document.createElement("div");
  help.setAttribute("style","font-size:20px;line-height:150%;display:block;padding:10px;height:100%;text-align:left;vertical-align:top;");
  var html = [
    "<h2>Help</h2> <ul>",
    "<li>Press <b>h</b> to toggle help</li>",
    "<li>Press next ►  bookmarklet or right arrow key for next image</li>",
    "<li>Press prev ◀  bookmarklet or left arrow key for next image</li>",
    "<li>Press <b>p</b> to play or pause images</li>",
    "<li>Press number keys <b>1</b> to <b>9</b> to change image change time</li>",
    "</ul>"
  ]
  help.innerHTML = html.join("\n");
  display.appendChild(help);
}
function show_current_image(){
  document._au_help = false;
  var display = document._au_display;
  var container = document._au_container;
  update_container();
  if (display.hasChildNodes()) {
    display.removeChild(display.childNodes[0]);
  }

  if(images.length>0){
    var img = images[document._au_c];
    var cimg = img.cloneNode(true);
    cimg.className = 'au_img'
    cimg.style.maxWidth = '100%';
    cimg.style.maxHeight = '100%';
    display.appendChild(cimg);
  }
  update_info();
  container.scrollIntoView();
}

function get_images(){
  var l = document.getElementsByTagName('img');
  /* filter out images*/
  var images = [];
  for(var i=0;i<l.length;i++){
    var e = l[i];
    if(e.width < w) continue;
    if(e.height < h) continue;
    /*  skip our images */
    if(e.className=='au_img') continue;
    images.push(e);
  }
  return images;
}

var images = get_images();
var dir_txt = 'next';
if(dir==-1){
  dir_txt = 'prev';
}
if(document._au_c==null){
  document._au_c = -1;
  if(dir==-1){
    document._au_c = images.length;
  }
}
var c=document._au_c;
c += dir;
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

/* if we are done go to next page */
if(document._au_done){
  change_page();
  return
}
/* we are done show msg to user*/
show_timed_msg("Reached the end of the page, to go to "+dir_txt+" page, click "+dir_txt+" again. <small>msg will close in 10 secs</small>", 10);
document._au_done=true;
};
