import { buildColumn, Column } from "./column";

let columns: Column[] = [];

function makeGithubGreatAgain() {
    console.log("Making Github great again ...");
    const columnElements = document.querySelectorAll(
        '[data-board-horizontal-group="No Flexible Urgency"] [data-dnd-drop-type="card"]'
    );
    columnElements.forEach((column) => {
        const newColumn = buildColumn(column as HTMLDivElement);
        if (newColumn) {
            columns.push(newColumn);
        }
    });
}

const jibButton = document.createElement("div");
jibButton.id = "jib-refresh-button";
jibButton.innerHTML = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
</svg>
`;
jibButton.addEventListener("click", makeGithubGreatAgain);
const board = document.querySelector(
    '[data-board-horizontal-group="No Flexible Urgency"]'
);
const container = board!.parentElement!.previousSibling!.firstChild;
container!.appendChild(jibButton);

makeGithubGreatAgain();
