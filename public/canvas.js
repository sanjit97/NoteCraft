const canvas = document.querySelector('canvas'); //Getting the canvas element
canvas.width = window.innerWidth; //Setting the width of canvas
canvas.height = window.innerHeight; //Setting the height of canvas
let pencilColor = 'red';
let eraserColor = 'white';
let pencilWidth = 3;
let eraserWidth = 5;

let mousedown = false;
const pencilColorCont = document.querySelectorAll('.pencil-color');
const pencilWidthElement = document.querySelector('.pencil-width');
const eraserWidthElement = document.querySelector('.eraser-width');
const downloadCanvasIcon = document.querySelector('.fa-download');
const undoIcon = document.querySelector('.fa-rotate-left');
const redoIcon = document.querySelector('.fa-rotate-right');

let undoRedoTracker = new Array(); //Stack for storing the images for each graphics
let track = 0; // Latest used image from the tracker stack

const tool = canvas.getContext('2d'); //Using the API provided by canvas to leverage graphics
tool.strokeStyle = pencilColor; //Setting default colour
tool.lineWidth = pencilWidth; //Setting default width

canvas.addEventListener('mousedown', e => {
    mousedown=true;
    let data = {
        x:e.clientX,
        y:e.clientY
    }
    socket.emit('beginPath',data) //data will go to the server, first param is a unique identifier, 2nd is the data that is required to be sent
});

canvas.addEventListener('mousemove', e => {
    if(mousedown){
        let data = {
            x:e.clientX,
            y:e.clientY,
            strokeStyle:showEraserTool ? eraserColor : pencilColor,
            lineWidth:showEraserTool ? eraserWidth : pencilWidth
        }
        socket.emit('drawPath',data) //data will go to the server, first param is a unique identifier, 2nd is the data that is required to be sent
    }
});

canvas.addEventListener('mouseup', e => {
    mousedown=false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
});

undoIcon.addEventListener('click', e => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker:[...undoRedoTracker]
    }
    undoRedoCanvasFn(data);
});

redoIcon.addEventListener('click', e => {
    if (track < undoRedoTracker.length-1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker:[...undoRedoTracker]
    }
    undoRedoCanvasFn(data);
});

downloadCanvasIcon.addEventListener('click', e=>{
    downloadCanvas(e);
});

function beginPath(strokeObject){
    tool.beginPath();
    tool.moveTo(strokeObject.x,strokeObject.y);
}

function drawPath(strokeObject){
    tool.strokeStyle = strokeObject.strokeStyle;
    tool.lineWidth = strokeObject.lineWidth;
    tool.lineTo(strokeObject.x,strokeObject.y);
    tool.stroke();
}

pencilColorCont.forEach(color => {
    color.addEventListener('click',e=>{
        pencilColor = color.classList[0];
        tool.strokeStyle = color.classList[0];
    })
});

pencilWidthElement.addEventListener('change',e=>{
    pencilWidth = e.target.value;
    tool.lineWidth = e.target.value;
    tool.strokeStyle = pencilColor;
});

eraserToolIcon.addEventListener('click', e=>{
    if(showEraserTool){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
});

eraserWidthElement.addEventListener('change',e=>{
    eraserWidth = e.target.value;
    tool.lineWidth = e.target.value;
    tool.strokeStyle = eraserColor;
});

const downloadCanvas = (e) => {
    const canvasURL = canvas.toDataURL();
    const anchorElement = document.createElement('a');
    anchorElement.setAttribute('href',canvasURL);
    anchorElement.download = 'board.jpg';
    anchorElement.click();
}

function undoRedoCanvasFn(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = [...trackObj.undoRedoTracker];
    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.setAttribute('src',url);
    img.onload = function() {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

//When you get data from server for beginPath, call the required function
socket.on("beginPath",(data)=>{
    //Data is received from server
    beginPath(data);
});

//When you get data from server for drawPath, call the required function
socket.on("drawPath",(data)=>{
    //Data is received from server
    drawPath(data);
})