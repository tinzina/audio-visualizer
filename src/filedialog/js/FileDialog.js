export class FileDialog {
    constructor(fileBrowserButtonID, callBack) {
        this.fileBrowser = document.getElementById(fileBrowserButtonID);
        this.callBack = callBack;
        const that = this;
        this.fileBrowser.onclick = () => {
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
            width=900,height=400,left=100,top=100`;
            that.dialogWindow = window.open('filedialog/browser.html', "Choose a File", params);
            that.dialogWindow.CallBackControl = this; 
        };

        this.fileInformation = {
            createdOn: "",
            filename: "",
            relative_path: "",
        };
    }

    update(fileInformation) {
        this.dialogWindow.close();
        this.callBack(fileInformation);
    }
}

