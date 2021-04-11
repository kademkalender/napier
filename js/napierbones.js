// Copyright (C) Thorsten Thormaehlen, Marburg, 2013, All rights reserved
// Contact: www.thormae.de

// This software is written for educational (non-commercial) purpose. 
// There is no warranty or other guarantee of fitness for this software, 
// it is provided solely "as is". 

// Images of the board and the rods are extracted from the photo
// "Napier's Bones" by Brad Montgomery
// http://www.flickr.com/photos/bradmontgomery/8007004337/
// http://creativecommons.org/licenses/by/2.0/deed.en

function UIElement(x, y, width, height, type, ref, subref, slotType) {
  this.x = x;
  this.y = y;
  this.x2 = x + width;
  this.y2 = y + height;
  this.type = type;
  this.ref = ref;
}

function Rod() {
  this.position = [0.0, 0.0];
  this.value = 0;
  this.active = false;
  this.uniqueID = -1;
}

function NapierBonesCtrl(scaleFactor) 
{

  this.rodLines = 12;
  this.rodSpacing = Math.round(56 * scaleFactor);
  this.rodHeight = Math.round(500 * scaleFactor);
  this.rodWidth = Math.round(56 * scaleFactor);
  this.nodes = new Array();
  
  this.init = function() {
    this.nodes.length = 0;
    var id = 0;
    for(var i=0; i < this.rodLines; i++) {
        var rod = new Rod();
        rod.position[0] = Math.round(100 * scaleFactor) + i * this.rodSpacing;
        rod.position[1] = Math.round(10 * scaleFactor);
        rod.value = 0;
        rod.uniqueID = id;
        this.nodes.push(rod);
        id++;
    }
  };
  
  this.getRodsCount = function() {
    return this.nodes.length;
  };
  
  this.getRodPositionX = function(nodeId) {
    return this.nodes[nodeId].position[0];
  };

  this.getRodPositionY = function(nodeId) {
    return this.nodes[nodeId].position[1];
  };
  
  this.activated = function(nodeId) {
    if(nodeId < this.rodLines) {
      this.nodes[nodeId].value++;
     if(this.nodes[nodeId].value > 9) this.nodes[nodeId].value = 0;
    }
  };
}

