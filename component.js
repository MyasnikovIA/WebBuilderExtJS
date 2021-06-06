        customElements.define('cmp-edit', class extends HTMLElement {
          connectedCallback() {
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = `<input value="${this.getAttribute('name')}" />`;
          }
        });
        customElements.define('cmp-label', class extends HTMLElement {
          connectedCallback() {
            const shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = `<span name="${this.getAttribute('name')}" cmptype="Label" title="" class="label" >${this.getAttribute('caption')}</span>`;
            //updateStyle(this);
          }
          disconnectedCallback() { console.log('Custom square element removed from page.'); }
          adoptedCallback() { console.log('Custom square element moved to new page.'); }
          attributeChangedCallback(name, oldValue, newValue) { console.log('Custom square element attributes changed.'); updateStyle(this); }
        });