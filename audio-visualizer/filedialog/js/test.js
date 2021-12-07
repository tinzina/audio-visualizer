import { FileDialog } from "./FileDialog.js";

const fileBrowserButtonID = "fileBrowser";
const fileDialog = new FileDialog(fileBrowserButtonID, changeAudioFile);
const fileBrowser = document.getElementById(fileBrowserButtonID);

function changeAudioFile(fileInformation) {
    console.log(`fileInformation`, fileInformation)
}