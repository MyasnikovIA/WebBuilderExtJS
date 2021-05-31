              var ContentEditorDocume = null;
              var ContentEditorDocumeIframe = document.getElementById('TabBody');
              var NewObjectElement = null;
              var selectElement = null;
              var TmpElementSrc = null;
              ContentEditorDocumeIframe.src = "";
              ContentEditorDocumeIframe.onload = function () {
                  ContentEditorDocume = (ContentEditorDocumeIframe.contentWindow) ? ContentEditorDocumeIframe.contentWindow : (ContentEditorDocumeIframe.contentDocument.document) ? ContentEditorDocumeIframe.contentDocument.document : ContentEditorDocumeIframe.contentDocument;
                  ContentEditorDocume.document.designMode = 'off';
                  ContentEditorDocume.document.write(`
            <style>
              .selectElement{
                 border: 1px dotted;
                 border: 1px dotted;
                 background-color: rgba(230,230,230,0.4);
                 box-sizing: content-box;
               }
              .borderElement{
                  border-width:1px;
                  border-style:solid;
              }
              .borderVertTextElement{
                   -ms-transform: rotate(-90deg);
                   -moz-transform: rotate(-90deg);
                   -webkit-transform: rotate(-90deg);
                   transform: rotate(-90deg);
                   -ms-transform-origin: left top 0;
                   -moz-transform-origin: left top 0;
                   -webkit-transform-origin: left top 0;
                   transform-origin: left top 0;
                   text-align:center;
              }
            </style>
            <div class="" style = "position:absolute; width:1400; height:660;"  >
            </div>
                  `);
                  TmpElementSrc=ContentEditorDocume.document.getElementsByTagName('html')[0];
                  var elementsSrc = TmpElementSrc.querySelectorAll('*');
                  body = elementsSrc;
                  for (var i = 0; i < body.length; i++) {
                      InitAttributesObject(body[i]);
                  }
              }


              var saveWebForm = function() {
                  TmpElement = ContentEditorDocume.document.getElementsByTagName('html')[0].cloneNode(true);
                  TmpElementSrc=ContentEditorDocume.document.getElementsByTagName('html')[0]
                  var elements = TmpElement.querySelectorAll('*');
                  var elementsSrc = TmpElementSrc.querySelectorAll('*');
                  // body = elementsSrc[1]
                  // console.log( elementsSrc[1] );
                  // for (var i = 0; i < elementsSrc.length; i++) {
                  //   console.log('elementsSrc',elementsSrc);
                  // }
                  var bodyText = TmpElement.innerHTML
                  bodyText = bodyText.replaceAll('style="position: absolute; top: 0px; left: 0px;"', '')
                  bodyText = bodyText.replaceAll('class="selectElement"', '')
                  bodyText = bodyText.replaceAll('.selectElement{', '.select-lement{')
                  bodyText = bodyText.replaceAll('selectElement', '')
                  bodyText = bodyText.replaceAll('.select-lement{', '.selectElement{')
                  bodyText = bodyText.replaceAll('class=""', '')
                  bodyText = bodyText.replaceAll('style=""', '')
                  bodyText = bodyText.replaceAll('<body><div', '<body>\r<div')
                  bodyText = bodyText.replaceAll('</head><body>', '</head>\r<body>')
                  bodyText = bodyText.replaceAll('      </body>', '</body>')
                  console.log(bodyText);
                  copyToClipboard(bodyText);
              }

              var copyToClipboard = function(text) {
                    if (window.clipboardData && window.clipboardData.setData) {
                        // IE specific code path to prevent textarea being shown while dialog is visible.
                        return clipboardData.setData("Text", text);

                    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                        var textarea = document.createElement("textarea");
                        textarea.textContent = text;
                        textarea.style.position = "fixed";
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                            return document.execCommand("copy");
                        } catch (ex) {
                            console.warn("Copy to clipboard failed.", ex);
                            return false;
                        } finally {
                            document.body.removeChild(textarea);
                        }
                    }
              }

              var DesignModeOnOff=function(){
                 if (ContentEditorDocume.document.designMode == 'on' ){
                     ContentEditorDocume.document.designMode = 'off'
                 } else {
                     ContentEditorDocume.document.designMode = 'on'
                 }
              }

              var insertElement = function(event) {
                   var clickElement = event.toElement;
                   selectElement = clickElement;
                   if ((event.button == 0 ) && (NewObjectElement !== null)) {
                      if (NewObjectElement.style.position == "absolute"){
                        NewObjectElement.style.left = event.layerX;
                        NewObjectElement.style.top = event.layerY-8;
                      }
                      clickElement.appendChild(NewObjectElement);
                      selectElement = NewObjectElement;
                      NewObjectElement = null;
                      return;
                   }
                   if ( event.button == 0 ) {
                       var elementsSrc = TmpElementSrc.querySelectorAll('*');
                       for (var i = 0; i < elementsSrc.length; i++) {
                          if (elementsSrc[i].classList.contains('selectElement')) {
                              elementsSrc[i].classList.remove("selectElement");
                          }
                       }
                       clickElement.classList.add("selectElement");
                   }
              }

              var keyEvent = function(event) {
                  //console.log(event.keyCode);
                  if (event.keyCode == 27) { //esc
                        console.log('ESC')
                  }
                  if (event.keyCode == 46) { //del
                      console.log('DEL')
                      if ((ContentEditorDocume.document.designMode != 'on' )
                          && (selectElement!=null)
                          && (selectElement.tagName!="BODY")
                         ) {
                         selectElement.remove();
                      }
                  }
                 //-------------------------------------------
                 if ((event.keyCode == 37) && (event.ctrlKey==true)&&(selectElement!=null)) { //лево
                     var left = parseInt( selectElement.style.left );
                     left-=1;
                     selectElement.style.left =left+'px';
                     return;
                  }
                  if ((event.keyCode == 39)&&(event.ctrlKey==true)&&(selectElement!=null)) { //права
                     var left = parseInt( selectElement.style.left );
                     left+=1;
                     selectElement.style.left =left+'px';
                     return;
                  }

                  if ((event.keyCode == 38)&&(event.ctrlKey==true)&&(selectElement!=null)) { //верх
                     var top = parseInt( selectElement.style.top );
                     top-=1;
                     selectElement.style.top =top+'px';
                     return;
                  }
                  if ((event.keyCode == 40)&&(event.ctrlKey==true)&&(selectElement!=null)) { //низ
                     var top = parseInt( selectElement.style.top );
                     top+=1;
                     selectElement.style.top =top+'px';
                     return;
                  }
                //-------------------------------------------
                  if ((event.keyCode == 37)&&(event.shiftKey==false)&&(selectElement!=null)) { //лево
                     var left = parseInt( selectElement.style.left );
                     left-=10;
                     selectElement.style.left =left+'px';
                  }
                  if ((event.keyCode == 39)&&(event.shiftKey==false)&&(selectElement!=null)) { //права
                     var left = parseInt( selectElement.style.left );
                     left+=10;
                     selectElement.style.left =left+'px';
                  }

                  if ((event.keyCode == 38)&&(event.shiftKey==false)&&(selectElement!=null)) { //верх
                     var top = parseInt( selectElement.style.top );
                     top-=10;
                     selectElement.style.top =top+'px';
                  }
                  if ((event.keyCode == 40)&&(event.shiftKey==false)&&(selectElement!=null)) { //низ
                     var top = parseInt( selectElement.style.top );
                     top+=10;
                     selectElement.style.top =top+'px';
                  }
                  //----------------------------------
                  if ((event.keyCode == 37)&&(event.shiftKey==true)&&(selectElement!=null)) { //лево
                     var width = parseInt( selectElement.style.width);
                     width-=1;
                     selectElement.style.width = width+'px';
                  }
                  if ((event.keyCode == 39)&&(event.shiftKey==true)&&(selectElement!=null)) { //права
                     var width = parseInt( selectElement.style.width );
                     width+=1;
                     selectElement.style.width =width+'px';
                  }
                  if ((event.keyCode == 38)&&(event.shiftKey==true)&&(selectElement!=null)) { //верх
                     var height = parseInt( selectElement.style.height );
                     height-=1;
                     selectElement.style.height =height+'px';
                  }
                  if ((event.keyCode == 40)&&(event.shiftKey==true)&&(selectElement!=null)) { //низ
                     var height = parseInt( selectElement.style.height );
                     height+=1;
                     selectElement.style.height = height+'px';
                  }
                  //---------------------------------------
                  // for (var property in event) {
                  //    console.log(property+" : "+event[property]);
                  // }
              }

              var InitAttributesObject = function (ObjectElement) {
                  ObjectElement.removeEventListener("mousedown", insertElement);
                  ObjectElement.addEventListener("mousedown", insertElement, false);
                  ObjectElement.removeEventListener("keydown", keyEvent);
                  ObjectElement.addEventListener('keydown', keyEvent, false );
                  ObjectElement.removeEventListener("dblclick", dblClickElement);
                  ObjectElement.addEventListener('dblclick', dblClickElement, false );
              }

              var createElement2 = function (elementName) {
                    NewObjectElement = ContentEditorDocume.document.createElement( elementName );
                    NewObjectElement.style.position = "absolute";
                    NewObjectElement.innerHTML="dddddd<br/>777777777777<br/>ddddddddd";
                    InitAttributesObject(NewObjectElement);
              }

              var createText = function () {
                    NewObjectElement = ContentEditorDocume.document.createElement( 'div' );
                    NewObjectElement.style.position = "absolute";
                    NewObjectElement.innerHTML="new_Text";
                    //NewObjectElement.style.width ='100px';
                    //NewObjectElement.style.height ='60px';
                    NewObjectElement.style.textAlign='center';
                    InitAttributesObject(NewObjectElement);
              }
              var createTextBlock = function () {
                    NewObjectElement = ContentEditorDocume.document.createElement( 'div' );
                    NewObjectElement.style.position = "absolute";
                    NewObjectElement.innerHTML="new_Text";
                    NewObjectElement.style.width ='100px';
                    NewObjectElement.style.height ='60px';
                    NewObjectElement.style.textAlign='center';
                    InitAttributesObject(NewObjectElement);
              }

              var createBlock = function () {
                    NewObjectElement = ContentEditorDocume.document.createElement( 'div' );
                    NewObjectElement.style.position = "absolute";
                    NewObjectElement.classList.add("borderElement");
                    NewObjectElement.style.width ='100px';
                    NewObjectElement.style.height ='60px';
                    NewObjectElement.style.textAlign='center';
                    NewObjectElement.innerHTML="new_elem";
                    InitAttributesObject(NewObjectElement);
              }
              var createVertBloc = function () {
                    NewObjectElement = ContentEditorDocume.document.createElement( 'div' );
                    NewObjectElement.style.position = "absolute";
                    NewObjectElement.innerHTML="new_elem";
                    NewObjectElement.classList.add("borderVertTextElement");
                    NewObjectElement.classList.add("borderElement");
                    NewObjectElement.style.width ='100px';
                    NewObjectElement.style.height ='60px';
                    InitAttributesObject(NewObjectElement);
              }

              var createLabel = function () {
                    NewObjectElement = ContentEditorDocume.document.createElement( 'cmpLabel' );
                    NewObjectElement.innerHTML="new_label";
                    InitAttributesObject(NewObjectElement);
              }

              var copyElement = function () {
                 if (selectElement == null) return;
                 var p_prime = selectElement.cloneNode(true);
                 var left = parseInt( selectElement.style.left );
                 left+=10;
                 p_prime.style.left = left+'px';
                 selectElement.after(p_prime);
                 selectElement = p_prime;
              }

              var newWin = null;
              var dblClickElement = function(event) {
                    if (selectElement!=null) {
                              newWin = window.open('editWin.html', 'example', 'location=1,status=1,scrollbars=1,width=600,height=400,left=320,top=240');
                              newWin.onload = function() {
                                  var textEdit =  newWin.document.getElementById("contentText");
                                  // selectElement.parentElement.tagName
                                  contText = selectElement.outerHTML;
                                  contText = contText.replaceAll(" selectElement", '')
                                  contText = contText.replaceAll(' class="selectElement"', '')
                                  contText = contText.replaceAll('class=""', '')
                                  textEdit.innerHTML = contText;
                                  newWin.document.getElementById("btnSave").onclick = function(){
                                       selectElement.outerHTML = newWin.document.getElementById("contentText").value;
                                       newWin.close();
                                  };
                                 newWin.document.onkeydown = function( event ) {
                                      if ( event.keyCode == 27 ) {
                                          newWin.close();
                                      }
                                  };
                              }
                    }
              }
