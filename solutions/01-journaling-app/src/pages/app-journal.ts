import { LitElement, css, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import localforage from 'localforage';
import { JournalEntry } from '../interfaces/journalEntry';
import { dbName, getLast7Days, seedLocalStorage } from '../utils/journal';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
// import '@pwabuilder/pwainstall';

@customElement('app-journal')
export class AppJournal extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';
  @property() journalDB: any;
  @property() last7Days = getLast7Days();
  @state() private last7DaysJournal!: any;

  static get styles() {
    return css`
      .hero {
        height: 90vh;
        min-height: 600px;
        max-height: 900px;
        max-width: 100%;
        max-width: 100vw;
        padding: 0 48px;
        overflow-x: hidden;
        position: relative;
        flex: 1;
      }

      .hero__inner {
        display: flex;
        flex-direction: column;
        position: relative;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
      }

      .hero__top-content {
        color: white;
        margin: 1rem 3rem 0;
        text-align: center;
        max-height: 25vh;
      }

      .hero__top-content .entries {
        display: flex;
        flex-direction: column;
        margin-top: 2rem;
        max-height: 50vh;
      }

      .hero__top-content .entries fluent-card.main-card {
        height: fit-content;
        -webkit-backdrop-filter: blur(20px);
        background: none;
        backdrop-filter: blur(20px);
        background-color: rgba(255,255,255,.3);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }

      .hero__top-content .entries fluent-card.main-card fluent-card.child-card {
        width: 300px;
        height: 200px;
        overflow: hidden auto;
        margin: 1em;
        background-color: rgb(216, 167, 177, 0.3);
      }

      .hero__top-content .entries fluent-card.main-card fluent-card.child-card .date {
        line-height: 3em;
        background-color: rgb(216, 167, 177, 0.6);
      }

      .hero__top-content .entries fluent-card.main-card fluent-accordion-item.child-accordion {
        background-color: rgb(216, 167, 177, 0.3);
        border-radius: 0;
      }

      .hero__top-content .entries fluent-accordion-item::part(region) {
        background: inherit;
      }

      .hero__top-content .entries fluent-accordion-item::part(icon) {
        border-radius: 50%;
      }

      .hero__top-content .entries fluent-accordion-item .panel .panel__body {
        text-align: left;
      }

      .hero__top-content .entries fluent-card .panel p {
        margin: 1em;
      }

      @media screen and (max-width: 840px) and (min-width: 625px) {
        .hero__top-content {
          margin: 4rem 2rem 0px;
        }
      }

      @media screen and (max-width: 625px) and (min-width: 480px) {
        .hero__top-content {
          margin: 2rem 2rem 0px;
        }
      }

      @media screen and (max-width: 480px) {
        .hero {
          padding: 0 1rem;
        }

        .hero__top-content {
          margin: 1rem 0;
        }
      }
    `;
  }

  constructor() {
    super();

    this.journalDB = localforage.createInstance({name: dbName});
  }

  async firstUpdated() {
    // seed local storage with sample entries
    if (await this.journalDB.getItem(this.last7Days[0]) === null) {
      seedLocalStorage(this.journalDB);
    }

    const last7DaysJournal = await this.getLast7DaysJournal();
    if (last7DaysJournal && last7DaysJournal.length > 0) {
      this.last7DaysJournal = last7DaysJournal;
    }

    console.log(this.last7DaysJournal);
  }

  private async getLast7DaysJournal() {
    try {
      let collection = [];
      for (let i=0; i < this.last7Days.length; i++) {
        collection.push(await this.journalDB.getItem(this.last7Days[i]));
      }

      if (collection.length > 0) {
        return collection;
      } else {
        return null;
      }
    } catch (err) {
      return;
    }
  }

  render() {
    return html`
      <app-menu enableBack="${true}"></app-menu>
      <div class="hero">
        <hero-decor></hero-decor>
        <!-- <pwa-install>Install Repose</pwa-install> -->
        <div class="hero__inner">
          <div class="hero__top-content">
            <div class="entries">
              <fluent-card class="main-card">
                ${this.renderEntries(this.last7DaysJournal ? this.last7DaysJournal : [])}
              </fluent-card>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderEntries(entries: JournalEntry[][]) {
    return html`
      ${entries.map((entry: JournalEntry[]) => html`
        <fluent-card class="child-card">
          <div class="date">${entry&&entry[0].date ? `📆${entry[0].date}` : 'Today'}</div>
          <div class="panel">
            ${entry ? entry.map((entry: JournalEntry) => html`
              <fluent-accordion-item class="child-accordion">
                <span slot="heading">${entry&&entry.time ? `📝 Your notes at ${entry.time}` : ''}</span>
                <div class="panel">
                <p class="panel__title">${entry&&entry.title ? entry.title : ''}</p>
                <p class="panel__body">${entry&&entry.entry ? entry.entry : ''}</p>
                </div>
              </fluent-accordion-item>
            `) : html`<p>Start journaling by clicking the "mood check-in" button on the Home page</p>`}
          </div>
        </fluent-card>
      `)}
    `;
  }
}
