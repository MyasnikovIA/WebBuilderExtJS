       //  https://docs.sencha.com/extjs/4.2.1/extjs-build/examples/layout-browser/layout-browser.html
            var clientHeight = document.documentElement.clientHeight;
            var clientWidth = document.documentElement.clientWidth;
            var ContentEditorDocumeIframe = null;
            var ContentEditorDocume = null;
            var NewObjectElement = null;
            var selectElement = null;
            var clickElement = null;
            var TmpElementSrc = null;
            var TmpElementSrc = null;

            var elementListTreeStory = Ext.create('Ext.data.TreeStore', {
                root: {}
            });


            var componentListJson = getJsonUrl('component/component.json');
            var tagInfoList = {};
            var structToArr = function(componentListJson, tagInfoList) {
                for (var key in componentListJson) {
                    var info = componentListJson[key];
                    var keyRes = info.tagName;
                    if ((info["property"]) && (info["property"]["cmptype"])) {
                        keyRes += "-" + info["property"]["cmptype"];
                    }
                    if (keyRes === "undefined") continue;
                    if (info["tagName"] === "undefined") continue;
                    tagInfoList[keyRes] = {};
                    if (info["property"]) tagInfoList[keyRes]["property"] = info["property"];
                    if (info["propertyVariant"]) tagInfoList[keyRes]["propertyVariant"] = info["propertyVariant"];
                    if (info["text"]) tagInfoList[keyRes]["text"] = info["text"];
                    if (info["tagName"]) tagInfoList[keyRes]["tagName"] = info["tagName"];
                    if (info["innerHtmlToCaption"]) tagInfoList[keyRes]["innerHtmlToCaption"] = info["innerHtmlToCaption"];
                    if (info["innerHTML"]) tagInfoList[keyRes]["innerHTML"] = info["innerHTML"];
                    if (info["parentTag"]) tagInfoList[keyRes]["parentTag"] = info["parentTag"];
                    if (info["class"]) tagInfoList[keyRes]["class"] = info["class"];
                    if (info["notContentInnerHTML"]) tagInfoList[keyRes]["notContentInnerHTML"] = info["notContentInnerHTML"];
                    if (componentListJson[key].children) {
                        structToArr(componentListJson[key].children, tagInfoList);
                    }
                }
            }
            structToArr(componentListJson, tagInfoList);

            //  Создание списка компонентов при фильтрации (схлопываются группы)
            var createListCompArr = function(filterText,componentListJson, tagInfoList, groupName) {
                for (var key in componentListJson) {
                    var info = componentListJson[key];
                    var keyRes = info.text;
                    if (groupName.length>0){
                       keyRes = groupName+":"+keyRes
                    }
                    if ((info["property"]) && (info["property"]["cmptype"])) {
                        keyRes += "-" + info["property"]["cmptype"];
                    }
                    if (keyRes === "undefined") continue;
                    if (info["tagName"] === "undefined") continue;
                    if (componentListJson[key].children) {
                        var parpdoup = componentListJson[key].text;
                        if (groupName.length>0) {
                           parpdoup = groupName+":"+parpdoup;
                        }
                        createListCompArr(filterText,componentListJson[key].children, tagInfoList, parpdoup);
                    } else {
                        if (filterText.length == 0) {
                               var row = {}
                               for(var ind in info) {
                                  row[ind] = info[ind];
                               }
                               row["text"] = keyRes
                               tagInfoList.push(row);
                        }else{
                            if (keyRes.toLowerCase().indexOf(filterText) != -1) {
                               var row = {}
                               for(var ind in info) {
                                  row[ind] = info[ind];
                               }
                               row["text"] = keyRes
                               tagInfoList.push(row);
                            }
                        }
                    }
                }
            }

            var arrTagDst = [];
            var arrTagStr = [];
            var arrTagDelClose = []; // список тэгов  у которых необходимо убрать закрывающийся тэг
            for (var key in tagInfoList) {
                if (key.indexOf('-') == -1) continue;
                if ((tagInfoList[key]["notContentInnerHTML"]) && (tagInfoList[key]["notContentInnerHTML"]) == true){
                   arrTagDelClose.push(toCamelCase(key));
                }
                arrTagDst.push(toCamelCase(key));
                arrTagStr.push(key);
            }

            var InitAttributesObject = function(ObjectElement) {
                ObjectElement.removeEventListener("mousedown", insertElement);
                ObjectElement.addEventListener("mousedown", insertElement, false);
                ObjectElement.removeEventListener("keydown", keyEvent);
                ObjectElement.addEventListener('keydown', keyEvent, false);
                ObjectElement.removeEventListener("dblclick", dblClickElement);
                ObjectElement.addEventListener('dblclick', dblClickElement, false);
            }


            var insertElement = function(event) {
                var keyTag ;
                if (event.toElement){
                    clickElement = event.toElement;
                    keyTag = event.toElement.tagName.toLowerCase();
                    if (event.toElement.getAttribute("cmptype")) {
                        keyTag += "-" + event.toElement.getAttribute("cmptype");
                    }
                }else{
                    clickElement = event.target;
                    var keyTag = event.target.tagName.toLowerCase();
                    if (event.target.getAttribute("cmptype")) {
                        keyTag += "-" + event.target.getAttribute("cmptype");
                    }
                }
                selectElement = clickElement;
                if ((event.button == 0) && (NewObjectElement !== null)) {
                    if (testParentTag(selectElement, NewObjectElement) == false) {
                        // alert('Нельзя добавить '+NewObjectElement.tagName+' в родителя '+selectElement.tagName)
                        Ext.Msg.alert('Error!', 'Нельзя добавить ' + toCamelCase(NewObjectElement.tagName.toLowerCase()) + ' в родителя ' + toCamelCase(selectElement.tagName.toLowerCase()));
                        NewObjectElement = null;
                        return;
                    }
                    clickElement.appendChild(NewObjectElement);

                    if (NewObjectElement.style.position == "absolute") {
                         NewObjectElement.style['left'] = event.layerX+'px';
                         NewObjectElement.style['top'] =  (event.layerY - 8)+'px';
                        // setTimeout(function tick(selectElement1,X,Y) {}, 1000,NewObjectElement,event.layerX, event.layerY - 8);
                    }
                    selectElement = NewObjectElement;
                    viewPropertyInfo(selectElement); // показать свойства выбранного элемента
                    NewObjectElement = null;
                    // перестроить DOM дерево
                    reloadDOMtree();
                    return;
                }
                if (event.button == 0) {
                    if (TmpElementSrc.getAttribute("DeletTag")) {
                        return;
                    }
                    var elementsSrc = TmpElementSrc.querySelectorAll('*');
                    for (var i = 0; i < elementsSrc.length; i++) {
                        if (elementsSrc[i].classList.contains('selectElement')) {
                            elementsSrc[i].classList.remove("selectElement");
                        }
                    }
                    clickElement.classList.add("selectElement");
                    reloadDOMtree();
                    // переписать на воркеры
                    // viewPropertyInfo(clickElement); // перечитать свойства выбранного элеменита
                }
            }
            var keyEvent = function(event) {
                //console.log(event.keyCode);
                if (event.keyCode == 27) { //esc
                    console.log('ESC');
                }
                if (event.keyCode == 46) { //del
                    console.log('DEL')
                    if ((ContentEditorDocume.document.designMode != 'on') &&
                        (selectElement != null) &&
                        (selectElement.tagName != "BODY")
                    ) {
                        var parentEl = selectElement.previousElementSibling;
                        if (parentEl == null){
                            parentEl = selectElement.parentElement;
                        }
                        console.log( parentEl )
                        selectElement.remove();
                        selectElement = parentEl;
                        reloadDOMtree();
                    }
                }
                //-------------------------------------------
                if ((event.keyCode == 37) && (event.ctrlKey == true) && (selectElement != null)) { //лево
                    var left = parseInt(selectElement.style.left);
                    left -= 1;
                    selectElement.style.left = left + 'px';
                    return;
                }
                if ((event.keyCode == 39) && (event.ctrlKey == true) && (selectElement != null)) { //права
                    var left = parseInt(selectElement.style.left);
                    left += 1;
                    selectElement.style.left = left + 'px';
                    return;
                }
                if ((event.keyCode == 38) && (event.ctrlKey == true) && (selectElement != null)) { //верх
                    var top = parseInt(selectElement.style.top);
                    top -= 1;
                    selectElement.style.top = top + 'px';
                    return;
                }
                if ((event.keyCode == 40) && (event.ctrlKey == true) && (selectElement != null)) { //низ
                    var top = parseInt(selectElement.style.top);
                    top += 1;
                    selectElement.style.top = top + 'px';
                    return;
                }
                //-------------------------------------------
                // borderVertTextElement
                if ((event.keyCode == 37) && (event.shiftKey == false) && (selectElement != null)) { //лево
                    var left = parseInt(selectElement.style.left);
                    left -= 10;
                    selectElement.style.left = left + 'px';
                }
                if ((event.keyCode == 39) && (event.shiftKey == false) && (selectElement != null)) { //права
                    var left = parseInt(selectElement.style.left);
                    left += 10;
                    selectElement.style.left = left + 'px';
                }

                if ((event.keyCode == 38) && (event.shiftKey == false) && (selectElement != null)) { //верх
                    var top = parseInt(selectElement.style.top);
                    top -= 10;
                    selectElement.style.top = top + 'px';
                }
                if ((event.keyCode == 40) && (event.shiftKey == false) && (selectElement != null)) { //низ
                    var top = parseInt(selectElement.style.top);
                    top += 10;
                    selectElement.style.top = top + 'px';
                }
                //----------------------------------
                if ((event.keyCode == 37) && (event.shiftKey == true) && (selectElement != null)) { //лево
                    if ( selectElement.getAttribute("class").indexOf("borderVertTextElement") == -1 ){
                        var width = parseInt(selectElement.style.width);
                        width -= 1;
                        selectElement.style.width = width + 'px';
                    } else {
                        var height = parseInt(selectElement.style.height);
                        height -= 1;
                        selectElement.style.height = height + 'px';
                    }
                }
                if ((event.keyCode == 39) && (event.shiftKey == true) && (selectElement != null)) { //права
                    if ( selectElement.getAttribute("class").indexOf("borderVertTextElement") == -1 ){
                        var width = parseInt(selectElement.style.width);
                        width += 1;
                        selectElement.style.width = width + 'px';
                    } else {
                        var height = parseInt(selectElement.style.height);
                        height += 1;
                        selectElement.style.height = height + 'px';
                    }
                }
                if ((event.keyCode == 38) && (event.shiftKey == true) && (selectElement != null)) { //верх
                    if ( selectElement.getAttribute("class").indexOf("borderVertTextElement") == -1 ){
                        var height = parseInt(selectElement.style.height);
                        height -= 1;
                        selectElement.style.height = height + 'px';
                    } else {
                        var width = parseInt(selectElement.style.width);
                        width += 1;
                        selectElement.style.width = width + 'px';
                    }
                }
                if ((event.keyCode == 40) && (event.shiftKey == true) && (selectElement != null)) { //низ
                    if ( selectElement.getAttribute("class").indexOf("borderVertTextElement") == -1 ){
                        var height = parseInt(selectElement.style.height);
                        height += 1;
                        selectElement.style.height = height + 'px';
                    } else {
                        var width = parseInt(selectElement.style.width);
                        width -= 1;
                        selectElement.style.width = width + 'px';
                    }
                }
                //---------------------------------------
                // for (var property in event) {
                //    console.log(property+" : "+event[property]);
                // }
            }

            var clearSystemTextFromEditContent = function(bodyText) {
                bodyText = bodyText.replaceAll('style="position: absolute; top: 0px; left: 0px;"', '');
                bodyText = bodyText.replaceAll('class="selectElement"', '');
                bodyText = bodyText.replaceAll('.selectElement{', '.select-lement{');
                bodyText = bodyText.replaceAll('selectElement', '');
                bodyText = bodyText.replaceAll('.select-lement{', '.selectElement{');
                bodyText = bodyText.replaceAll('class=""', '');
                bodyText = bodyText.replaceAll('style=""', '');
                bodyText = bodyText.replaceAll('<body><div', '<body>\r<div');
                bodyText = bodyText.replaceAll('</head><body>', '</head>\r<body>');
                bodyText = bodyText.replaceAll('      </body>', '</body>');
                bodyText = bodyText.replaceAll('<!--[CDATA[', '<![CDATA[');
                bodyText = bodyText.replaceAll(']]-->', ']]>');
                return bodyText
            }


            var newWin = null;
            var dblClickElement = function(event) {
                if (selectElement != null) {
                      if(typeof newWinExtJS !== 'undefined')  newWinExtJS.close();
                      newWinExtJS = Ext.create('Ext.window.Window', {
                            title: 'EditElement',
                            closeAction: 'destroy',
                            height: (document.documentElement.clientHeight*0.9),
                            width: (document.documentElement.clientWidth*0.9),
                            left:30,
                            top:30,
                            layout: 'fit',
                            modal:true,
                            items: [{
                                        xtype: 'panel',
                                        title: ' ',
                                        split: true,
                                        items: [
                                            {
                                               xtype: 'panel',
                                               region: 'south',
                                               height: 28,
                                               dockedItems: [
                                                  {
                                                    xtype: 'toolbar',
                                                    dock: 'bottom',
                                                    items: ['->',{
                                                        text: 'Save',
                                                        listeners: {
                                                            click: function() {
                                                                 if ((selectElement.tagName.toLowerCase() == 'html')||(selectElement.tagName.toLowerCase() == 'body')||(selectElement.tagName.toLowerCase() == 'head')){
                                                                     Ext.Msg.alert('Error!', ' Элемент '+selectElement.tagName+' доступен только в режиме просмотра ');
                                                                 } else {
                                                                     var domTreeView = Ext.getCmp('domTreeView');
                                                                     var startNode = domTreeView.getRootNode();
                                                                     if (typeof startNode.cascadeBy === 'function') {
                                                                         startNode.cascadeBy(function(childNode) {
                                                                             if (childNode.get('ObjectElement') == selectElement) {
                                                                                try {
                                                                                   var txt = Ext.getCmp('contentHtmlText').getValue()
                                                                                   childNode.get('ObjectElement').outerHTML = txt;
                                                                                   setTimeout(function tick(txt) {
                                                                                        reloadDOMtree(txt);
                                                                                   }, 500,txt);
                                                                                }catch {}
                                                                             }
                                                                         }, this); //5
                                                                     }
                                                                 }
                                                                 newWinExtJS.close();
                                                            }
                                                        }
                                                    }]
                                                  }
                                               ]
                                            },
                                            {
                                                xtype     : 'textareafield',
                                                id        : 'contentHtmlText',
                                                region: 'north',
                                                grow      : true,
                                                height: (document.documentElement.clientHeight*0.8),
                                                 style: {
                                                     minWidth: '100%',
                                                     overflow:'auto'
                                                },
                                            }
                                        ]
                                     }
                            ]
                            ,listeners:{
                                close:function(){ },
                                show:function(){
                                    if ((selectElement.tagName.toLowerCase() == 'html')||(selectElement.tagName.toLowerCase() == 'body')||(selectElement.tagName.toLowerCase() == 'head') ){
                                        Ext.Msg.alert('Error!', ' Элемент '+selectElement.tagName+' доступен только в режиме просмотра ');
                                    }
                                    var TmpSelectElement = selectElement.cloneNode(true);
                                    html = html_beautify( clearSystemTextFromEditContent(TmpSelectElement.outerHTML) )
                                    Ext.getCmp('contentHtmlText').setValue(html);
                                }
                            }
                        });
                        newWinExtJS.show();
                    return;
                    /*
                    if(newWin)  newWin.close();
                    newWin = window.open('editWin.html', 'example', 'location=1,status=1,scrollbars=1,width=1200,height=600,left=320,top=240');
                    newWin.onload = function() {
                        var textEdit = newWin.document.getElementById("contentText");
                        // var TmpSelectElement = selectElement.cloneNode(true);
                        textEdit.innerHTML = html_beautify( clearSystemTextFromEditContent(selectElement.outerHTML) )
                        bodyText = textEdit.innerHTML.replaceAll('\r', '\r\n');
                        newWin.document.getElementById("btnSave").onclick = function() {
                            selectElement.outerHTML = newWin.document.getElementById("contentText").value;
                            newWin.close();
                        };
                        newWin.document.onkeydown = function(event) {
                            if (event.keyCode == 27) {
                                newWin.close();
                            }
                        };
                    }
                    */
                }
            }

          var styleHtmlJson = getJsonUrl('component/style_html.json');
          // Прочитать список свойств  выбранного элемента
          viewPropertyInfo = function(selectElement) {
                if(!selectElement) return;
                var keyTag = selectElement.tagName.toLowerCase();
                if ((selectElement.getAttribute("cmptype")) && (selectElement.getAttribute("cmptype") !== 'tmp')) {
                    keyTag += "-" + selectElement.getAttribute("cmptype");
                }

                // поиск стилей
                var foundTagProperty = Ext.getCmp('foundTagProperty');
                srctxt = foundTagProperty.value.toLowerCase();

                var foundTagStyle = Ext.getCmp('foundStyle');
                srctxtStyle = foundTagStyle.value.toLowerCase();
                var optst = [];
                optst.push("<table >");
                for (var key in selectElement.style) {
                    if (typeof selectElement.style[key] === 'function') continue;
                    if (srctxtStyle.length > 0) {
                        if (key.toLowerCase().indexOf(srctxtStyle) == -1) continue;
                    }
                    if ((parseInt(key)+"") !== 'NaN') continue;
                    var val = selectElement.style[key];
                    optst.push("<tr><td>");
                    optst.push(key);
                    optst.push("</td><td>");
                    optst.push(`<datalist id="LIST-${key}" value="${val}">`);
                    optst.push(`<option value="null" />`);
                    optst.push(`<option value="" />`);
                    var infoIRL="";
                    if (styleHtmlJson[key]) {
                        if ((styleHtmlJson[key]['info']) && (styleHtmlJson[key]['info'].length > 0)) {
                           infoIRL = `<button onclick=' window.open("${styleHtmlJson[key]['info']}"); '  title="info style property" >I</button>`;
                        }
                        var list = styleHtmlJson[key]["variant"];
                        for(var ind in list){
                           optst.push(`<option value="${list[ind]}" />`);
                        }
                    }
                    optst.push(`</datalist>`);
                    optst.push(`<input list="LIST-${key}" style='width:70%'  id="EditStyleProperty${key}" propname="${key}" value="${val}" onchange="changeElementStyleVal(this)" type="text"  /><button onclick=" document.getElementById('EditStyleProperty${key}').value=''; ">X</button> ${infoIRL}`);
                    optst.push("</td></tr>");
                }
                optst.push("</table>");
                Ext.getCmp('tabStyle').update(optst.join(""));

                var foundTagProperty = Ext.getCmp('foundTagProperty');
                var srctxt = foundTagProperty.value.toLowerCase();
                var opt = [];
                if ((tagInfoList[keyTag]) && (tagInfoList[keyTag].propertyVariant)) {
                    opt.push("<table>");
                    for (var ind in tagInfoList[keyTag].propertyVariant) {
                        if (srctxt.length > 0) {
                            if (ind.toLowerCase().indexOf(srctxt) == -1) continue;
                        }
                        var typ = tagInfoList[keyTag].propertyVariant[ind]
                        var val = selectElement.getAttribute(ind)
                        opt.push("<tr><td>");
                        opt.push(ind);
                        opt.push("</td>");
                        opt.push("<td>");
                        if (typ == "string") {
                            opt.push(`  <input propname="${ind}" value="${val}" onchange="changeElementVal(this)" type="text" />`);
                        } else if (typ == "number") {
                            opt.push(`  <input propname="${ind}" value="${val}" onchange="changeElementVal(this)" type="number" />`);
                        } else if (typeof typ === "object") {
                            opt.push(`<datalist id="LIST-${ind}" value="${val}">`);
                            for (var subInd in typ) {
                                opt.push(`<option value="${typ[subInd]}" />`);
                            }
                            opt.push(`</datalist>`);
                            opt.push(`<input list="LIST-${ind}" style='width:80%'  id="EditProperty${ind}" propname="${ind}" value="${val}" onchange="changeElementVal(this)" type="text"  /><button onclick=" document.getElementById('EditProperty${ind}').value='';  " title="clear user property" >X</button> `);
                        }
                        opt.push("</td>");
                        opt.push("</tr>");
                    }
                    opt.push("</table>");
                }
                opt.push("<table >");
                for (var ind in selectElement) {
                    if (srctxt.length > 0) {
                        if (ind.toLowerCase().indexOf(srctxt) == -1) continue;
                    }
                    if (ind.indexOf("DOCUMENT_") != -1) continue;
                    if (ind.indexOf("PROCESSING_") != -1) continue;
                    if (ind.indexOf("CDATA_SECTION_") != -1) continue;
                    if (ind.indexOf("ENTITY_") != -1) continue;
                    if (ind.indexOf("ENTITY_") != -1) continue;
                    if (ind == 'innerText') continue;
                    if (ind == 'previousSibling') continue;
                    if (ind == 'lastChild') continue;
                    if (ind == 'firstChild') continue;
                    if (ind == 'childNodes') continue;
                    if (ind == 'parentNode') continue;
                    if (ind == 'ownerDocument') continue;
                    if (ind == 'parentElement') continue;
                    if (ind == 'innerHTML') continue;
                    if (ind == 'nextSibling') continue;
                    if (ind == 'replaceChild') continue;
                    if (ind == 'removeChild') continue;
                    if (ind == 'appendChild') continue;
                    if (ind == 'addEventListener') continue;
                    if (ind == 'replaceChildren') continue;
                    if (ind == 'replaceWith') continue;
                    if (ind == 'removeAttributeNode') continue;
                    if (ind == 'removeAttributeNS') continue;
                    if (ind == 'removeAttribute') continue;
                    if (ind == 'remove') continue;
                    if (ind == 'insertAdjacentElement') continue;
                    if (ind == 'insertAdjacentHTML') continue;
                    if (ind == 'insertAdjacentText') continue;
                    if (ind == 'nextElementSibling') continue;
                    if (ind == 'previousElementSibling') continue;
                    if (ind == 'childElementCount') continue;
                    if (ind == 'lastElementChild') continue;
                    if (ind == 'firstElementChild') continue;
                    if (ind == 'shadowRoot') continue;
                    if (ind == 'children') continue;
                    if (ind == 'attributes') continue;
                    if (ind == 'assignedSlot') continue;
                    if (ind == 'outerHTML') continue;
                    if (ind == 'ariaAutoComplete') continue;
                    if (ind == 'nodeValue') continue;
                    if (ind == 'attributeStyleMap') continue;
                    if (ind == 'part') continue;
                    if (ind == 'prefix') continue;
                    if (ind == 'offsetParent') continue;
                    if (ind == 'dataset') continue; // добавить обработку ключ значение
                    if (ind.substr(0, 3) == 'get') continue;
                    if (ind.substr(0, 3) == 'set') continue;
                    if (ind.substr(0, 3) == 'add') continue;
                    if (ind.substr(0, 4) == 'aria') continue;
                    var typ = typeof selectElement[ind];
                    if (ind.substr(0, 2) == 'on') typ = 'event';
                    if (typ == 'function') continue;
                    if (ind == 'style') {
                        typ = "string";
                    }
                    var val = selectElement.getAttribute(ind)
                    // console.log(ind, typ, val)
                    if (ind == "style") {
                        opt.push("<tr><td>");
                        opt.push(ind);
                        opt.push("</td><td>");
                        opt.push(`  <input propname="${ind}" value="${val}" onchange="changeElementVal(this)" type="text" />`);
                        opt.push("</td></tr>");
                        continue;
                    }
                    if (ind == "classList") {
                        opt.push("<tr><td>");
                        opt.push(ind);
                        opt.push("</td><td>");
                        opt.push(`  <input propname="${ind}" value="${val}" onchange="changeElementСlassList(this)" type="text" />`);
                        opt.push("</td></tr>");
                        continue;
                    }
                    opt.push("<tr><td>");
                    opt.push(ind);
                    opt.push('  ');
                    opt.push("</td>");
                    opt.push("<td>");
                    if (typ == "string") {
                        opt.push(`<datalist id="LIST-${ind}" value="${val}">`);
                        opt.push(`<option value="null" />`);
                        opt.push(`<option value="" />`);
                        opt.push(`</datalist>`);
                        opt.push(`<input list="LIST-${ind}" style='width:80%'  id="EditProperty${ind}" propname="${ind}" value="${val}" onchange="changeElementVal(this)" type="text"  /><button onclick=" document.getElementById('EditProperty${ind}').value=''; " title="clear property">X</button> `);
                    }
                    if (typ == "number") {
                        opt.push(`  <input propname="${ind}"  style='width:94%'  value="${val}" onchange="changeElementVal(this)" type="number" />`);
                    }
                    if (typ == "boolean") {
                        opt.push(`<datalist id="LIST-${ind}" value="${val}">`);
                        opt.push(`<option value="null" />`);
                        opt.push(`<option value="true" />`);
                        opt.push(`<option value="false" />`);
                        opt.push(`</datalist>`);
                        opt.push(`<input list="LIST-${ind}" style='width:80%'  id="EditProperty${ind}" propname="${ind}" value="${val}" onchange="changeElementVal(this)" type="text"  /><button onclick=" document.getElementById('EditProperty${ind}').value='';  ">X</button> `);
                    }
                    if (typ == "event") {
                        opt.push(`<datalist id="LIST-${ind}" value="${val}">`);
                        opt.push(`<option value="null" />`);
                        opt.push(`<option value="" />`);
                        opt.push(`</datalist>`);
                        opt.push(`<input list="LIST-${ind}" style='width:80%'  id="EditProperty${ind}" propname="${ind}" value="${val}" onchange="changeElementVal(this)" type="text"  /><button onclick=" document.getElementById('EditProperty${ind}').value='';  ">X</button> `);
                    }
                    opt.push("</td>");
                    opt.push("</tr>");
                }
                opt.push("</table>");
                Ext.getCmp('tabTagProperty').update(opt.join(""));
            }

            changeElementVal = function(el) {
                var nam = el.getAttribute("propname");
                if (el.value === 'null') {
                    selectElement.removeAttribute(nam);
                } else if (el.value == 'true') {
                    selectElement.setAttribute(nam, true);
                } else if (el.value == 'false') {
                    selectElement.setAttribute(nam, false);
                } else if (nam == 'innerHTML') {
                    selectElement.innerHTML = el.value;
                } else if (nam == 'innerTEXT') {
                    selectElement.innerTEXT = el.value;
                } else {
                    selectElement.setAttribute(nam, el.value);
                }
            }

            // функция изменения  свойства элемента
            changeElementStyleVal = function(el) {
                if ((selectElement == undefined) || (selectElement == null)) return;
                var nam = el.getAttribute("propname");
                if (el.value === 'null') {
                    selectElement.style[nam] = null;
                } else {
                    selectElement.style[nam] = el.value;
                }
            }

            changeElementСlassList = function(el) { // функция изменения  свойства элемента
                if ((selectElement == undefined) || (selectElement == null)) return;
                var nam = el.getAttribute("propname");
                if (el.value === 'null') {
                    selectElement.classList = [];
                } else {
                    selectElement.classList = [];
                    var arrClass = el.value.split(" ");
                    for (var ind in arrClass) {
                        if (arrClass[ind].length == 0) continue;
                        selectElement.classList.push(arrClass[ind].replace(/\s+/g, ''));
                    }
                    selectElement.style[nam] = el.value;
                }
            }

            domHTMLTreeStory = Ext.create('Ext.data.TreeStore', {
                root: {}
            });


            // перестроить DOM дерево
            reloadDOMtree = function(selectElementLocal) {
                 var domTreeView = Ext.getCmp('domTreeView');
                 // var selectNodeId = null;
                 // if (domTreeView.getSelectionModel().hasSelection()) {
                 //       var selectedNode = domTreeView.getSelectionModel().getSelection();
                 //       selectNodeId = selectedNode[0].data;
                 // }
                 domHTMLTreeStory.getRootNode().removeAll();
                 domHTMLTreeStory.setRootNode(getDOMtree());
                 var startNode = domTreeView.getRootNode();
                 if (startNode.cascadeBy) {
                     startNode.cascadeBy(function(childNode) {
                         if ((childNode.data.ObjectElement)&&(childNode.data.ObjectElement.outerHTML)) {
                             if (selectElementLocal==childNode.data.ObjectElement.outerHTML) {
                                 var record = domHTMLTreeStory.getNodeById(childNode.id);
                                 domTreeView.getSelectionModel().select(record);
                                 var path = record.getPath();
                                 domTreeView.expandPath(path);
                                 selectElement = childNode.data.ObjectElement;
                                 viewPropertyInfo(selectElement); // получаем свойство выбранного элемента
                                 return;
                             }
                         }
                         if  (childNode.get('ObjectElement') == selectElement)  {
                             var record = domHTMLTreeStory.getNodeById(childNode.id);
                             domTreeView.getSelectionModel().select(record);
                             var path = record.getPath();
                             domTreeView.expandPath(path);
                         }
                     }, this);
                 }
            }

            // вывод свойств выбранного элемента
            loadEmploePage = function(pathPage) {
                ContentEditorDocumeIframe = document.getElementById('TabBody');
                ContentEditorDocume = (ContentEditorDocumeIframe.contentWindow) ? ContentEditorDocumeIframe.contentWindow : (ContentEditorDocumeIframe.contentDocument.document) ? ContentEditorDocumeIframe.contentDocument.document : ContentEditorDocumeIframe.contentDocument;
                ContentEditorDocume.document.designMode = 'off';
                ContentEditorDocumeIframe.src = "";
                ContentEditorDocumeIframe.onload = function() {
                    ContentEditorDocume = (ContentEditorDocumeIframe.contentWindow) ? ContentEditorDocumeIframe.contentWindow : (ContentEditorDocumeIframe.contentDocument.document) ? ContentEditorDocumeIframe.contentDocument.document : ContentEditorDocumeIframe.contentDocument;
                    ContentEditorDocume.document.designMode = 'off';
                    // ContentEditorDocume.document.write(   getTextUrl('report.html') +  getTextUrl('contextmenu.html') );
                    if (pathPage.length > 0) {
                        ContentEditorDocume.document.write(getTextUrl(pathPage));
                    } else {
                        if (Chrome) {
                          ContentEditorDocume.document.write(`<html><head></head><body></body></html>`);
                        }else{
                          ContentEditorDocume.document.write(`<html><head></head><body style="height:100%;width:100%;" ></body></html>`);
                        }
                    }
                    if (ContentEditorDocume.document.addEventListener) {
                        ContentEditorDocume.document.addEventListener('contextmenu', function(event) {
                            event.preventDefault();
                        }, false);
                    } else {
                        ContentEditorDocume.document.attachEvent('oncontextmenu', function() {
                            window.event.returnValue = false;
                        });
                    }
                    window.loadScriptIframe("component/component.js?"+getRandomInt(999999), 3000, ContentEditorDocume).then(function() {}, function(error) {
                        console.log(error);
                    });
                    window.loadCSSIFrame("component/component.css?"+getRandomInt(999999), 3000, ContentEditorDocume).then(function() {}, function(error) {
                        console.log(error);
                    });
                    TmpElementSrc = ContentEditorDocume.document.getElementsByTagName('html')[0];
                    var elementsSrc = TmpElementSrc.querySelectorAll('*');
                    body = elementsSrc;
                    for (var i = 0; i < body.length; i++) {
                        if (!body[i].getAttribute("DeletTag")) {
                            InitAttributesObject(body[i]);
                        }
                    }
                    reloadDOMtree();
                }
            }

            // Строим дерево HTML страницы
            var ReadHtmlElementId = 0;
            var ReadHtmlElement = function(elems, arr) {
                if (('' + elems) == '[object HTMLBRElement]') {
                    return;
                } // пропускаем <br/>
                if (('' + elems.tagName) === 'undefined') {
                    return;
                } // пропускаем  неизвестные тэги
                if (elems.getAttribute("DeletTag") != null) {
                    return;
                } // пропускаем тэг с атрибутом DeletTag
                var sub = {};
                if (elems.tagName != 'HTML') {
                    ReadHtmlElementId++;
                    sub["id"] = "ThreeIdElement_" + ReadHtmlElementId;
                }
                sub["text"] = '' + elems['tagName'];
                if (typeof elems.getAttribute === 'function') {
                    if (elems.getAttribute("cmptype") != null) {
                        sub["text"] += " (" + elems.getAttribute("cmptype") + ")";
                    }
                }
                sub["ObjectElement"] = elems;
                arr.push(sub);
                // обработка детей
                if ((elems.childNodes) && (elems.childNodes.length > 0)) {
                    sub["children"] = [];
                    for (var i = 0; i < elems.childNodes.length; i++) {
                        var SubElemt = elems.childNodes[i]
                        ReadHtmlElement(SubElemt, sub["children"]);
                    }
                }
            }

            // получить DOM дерево
            var getDOMtree = function() {
                TmpElementSrc = ContentEditorDocume.document.getElementsByTagName('html')[0]
                var obj = {};
                var res = {
                    text: 'DOM',
                    expanded: true,
                    children: []
                };
                ReadHtmlElement(TmpElementSrc, res.children)
                return res;
            }

            window.iframe_Designer_On_Off = function() {
                if (ContentEditorDocume.document.designMode == 'on') {
                    ContentEditorDocume.document.designMode = 'off'
                } else {
                    ContentEditorDocume.document.designMode = 'on'
                }
            }
            window.iframe_Scroll_On_Off = function() {
                if (ContentEditorDocumeIframe.getAttribute("scrolling")) {
                    ContentEditorDocumeIframe.removeAttribute("scrolling");
                } else {
                    ContentEditorDocumeIframe.setAttribute("scrolling", "no");
                }
            }

            initWebBuilder = function (htmlConteyner) {
                var toolbar = Ext.create('Ext.toolbar.Toolbar', {
                       xtype: 'box',
                       id: 'header',
                       region: 'north',
                       height: 30,
                        items: [{
                                text: 'File',
                                menu: [{
                                        text: 'load form',
                                        listeners: {
                                            click: function() {
                                                var urlPage = prompt("File name", 'report.html');
                                                if (urlPage) {
                                                    loadEmploePage(urlPage);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        text: 'Clear form',
                                        listeners: {
                                            click: function() {
                                                loadEmploePage("");
                                            }
                                        }
                                    },{
                                       text: 'Templates form',
                                       menu: [
                                           {
                                              text: 'Report D3',
                                              listeners: {
                                                click: function() {
                                                   loadEmploePage("templates/report.html");
                                                }
                                              }
                                           },
                                            {
                                             text: 'Gred D3(не дописан компонент Gred!!!)',
                                             listeners: {
                                                 click: function() {
                                                    loadEmploePage("templates/gred.html");
                                                 }
                                              }
                                            }
                                       ]
                                    }

                                ]
                            }, {
                                text: 'Edit',
                                menu: [{
                                        text: 'iframe Designer On/Off',
                                        listeners: {
                                            click: function() {
                                                window.iframe_Designer_On_Off()
                                            }
                                        }
                                    },
                                    {
                                        text: 'iframe Scroll On/Off',
                                        listeners: {
                                            click: function() {
                                                window.iframe_Scroll_On_Off();
                                            }
                                        }
                                    }
                                ]
                            }, {
                                text: 'Save form',
                                menu: [{
                                        text: 'Save HTML to Clipboard',
                                        listeners: {
                                            click: function() {
                                               TmpElement = ContentEditorDocume.document.getElementsByTagName('html')[0].cloneNode(true);
                                               saveWebForm(TmpElement);
                                            }
                                        }
                                    },
                                    {
                                        text: 'Save D3 form',
                                        listeners: {
                                            click: function() {
                                               TmpElement = ContentEditorDocume.document.getElementsByTagName('body')[0].children[0].cloneNode(true);
                                               saveWebForm(TmpElement);
                                            }
                                        }
                                    }
                                ]
                            }, {
                                text: 'LoadFromClipboard(в разработке)',
                                listeners: {
                                    click: function() {
                                        LoadWebForm();
                                    }
                                }
                            }, {
                                text: 'CopyElement',
                                listeners: {
                                    click: function() {
                                        if (selectElement == null) return;
                                        var p_prime = selectElement.cloneNode(true);
                                        var left = parseInt(selectElement.style.left);
                                        left += 10;
                                        p_prime.style.left = left + 'px';
                                        selectElement.after(p_prime);
                                        selectElement = p_prime;
                                    }
                                }
                            },{
                                text: 'Git Versuin',
                                listeners: {
                                    click: function() {
                                       window.open("https://raw.githack.com/MyasnikovIA/WebBuilderExtJS/main/index.html");
                                    }
                                }
                            }
                            /*
                            ,'->',{
                                xtype    : 'textfield',
                                name     : 'field',
                                emptyText: 'Найти'
                            }
                            */
                        ]
                });
                var treeDom = Ext.create('Ext.tree.Panel', {
                    id: 'domTreeView',
                    region: 'center',
                    rootVisible: false,
                    store: domHTMLTreeStory,
                    viewConfig: {
                         plugins: {
                             ptype: 'treeviewdragdrop',
                             dragText: 'Drag and drop to reorganize',
                         },
                         listeners: {
                           beforeDrop: function(node, data, overModel, dropPosition, dropHandler, eOpts) {
                                 //  отмена переноса (добавить проверку родителя)
                                 //     dropHandler.wait = true;
                                 //    Ext.MessageBox.confirm('Drop', 'Are you sure', function(btn){
                                 //    if (btn === 'yes') {
                                 //        dropHandler.processDrop();
                                 //    } else {
                                 //       dropHandler.cancelDrop();
                                 //   }
                                 // });
                                 if (dropPosition == "append"){ // пееносим в ролителя (добавляем в конец как ребенка)
                                     var target = data.records[0].data.ObjectElement.cloneNode(true);
                                     overModel.data.ObjectElement.appendChild(target);
                                     data.records[0].data.ObjectElement.remove();
                                 }
                                 if (dropPosition == "after"){ // пееносим в ролителя (добавляем в конец как ребенка)
                                     overModel.data.ObjectElement.insertAdjacentHTML('afterEnd', data.records[0].data.ObjectElement.outerHTML);
                                     data.records[0].data.ObjectElement.remove();
                                 }
                                 if (dropPosition == "before"){ // пееносим в ролителя (добавляем в конец как ребенка)
                                     overModel.data.ObjectElement.insertAdjacentHTML('beforeBegin', data.records[0].data.ObjectElement.outerHTML)
                                     data.records[0].data.ObjectElement.remove();
                                 }
                                 return true;
                           },
                           drop: function(node, data, dropRec, dropPosition) {
                           }
                         }
                     },
                    listeners: {
                                drop: function (node, data, overModel, dropPosition) {
                                      alert('CHANGE');
                                },
                                itemdblclick: function(tree, record, item, index, e, options) {
                                          var nodeText = record.data.text;
                                          clickElement = record.data.ObjectElement;
                                          selectElement = record.data.ObjectElement;
                                         dblClickElement();
                               },
                               itemclick: function(tree, record, item, index, e, options) {
                                   var nodeText = record.data.text;
                                   clickElement = record.data.ObjectElement;
                                   selectElement = record.data.ObjectElement;
                                   if (NewObjectElement == null) {
                                       var elementsSrc = TmpElementSrc.querySelectorAll('*');
                                       for (var i = 0; i < elementsSrc.length; i++) {
                                           if (elementsSrc[i].classList.contains('selectElement')) {
                                               elementsSrc[i].classList.remove("selectElement");
                                           }
                                       }
                                       clickElement.classList.add("selectElement");
                                       viewPropertyInfo(selectElement); // показать свойства выбранного элемента
                                   } else {
                                       if (testParentTag(clickElement, NewObjectElement) == false) {
                                           // alert('Нельзя добавить '+NewObjectElement.tagName+' в родителя '+clickElement.tagName);
                                           Ext.Msg.alert('Error!', 'Нельзя добавить ' + toCamelCase(NewObjectElement.tagName.toLowerCase()) + ' в родителя ' + toCamelCase(clickElement.tagName.toLowerCase()));
                                           NewObjectElement = null;
                                           return;
                                       }
                                       clickElement.appendChild(NewObjectElement);
                                       viewPropertyInfo(NewObjectElement); // показать свойства выбранного элемента
                                       selectElement = NewObjectElement;
                                       NewObjectElement = null;
                                       // перестроить DOM дерево
                                       reloadDOMtree();
                                   }
                               },
                               itemkeydown: function(tree, record, item, index, e, eOpts) {
                                   var nodeText = record.data.text;
                                   clickElement = record.data.ObjectElement;
                                   if (e.keyCode == 46) { // delete element
                                       if ((selectElement != null) &&
                                           (selectElement.tagName != "BODY") &&
                                           (selectElement.tagName != "HTML") &&
                                           (selectElement.tagName != "HEAD")
                                       ) {
                                           var parentEl = selectElement.previousElementSibling;
                                           if (parentEl == null){
                                               parentEl = selectElement.parentElement;
                                           }
                                           selectElement.remove();
                                           selectElement = parentEl;
                                           reloadDOMtree();
                                       }
                                   }
                               }
                      }
                });
               treeDom.getSelectionModel().on('select', function(selModel, record) {
                    if (record.get('leaf')) {
                        Ext.getCmp('domTreeView').layout.setActiveItem(record.getId() + '-panel');
                         if (!detailEl) {
                            var bd = Ext.getCmp('property-panel').body;
                            bd.update('').setStyle('background','#fff');
                            detailEl = bd.createChild(); //create default empty div
                        }
                        detailEl.hide().update(Ext.getDom(record.getId() + '-details').innerHTML).slideIn('l', {stopAnimation:true,duration: 200});
                    }
                });
                 treeDom.on('beforedrop', function(node, data, overModel, dropPosition, dropHandlers) {
                    // Defer the handling
                    dropHandlers.wait = true;
                    Ext.MessageBox.confirm('Drop', 'Are you sure', function(btn){
                        if (btn === 'yes') {
                            dropHandlers.processDrop();
                        } else {
                            dropHandlers.cancelDrop();
                        }
                    });
                });

                testParentTag = function(selectElement, NewObjectElement) {
                    // информация о компоненте
                    var keyTag = NewObjectElement.tagName.toLowerCase();
                    var parentTag = selectElement.tagName.toLowerCase();
                    if ((NewObjectElement.getAttribute("cmptype")) && (NewObjectElement.getAttribute("cmptype") !== 'tmp')) {
                        keyTag += "-" + NewObjectElement.getAttribute("cmptype");
                    }
                    if (tagInfoList[keyTag]) {
                        if (tagInfoList[keyTag].parentTag) {
                            var resultTest = false;
                            for (var ind in tagInfoList[keyTag].parentTag) {
                                if (tagInfoList[keyTag].parentTag[ind] == parentTag) {
                                    resultTest = true;
                                }
                            }
                            return resultTest;
                        }
                    }
                    return true;
                }
               var panelDOM = Ext.create('Ext.Panel', {
                            title: 'DOM tree',
                            region:'north',
                            split: true,
                            height: 360,
                            minSize: 150,
                            autoScroll: true,
                            padding: 5,
                            layout: 'border',

                            items: [treeDom,
                                        {
                                          region:'north',
                                          xtype: 'textfield',
                                          id: 'filterDomTreeView',
                                          listeners: {
                                                specialkey: function(f, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        var filterDomTreeView = Ext.getCmp('filterDomTreeView');
                                                        var srctxt = filterDomTreeView.value.toLowerCase();
                                                        var domTreeView = Ext.getCmp('domTreeView');
                                                        var startNode = domTreeView.getRootNode();
                                                        startNode.cascadeBy(function(childNode) {
                                                            var node = childNode.get('ObjectElement');
                                                            if (typeof node === 'undefined') return;
                                                            if (typeof node['tagName'] === 'undefined') return;

                                                            function _setSelectItem() { // локальная функция выбора элемента в дереве
                                                                var record = domHTMLTreeStory.getNodeById(childNode.id);
                                                                domTreeView.getSelectionModel().select(record);
                                                                var path = record.getPath();
                                                                domTreeView.expandPath(path);
                                                                viewPropertyInfo(node); // перечитать свойства выбранного элеменита
                                                            }

                                                            // поиск по имени компонента
                                                            if (node.getAttribute("name") != null) {
                                                                if (node.getAttribute("name").toLowerCase().indexOf(srctxt) != -1) {
                                                                    _setSelectItem();
                                                                    return false;
                                                                }
                                                            }

                                                            // поиск по ID компонента
                                                            if (node.getAttribute("ID") != null) {
                                                                if (node.getAttribute("ID").toLowerCase().indexOf(srctxt) != -1) {
                                                                    _setSelectItem();
                                                                    return false;
                                                                }
                                                            }

                                                            // поиск по имени ТЭГа
                                                            if (toCamelCase(node['tagName']).toLowerCase().indexOf(srctxt) != -1) {
                                                                _setSelectItem();
                                                                return false;
                                                            }
                                                            // поиск по содержимому текста
                                                            if (node.textContent) {
                                                               if (node.textContent.toLowerCase().indexOf(srctxt) != -1) {
                                                                   _setSelectItem();
                                                                   return true;
                                                               }
                                                            }
                                                        }, this); //5

                                                    }
                                                }
                                          }
                                        }
                                   ]
                 });
               var propertyPanel =  Ext.create('Ext.TabPanel', {
                        id: 'property-panel',
                        region: 'center',
                        bodyStyle: 'padding-bottom:15px;background:#eee;',
                        autoScroll: true,
                        minSize: 150,
                        items: [
                                  {
                                    title: 'Property',
                                    items: [{
                                                region:'north',
                                                xtype: 'textfield',
                                                id: 'foundTagProperty',
                                                width: '100%',
                                                layout: 'border',
                                                listeners: {
                                                    specialkey: function(f, e) {
                                                        if (e.getKey() == e.ENTER) {
                                                            viewPropertyInfo(selectElement);
                                                        }
                                                    }
                                                }
                                             },{
                                                xtype: 'container',
                                                id: 'tabTagProperty',
                                                width: "100%",
                                                region: 'center',
                                                height: (document.documentElement.clientHeight * 0.425),
                                                overflowY: 'scroll',
                                                overflowX: 'scroll',
                                                flex: 1, // take remaining available vert space
                                                html: 'Property',
                                             }
                                    ]
                                  },
                                  {
                                    title: 'Style',
                                    items: [{
                                                region:'north',
                                                xtype: 'textfield',
                                                id: 'foundStyle',
                                                width: '100%',
                                                listeners: {
                                                    specialkey: function(f, e) {
                                                        if (e.getKey() == e.ENTER) {
                                                            viewPropertyInfo(selectElement);
                                                        }
                                                    }
                                                }
                                             },{
                                                xtype: 'container',
                                                id: 'tabStyle',
                                                width: "100%",
                                                region: 'center',
                                                height: (document.documentElement.clientHeight * 0.425),
                                                overflowY: 'scroll',
                                                overflowX: 'scroll',
                                                flex: 1,
                                                html: '',
                                             }
                                    ]
                                  }
                        ]
                });
               var contentPanel = {
                     id: 'content-panel',
                     region: 'center', // this is what makes this panel into a region within the containing layout
                     layout: 'card',
                     margins: '2 5 5 0',
                     activeItem: 0,
                     border: false,
                     html: '<iframe id="TabBody" width="100%" height="100%" ></iframe>',
                };
                // Go ahead and create the TreePanel now so that we can use it below
                var componentTree = Ext.create('Ext.tree.Panel', {
                    id: 'component-panel',
                    region: 'center',
                    rootVisible: false,
                    width: 3500,
                    store:elementListTreeStory,
                    listeners: {
                         afterrender: function() {
                             elementListTreeStory.getRootNode().removeAll();
                             elementListTreeStory.setRootNode({
                                 "text": "Root",
                                 "expanded": true,
                                 "children": componentListJson
                             });
                         },
                         itemmousedown: function( tree, record, item, index, e, eOpts ){
                            createNewElement(record);
                         }
                    },
                });
                componentTree.getSelectionModel().on('select', function(selModel, record) {
                    if (record.get('leaf')) {
                       var conmponentTreeView = Ext.getCmp('component-panel');
                       if (conmponentTreeView.getSelectionModel().hasSelection()) {
                           //   createNewElement(conmponentTreeView.getSelectionModel().getSelection()[0]);
                       }
                    }
                });

                createNewElement = function(record) {
                    //var cloneItem = record.data.slice()
                    var tagName = record.data.tagName;
                    //console.log(record.data);
                    // ElementID
                    if (!tagName) {
                        return;
                    }
                    NewObjectElement = ContentEditorDocume.document.createElement(tagName);
                    if (record.data.style) {
                        for (var key in record.data.style) {
                            NewObjectElement.style[key] = record.data.style[key];
                        }
                    }
                    if (record.data.class) {
                        for (var key in record.data.class) {
                            NewObjectElement.classList.add(record.data.class[key]);
                        }
                    }
                    if (record.data.property) {
                        for (var key in record.data.property) {
                            NewObjectElement.setAttribute(key, record.data.property[key]);
                        }
                    }
                    if (record.data.innerHTML) {
                        NewObjectElement.innerHTML = record.data.innerHTML;
                    }
                    if (record.data.staticID) {
                        NewObjectElement.id = record.data.staticID;
                    }
                    //if (record.data.propertyVariant) {
                    //    for (var key in record.data.propertyVariant) {
                    //        if (key == "name") {
                    //            NewObjectElement.setAttribute("name", record.data.text + getRandomInt(999999)+(new Date().getMilliseconds()));
                    //        }
                    //    }
                    //}
                    if (record.data.caption) {
                        NewObjectElement.setAttribute("caption", record.data.caption);
                    }
                    if (record.data.value) {
                        NewObjectElement.setAttribute("value", record.data.value);
                    }
                    console.log(NewObjectElement);
                }
                var panelCompinent = Ext.create('Ext.Panel', {
                            region:'center',
                            split: true,
                            height: 360,
                            minSize: 150,
                            autoScroll: true,
                            layout: 'border',
                            items: [componentTree,
                                        {
                                          region:'north',
                                          xtype: 'textfield',
                                          id: 'filterComponentTreeView',
                                          listeners: {
                                                specialkey: function(f, e) {
                                                    if (e.getKey() == e.ENTER) {
                                                        var filterDomTreeView = Ext.getCmp('filterComponentTreeView');
                                                        var ElementListView = Ext.getCmp('component-panel');
                                                        var srctxt = filterDomTreeView.value.toLowerCase();
                                                        var componentListJson =  getJsonUrl('component/component.json')
                                                        if (srctxt.length == 0) {
                                                             elementListTreeStory.getRootNode().removeAll();
                                                             elementListTreeStory.setRootNode({
                                                                 "text": "Root",
                                                                 "expanded": true,
                                                                 "children": componentListJson
                                                             });
                                                        }else{
                                                            var componentListArray=[];
                                                            createListCompArr(srctxt,componentListJson, componentListArray,"");
                                                            compList =
                                                                {
                                                                  "expanded": true,
                                                                  "children": componentListArray
                                                                };
                                                            console.log( componentListArray )
                                                            elementListTreeStory.getRootNode().removeAll();
                                                            elementListTreeStory.setRootNode(compList);
                                                        }
                                                        /*
                                                        ElementListView.store.filterBy(function(rec) {
                                                            if (srctxt.length == 0) return true;
                                                            if (rec.data.text.toLowerCase().indexOf(srctxt) != -1) {
                                                                var record = elementListTreeStory.getNodeById(rec.data.id);
                                                                ElementListView.getSelectionModel().select(record)
                                                                var path = record.getPath();
                                                                ElementListView.expandPath(path);
                                                                return true;
                                                            }
                                                            return true;
                                                        });
                                                        */
                                                   }
                                               }
                                          },
                                        }
                                   ]
                 });
                Ext.create('Ext.Viewport', {
                    layout: 'border',
                    title: 'Ext Layout Browser',
                    items: [
                              toolbar
                          ,{
                                layout: 'border',
                                 collapsible: true,
                                id: 'layout-browser',
                                region:'west',
                                border: false,
                                split:true,
                                margins: '2 0 5 5',
                                width: 380,
                                minSize: 100,
                                maxSize: 500,
                                items: [panelDOM , propertyPanel]
                            },
                            contentPanel,
                            {
                                xtype: 'panel',
                                title: 'Element list',
                                collapsible: true,
                                html: '',
                                layout: 'border',
                                region: 'east',
                                width: 200,
                                split: true,
                                items: [ panelCompinent ]
                            },
                            {
                                title: 'Console',
                                region: 'south',
                                collapsible: true,
                                 split:true,
                                height: 25,
                                /*
                                 minHeight: 75,
                                 maxHeight: 250,
                                */
                                html: ' Footer content '
                            }
                    ],
                    renderTo: htmlConteyner,
                });
                loadEmploePage("templates/exsample.html");
            }
            var saveWebForm = function(TmpElement ) {
                // TmpElement = ContentEditorDocume.document.getElementsByTagName('html')[0].cloneNode(true);
                var bodyText = TmpElement.outerHTML;
                bodyText = bodyText.replaceAll('style="position: absolute; top: 0px; left: 0px;"', '');
                bodyText = bodyText.replaceAll('class="selectElement"', '');
                bodyText = bodyText.replaceAll('.selectElement{', '.select-lement{');
                bodyText = bodyText.replaceAll('selectElement', '');
                bodyText = bodyText.replaceAll('.select-lement{', '.selectElement{');
                bodyText = bodyText.replaceAll('class=""', '');
                bodyText = bodyText.replaceAll('style=""', '');
                bodyText = bodyText.replaceAll('<body><div', '<body>\r<div');
                bodyText = bodyText.replaceAll('</head><body>', '</head>\r<body>');
                bodyText = bodyText.replaceAll('      </body>', '</body>');
                // --------------------------------------------------
                bodyText = bodyText.replaceAll('cmp-action-var', 'cmpActionVar');
                bodyText = bodyText.replaceAll('cmp-data-set-var', 'cmpDataSetVar');
                for (var ind in arrTagStr) {
                    bodyText = bodyText.replaceAll(arrTagStr[ind] + "", arrTagDst[ind] + "");
                    //bodyText = bodyText.replaceAll('></' + arrTagDst[ind] + '>', '/>');
                    //console.log(arrTagStr[ind] + "", arrTagDst[ind] + "");
                }
                for (var ind in arrTagDelClose) {
                    bodyText = bodyText.replaceAll('></' + arrTagDelClose[ind] + '>', '/>');
                }
                // --------------------------------------------------
                bodyText = bodyText.replaceAll('<br>', '<br/>');
                bodyText = bodyText.replaceAll('<hr>', '<hr/>');
                bodyText = bodyText.replaceAll('<!--[CDATA[', '<![CDATA[');
                bodyText = bodyText.replaceAll(']]-->', ']]>');
                bodyText = bodyText.replaceAll('&nbsp;', ' ');
                bodyText = bodyText.replaceAll('<o:p>', '');
                bodyText = bodyText.replaceAll('</o:p>', '');
                // TmpElement.outerHTML = bodyText;
                // TmpElement.innerHTML = bodyText;
                // var bodyText = TmpElement.innerHTML
                copyToClipboard( html_beautify( bodyText ) );
            }
