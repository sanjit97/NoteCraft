let showTools = true;
let showPencilTool = false;
let showEraserTool = false;

const toggleToolsIcon = document.querySelector(".toggle-tools-div");
const pencilToolIcon = document.querySelector(".fa-pencil");
const eraserToolIcon = document.querySelector(".fa-eraser");
const stickyNoteIcon = document.querySelector(".fa-note-sticky");
const uploadIcon = document.querySelector(".fa-upload");

pencilToolIcon.classList.add('icon-active');

toggleToolsIcon.addEventListener("click", (e) => {
  if (showTools) hideToolContainer();
  else showToolContainer();
});

pencilToolIcon.addEventListener("click", (e) => {
  eraserToolIcon.classList.remove('icon-active');
  pencilToolIcon.classList.add('icon-active');
  if (showPencilTool) hidePencilToolContainer();
  else showPencilToolContainer();
});

eraserToolIcon.addEventListener("click", (e) => {
  pencilToolIcon.classList.remove('icon-active');
  eraserToolIcon.classList.add('icon-active');
  if (showEraserTool) hideEraserToolContainer();
  else showEraserToolContainer();
});

uploadIcon.addEventListener("click", (e) => {
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept",".jpg,.jpeg,.png");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
        `;
        createStickyNote(stickyTemplateHTML);
    })
})

stickyNoteIcon.addEventListener("click", (e) => {
  const stickyTemplate = `
  <div class="header-cont">
      <div class="minimize"></div>
      <div class="remove"></div>
  </div>
  <div class="note-cont">
      <textarea spellcheck="false"></textarea>
  </div>
  `;  
  createStickyNote(stickyTemplate);
});

function hideToolContainer() {
  document.querySelector(".tools-div").style.display = "none";
  toggleToolsIcon.children[0].classList.remove("fa-bars");
  toggleToolsIcon.children[0].classList.add("fa-times");
  showTools = false;
  hidePencilToolContainer();
  hideEraserToolContainer();
}

function showToolContainer() {
  document.querySelector(".tools-div").style.display = "flex";
  toggleToolsIcon.children[0].classList.remove("fa-times");
  toggleToolsIcon.children[0].classList.add("fa-bars");
  showTools = true;
}

function hidePencilToolContainer() {
  document.querySelector(".pencil-tool-cont").style.display = "none";
  showPencilTool = false;
}

function showPencilToolContainer() {
  document.querySelector(".pencil-tool-cont").style.display = "block";
  showPencilTool = true;
  hideEraserToolContainer();
  showEraserTool = false;
}

function hideEraserToolContainer() {
  document.querySelector(".eraser-tool-cont").style.display = "none";
  showEraserTool = false;
}

function showEraserToolContainer() {
  document.querySelector(".eraser-tool-cont").style.display = "block";
  showEraserTool = true;
  hidePencilToolContainer();
  showPencilTool = false;
}

function createStickyNote(stickyTemplate) {
  const stickyCont = document.createElement("div");
  document.body.appendChild(stickyCont);
  stickyCont.classList.add("sticky-cont");
  stickyCont.innerHTML = stickyTemplate;

    const minimize = stickyCont.querySelector('.minimize');
    const remove = stickyCont.querySelector('.remove');

    stickyCont.onmousedown = function(event) {
        dragAndDrop(stickyCont,event);
    };
      
    stickyCont.ondragstart = function() {
        return false;
    };

    stickyActions(minimize,remove,stickyCont);

}

function stickyActions(minimize,remove,stickyCont){
    remove.addEventListener('mouseup', e=> {
        stickyCont.remove();
    })
    
    minimize.addEventListener('mouseup',e => {
        const selectedStickyNoteContent = stickyCont.querySelector('.note-cont');
        const selectedStickyNoteContentDisplay = getComputedStyle(selectedStickyNoteContent).getPropertyValue('display');
        if(selectedStickyNoteContentDisplay === 'block'){
            selectedStickyNoteContent.style.display = 'none';
        }else{
            selectedStickyNoteContent.style.display = 'block';
        }
    })
}

function dragAndDrop(element,event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
  
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    document.body.append(element);
  
    moveAt(event.pageX, event.pageY);
  
    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + 'px';
      element.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // drop the element, remove unneeded handlers
    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
}