function NapierBones(parentDivId, imgPath, scaleFactor) {
  var napierBonesCtrl = new  NapierBonesCtrl(scaleFactor);
  var path = imgPath;
  var canvas;
  var divId = parentDivId;
  var hooveredRodColor = "rgba(80, 0, 0, 0.3)";
  var hooveredElement = -1;
  var hooveredRod = -1;
  var uiElements = new Array();
  var that = this;
  var boardImg;
  var rodImgs = new Array();
  
  this.init = function() {
    
    napierBonesCtrl.init();
    
    canvas = document.createElement('canvas');
    if(!canvas) console.log("NapierBones error: can not create a canvas element");
    canvas.id = parentDivId + "_NapierBones";
    canvas.width = Math.round(838 * scaleFactor);
    canvas.height= Math.round(605 * scaleFactor);
    document.body.appendChild(canvas);
    var parent = document.getElementById(divId);
    if(!parent) console.log("NapierBones error: can not find an element with the given name: " + divId);
    parent.appendChild(canvas);
 
    canvas.onmousedown = function(event) {
      canvasMouseDown(event);
    };
    canvas.onmousemove = function(event) {
      canvasMouseMove(event);
    };
    canvas.onmouseup = function(event) {
      canvasMouseUp(event);
    };
    canvas.onmouseup = function(event) {
      canvasMouseUp(event);
    };
    
    boardImg = new Image(); 
    boardImg.src = path+"/img/board.png";
    boardImg.onload = function() { imgLoaded(); };
    for(var i=0; i<10; i++) {
      rodImgs[i]= new Image(); 
      rodImgs[i].src = path+"/img/n"+i+".png";
      rodImgs[i].onload = function() { imgLoaded(); };
    }
    this.update();
  };

  function drawRod(nodeId, ctx) {
    var nodePosX = napierBonesCtrl.getRodPositionX(nodeId);
    var nodePosY = napierBonesCtrl.getRodPositionY(nodeId);

    var dn = new UIElement(nodePosX, nodePosY, napierBonesCtrl.rodWidth, napierBonesCtrl.rodHeight, 0, nodeId, 0, 0);
    uiElements.push(dn);
    ctx.drawImage(rodImgs[napierBonesCtrl.nodes[nodeId].value], nodePosX, nodePosY, Math.round(58*scaleFactor), Math.round(500*scaleFactor));
    
    if (nodeId === hooveredRod) {
      ctx.fillStyle = hooveredRodColor;
      ctx.fillRect(dn.x, dn.y, dn.x2 - dn.x, dn.y2 - dn.y);
    } 
  }

  function higlightRow(i, ctx) {
    var dn = new UIElement( Math.round(40*scaleFactor), Math.round(10*scaleFactor)+i*Math.round(50*scaleFactor), 
                            Math.round(60*scaleFactor), Math.round(50*scaleFactor), 0, i+napierBonesCtrl.rodLines, 0, 0);
    uiElements.push(dn);
    //ctx.strokeStyle = "rgba(255, 0, 0, 1.0)";
    //ctx.strokeRect(dn.x, dn.y, dn.x2 - dn.x, dn.y2 - dn.y);
    if (hooveredRod >=napierBonesCtrl.rodLines && i+napierBonesCtrl.rodLines !== hooveredRod) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(dn.x, dn.y,  Math.round(730*scaleFactor), dn.y2 - dn.y);
    }
  }
  
  function drawRods(ctx) {
    var count = napierBonesCtrl.getRodsCount();
    for (var i = 0; i < count; i++) {
      drawRod(i, ctx);
    }
    for (var i = 0; i < 10; i++) {
      higlightRow(i, ctx);
    }
    
  }

  this.update = function() {
   
    canvas.width = canvas.width;
    
    uiElements.length = 0;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000000';
    
    // draw board
    ctx.drawImage(boardImg,0,0,  Math.round(838 * scaleFactor),   Math.round(605 * scaleFactor) );
    
    // draws all rods
    drawRods(ctx);
  };
  
  function imgLoaded() {
    that.update();
  }
  
  function mouseOverElement(pos) {
    var selectedElement = -1;
    for (var n in uiElements) {
      if (uiElements[n].type !== 2) {
        // not of type "connection"
        if (uiElements[n].x - 1 < pos.x && 
            uiElements[n].x2 + 1 > pos.x && 
            uiElements[n].y - 1 < pos.y && 
            uiElements[n].y2 + 1 > pos.y)
        {
          selectedElement = n;
        }
      } 
    }
    return selectedElement;
  }
  
  function canvasMouseDown(event) {
    var pos = getMouse(event);
    
    // handle selection
    if (!event.altKey && event.which === 1) {
      var selectedElement = mouseOverElement(pos);
      if (selectedElement !== -1) {
        // handle node selection
        if (uiElements[selectedElement].type === 0) {
          var newSelectedRod = uiElements[selectedElement].ref;
          napierBonesCtrl.activated(newSelectedRod);
        }
      }
      that.update();
    } 
    event.preventDefault();
  }

  function canvasMouseUp(event) {
  }

  function canvasMouseMove(event) {
    var pos = getMouse(event);

    hooveredRod = -1;
    var oldHooveredElement = hooveredElement;
    hooveredElement = mouseOverElement(pos);

    if (hooveredElement !== -1) {
        hooveredRod = uiElements[hooveredElement].ref;
    }
    if (oldHooveredElement !== hooveredElement) that.update();
    oldPos = pos;
    event.preventDefault();
  }

  function getMouse(e) {
    var element = canvas;
    var offsetX = 0, offsetY = 0, mx, my;

    // compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    return {x: mx, y: my};
  }
}