/* File Dialog */

import { FileDialog } from "../filedialog/js/FileDialog.js";

const fileBrowserButtonID = "fileBrowser";
const fileDialog = new FileDialog(fileBrowserButtonID, changeAudioFile);

function changeAudioFile(fileInformation) {
    console.log(`fileInformation`, fileInformation)
    console.log(fileInformation.path)
    player.src = fileInformation.path;
}

/* DS-Audio Control */

const player = document.querySelector("dsaudio-control");
player.bindPlayPauseButton('#playPauseButton');
player.bindVolumneBar("#volumneBar");
player.bindProgressBar("#progressBar");

addVTTCueEventListeners();

function addVTTCueEventListeners(
    onBubbleEnter = true,
    onSpeakEnter = true,
    onWordEnter = true,
    onSyllableEnter = false,
    onBubbleExit = false,
    onSpeakExit = false,
    onWordExit = false,
    onSyllableExit = false
) {
    if (onBubbleEnter)
        player.addEventListener("onBubbleEnter", function (event) {
            const { bubble, activeCues } = event.detail;                    
            console.log(event.type, bubble.Native, bubble);
        });

    if (onSpeakEnter)
        player.addEventListener("onSpeakEnter", function (event) {
            const { bubble, speak, activeCues } = event.detail;
            console.log(event.type, speak.text, speak);
        });

    if (onWordEnter)
        player.addEventListener("onWordEnter", function (event) {
            const { bubble, speak, word, activeCues } = event.detail;
            console.log(event.type, word.text, word);
            console.log(`word options`, event.detail);
            console.log(activeCues);
        });

    if (onSyllableEnter)
        player.addEventListener("onSyllableEnter", function (event) {
            const { bubble, speak, word, activeCues } = event.detail;
            console.log(event.type, word.text, word);
        });

    if (onBubbleExit)
        player.addEventListener("onBubbleExit", function (event) {
            const { bubble, activeCues } = event.detail;
            console.log(event.type, bubble.Native, bubble);
        });

    if (onSpeakExit)
        player.addEventListener("onSpeakExit", function (event) {
            const { bubble, speak, activeCues } = event.detail;
            console.log(event.type, speak.text, speak);
        });

    if (onWordExit)
        player.addEventListener("onWordExit", function (event) {
            const { bubble, speak, word, activeCues } = event.detail;
            console.log(event.type, word.text, word);
        });

    if (onSyllableExit)
        player.addEventListener("onSyllableExit", function (event) {
            const { bubble, speak, word, activeCues } = event.detail;
            console.log(event.type, word.text, word);
        });
}
