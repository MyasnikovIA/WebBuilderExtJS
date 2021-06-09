        function getRandomInt(max) {
          return Math.floor(Math.random() * max);
        }
       // https://github.com/mdn/web-components-examples/blob/master/life-cycle-callbacks/main.js

        customElements.define('cmp-edit', class extends HTMLElement {
              shadow = null;
              static get observedAttributes() {
                return ['width','name', 'caption','data','value'];
              }
              render() {
                   if (!this.shadow) {
                        this.shadow = this.attachShadow({mode: 'open'});
                   }
                   this.shadow.innerHTML = `<input value="${this.getAttribute('name')}" />`;
              }
             connectedCallback() {
                this.render();
             }
             attributeChangedCallback(name, oldValue, newValue) {
                this.render();
             }
        });
        customElements.define('cmp-label', class extends HTMLElement {
              shadow = null;
              static get observedAttributes() {
                return ['width','name', 'caption','data','value'];
              }
              render() {
                   if (!this.shadow) {
                        this.shadow = this.attachShadow({mode: 'open'});
                   }
                   this.shadow.innerHTML = `<span name="${this.getAttribute('name')}" cmptype="Label" title="" class="label" >${this.getAttribute('caption')}</span>`;
              }
             connectedCallback() {
                this.render();
             }
             attributeChangedCallback(name, oldValue, newValue) {
                this.render();
             }
        });

        customElements.define('cmp-button', class extends HTMLElement {
              shadow = null;
              static get observedAttributes() {
                return ['width','name', 'caption','data','value'];
              }
              render() {
                   var linkCss = "";
                   if (!this.shadow) {
                        this.shadow = this.attachShadow({mode: 'open'});
                        linkCss = `<link rel="stylesheet" type="text/css" href="Component/Button/css/Button.css" delettag="1">`;
                   }
                   var styleTxt = [];
                   if (this.getAttribute('width')) { styleTxt.push('width:'+this.getAttribute('width')); }else{ styleTxt.push('width:100px ') }
                   if (!this.getAttribute('caption')) this.setAttribute('caption',"cmpButton");
                   this.shadow.innerHTML = `
                       <link rel="stylesheet" type="text/css" href="Component/Button/css/Button.css" delettag="1">
                       <div name="${this.getAttribute('name')}" cmptype="Button" title="${this.getAttribute('title')}" tabindex="0" class="ctrl_button box-sizing-force" style="${ styleTxt.join(';')}" >
                            <div class="btn_caption btn_center minwidth">${this.getAttribute('caption')}</div>
                       </div>`;
              }
             connectedCallback() {
                this.render();
             }
             attributeChangedCallback(name, oldValue, newValue) {
                this.render();
             }
        });

        customElements.define('cmp-combo-box', class extends HTMLElement {
           static get observedAttributes() {
               return ['width','name', 'data','value'];
           }
           shadow = null;
           render() {
                if (!this.shadow) {
                     this.shadow = this.attachShadow({mode: 'open'});
                }
                var styleTxt = [];
                if (this.getAttribute('width')) { styleTxt.push('width:'+this.getAttribute('width')); }else{ styleTxt.push('width:100px ') }
                if (!this.getAttribute('value')) {this.setAttribute('value',""); }

                styleTxt = styleTxt.join(";");
                this.shadow .innerHTML = `<select name="${this.getAttribute('name')}" style='${styleTxt}' >${this.getAttribute('caption')}</select>`;
                /*
                this.shadow .innerHTML = `
                   <link rel="stylesheet" type="text/css" href="Component/ComboBox/css/ComboBox.css" delettag="1">
                   <div name="${this.getAttribute('name')}" cmptype="Combobox" title="" oncreate="" class="ctrl_combobox editControl box-sizing-force" id="d3ctrl4551622992271907">
                        <div class="cmbb-input">
                            <input cmpparse="ComboBox"  type="text" value="${this.getAttribute('value')}" >
                        </div>
                        <div cmpparse="ComboBox" class="cmbb-button"  title="Выбрать из списка"></div>
                        <div cmptype="Base" name="ComboItemsList_sss" id="d3ctrl4591622992271907">
                          <div cmptype="ComboBoxDL" cont="cmbbdroplist" class="cmbb-droplist" id="d3ctrl4621622992271907">
                           <table></table>
                          </div>
                        </div>
                   </div>`;
                 */
           }
          static get observedAttributes() {
             return ['width','name', 'caption','data'];
          }
          connectedCallback() {
             this.render();
          }
          attributeChangedCallback(name, oldValue, newValue) {
             this.render();
          }
        });
        customElements.define('cmp-combo-item', class extends HTMLElement {
              shadow = null;
              static get observedAttributes() {
                return ['width','name', 'caption','data','value'];
              }
              render() {
                   if (!this.shadow) {
                        this.shadow = this.attachShadow({mode: 'open'});
                   }
                  this.shadow.innerHTML = `<option name="${this.getAttribute('name')}" caption="${this.getAttribute('caption')}" value="${this.getAttribute('value')}" >${this.getAttribute('caption')}</select>`;
                  /*
                   this.shadow.innerHTML = `
                                 <tbody><tr cmptype="ComboItem" name="cmp60bcea7ed88c3" comboboxname="sss" value="${this.getAttribute('value')}" id="d3ctrl3211622993534891">
                                        <td>
                                            <div class="item_block">
                                                <span class="btnOC" comboboxname="sss"></span>

                                                <span cont="itemcaption"></span>
                                            </div>

                                        </td>
                                    </tr>
                                </tbody>
                   `;
                   */
              }
             connectedCallback() {
                this.render();
             }
             attributeChangedCallback(name, oldValue, newValue) {
                this.render();
             }
        });


        customElements.define('cmp-text-area', class extends HTMLElement {
              shadow = null;
              static get observedAttributes() {
                return ['width','name', 'data','value'];
              }
              render() {
                   if (!this.shadow) {
                        this.shadow = this.attachShadow({mode: 'open'});
                        if (!this.getAttribute('value')) {this.setAttribute('value',""); }
                   }
                  var styleTxt = [];
                  if (this.getAttribute('width')) { styleTxt.push('width:'+this.getAttribute('width')); }else{ styleTxt.push('width:100px ') }
                   styleTxt = styleTxt.join(";");
                  this.shadow.innerHTML = `<textarea name="${this.getAttribute('name')}"  style="${styleTxt}">${this.getAttribute('value')}</textarea>`;
              }
             connectedCallback() {
                this.render();
             }
             attributeChangedCallback(name, oldValue, newValue) {
                this.render();
             }
        });


        customElements.define('cmp-data-set-var', class extends HTMLElement {
            shadow = null;
            render() {
                if (!this.shadow) {
                        this.shadow = this.attachShadow({mode: 'open'});
                        if (!this.getAttribute('srctype')) {this.setAttribute('srctype',"var"); }
                        if (!this.getAttribute('name')) {this.setAttribute('name', "DS_VAR_"+getRandomInt(999999)+(new Date().getMilliseconds()) ); }
                        if (!this.getAttribute('src')) {this.setAttribute('src',this.getAttribute('name')); }
                }
                var tmpdataSetVar = document.createElement('template');
                tmpdataSetVar.innerHTML = ` <div  style="display:none;" ></div> `;
                this.shadow.appendChild(tmpdataSetVar.content.cloneNode(true));
            }
            constructor() {
                super(); // always call super() first in the constructor.
                this.render();
             }
             connectedCallback() {
                this.render();
             }
        });
        customElements.define('cmp-data-set', class extends HTMLElement {
             constructor() {
                super(); // always call super() first in the constructor.
                if (!this.getAttribute('name')) {this.setAttribute('name', "DS_"+getRandomInt(999999)+(new Date().getMilliseconds()) ); }
                var tmpdataSet = document.createElement('template');
                tmpdataSet.innerHTML = `
                  <div  style="display:none;" >
                     <slot></slot>
                  </div>
                `;
                var shadowRoot = this.attachShadow({mode: 'open'});
                shadowRoot.appendChild(tmpdataSet.content.cloneNode(true));
             }
        });
        customElements.define('cmp-action-var', class extends HTMLElement {
            constructor() {
                super(); // always call super() first in the constructor.
                if (!this.getAttribute('srctype')) {this.setAttribute('srctype',"var"); }
                if (!this.getAttribute('name')) {this.setAttribute('name', "ACTION_VAR_"+getRandomInt(999999)+(new Date().getMilliseconds()) ); }
                if (!this.getAttribute('src')) {this.setAttribute('src',this.getAttribute('name')); }
                var tmpActionVar = document.createElement('template');
                tmpl.innerHTML = ` <div  style="display:none;" ></div> `;
                var shadowRoot = this.attachShadow({mode: 'open'});
                shadowRoot.appendChild(tmpActionVar.content.cloneNode(true));
             }
        });
        customElements.define('cmp-action', class extends HTMLElement {
             constructor() {
                super(); // always call super() first in the constructor.
                if (!this.getAttribute('name')) {this.setAttribute('name', "ACTION_"+getRandomInt(999999)+(new Date().getMilliseconds()) ); }
                var tmpAction = document.createElement('template');
                tmpl.innerHTML = `
                  <div  style="display:none;" >
                     <slot></slot>
                  </div>
                `;
                var shadowRoot = this.attachShadow({mode: 'open'});
                shadowRoot.appendChild(tmpAction.content.cloneNode(true));
             }
        });
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

/*
    Переписать компоненты на шаблоны

    <my-header></my-header>
    <my-module>
      <h2 slot="header">My Module</h2>
    </my-module>
*/
class MyHeader extends HTMLElement {
  constructor() {
    super();
    const headerTemplate = document.createElement('template');
    headerTemplate.innerHTML = `
      <style>
        header {
          background: black;
          color: white;
          padding: 2rem;
        }
      </style>
      <header>
        My Cool Website
      </header>
    `;
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true));
  }

}

class MyModule extends HTMLElement {
  constructor() {
    super();
    const moduleTemplate = document.createElement('template');
    moduleTemplate.innerHTML = `
      <style>
        .module {
           padding: 2rem;
           background: pink;
        }
      </style>
      <div class="module">
        <slot name="header"></slot>
      </div>
    `;
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(moduleTemplate.content.cloneNode(true));
  }

}

window.customElements.define('my-header', MyHeader);
window.customElements.define('my-module', MyModule);

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------