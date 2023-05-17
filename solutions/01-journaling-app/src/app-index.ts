import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import './pages/app-home';
import './components/menu';
import './components/hero-decor';
import './styles/global.css';
import { router } from './router';

@customElement('app-index')
export class AppIndex extends LitElement {
  static get styles() {
    return css`
      app-home,
      app-form {
        position: relative;
      }

      app-menu {
        border: 5px solid;
        border-radius: 8px;
        margin: 1em;
      }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    router.addEventListener('route-changed', () => {
      if ("startViewTransition" in document) {
        return (document as any).startViewTransition(() => {
          this.requestUpdate();
        });
      }
      else {
        this.requestUpdate();
      }
    });
  }

  render() {
    // router config can be round in src/router.ts
    return router.render();
  }
}
