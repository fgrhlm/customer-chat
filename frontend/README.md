# KundtjänstChatt - Frontend

Byggt med:
    - [React](https://reactjs.org/)
    - [Grommet](https://v2.grommet.io/)
    - [react-spinners](https://www.npmjs.com/package/react-spinners)
    - [sfx](https://material.io/design/sound/sound-resources.html)

Toolchain: 
    - Webpack (css-loader, file-loader) -> Babel (preset-env, preset-react, @emotion)

Tog tillfället i akt och prövade sätta upp en React toolchain från början till slut.
Komponenterna är skrivna enligt moderna React designprinciper ( Funktionella komponenter och Hooks ).

Blev lite för roligt med frontend så projektet blev försenat.

## Projektstruktur
Frontenden är uppdelad i två delar: Client och Admin.
Deras entrypoints existerar i sin egna underkataloger i `src/`.

Både Client och Admin delar Reactkomponenter som existerar i `src/components`.
De har sina egna rootkomponenter: `AdminApp.jsx` och `ClientApp.jsx`.

Install: `npm install`
Build: `npm run build` <-- Bygger både admin o client automagiskt