import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('app-menu')
export class AppMenu extends LitElement {
  @property({ type: String }) home = '🏠';
  @property({ type: String }) journal = '📝';


  @property() enableBack: boolean = false;

  static get styles() {
    return css`
      .menu {
        display: flex;
        flex-direction: column;
        border: 5px solid #45b08c;
        border-radius: 8px;
        margin: 1em;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
      }

      .menu fluent-anchor {
        margin: 6px 0;
      }

      .menu fluent-anchor::part(control) {
        text-decoration: none;
        font-size: 20px;

      }

      .menu fluent-anchor::part(control):hover {
        color: #45B08C;
      }
    `;
  }

  constructor() {
    super();
  }

  updated(changedProperties: any) {
    if (changedProperties.has('enableBack')) {
    }
  }

  render() {
    return html`
      <div class="menu">
        <fluent-anchor href="/" appearance="lightweight">${this.home}</fluent-anchor>
        <fluent-anchor href="/journal" appearance="lightweight">${this.journal}</fluent-anchor>
      </div>
    `;
  }
}
