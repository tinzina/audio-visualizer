
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_treeview2
// https://simpl.info/track/map/
// https://stackoverflow.com/questions/16732419/mp4-from-php-not-playing-in-html5-video-tag
import Config, { CourseURL } from '../../config.js';

const ulTreeview = document.getElementById("ulTreeview");
const fileBox = document.getElementById("fileBox");
const downloadButton = document.getElementById("downloadButton");
const openButton = document.getElementById("openButton");
const fileNameCell = document.getElementById("fileNameCell");
const relativePathCell = document.getElementById("relativePathCell");
const createdOnCell = document.getElementById("createdOnCell");
const fileSizeCell = document.getElementById("fileSizeCell");

const treeviewSelectedFiles = () => Array.from(document.querySelectorAll(`#ulTreeview input[type="checkbox"]:checked`));
const queueSelectedFiles = () => Array.from(document.querySelectorAll(`#ulFileQueue input[type="checkbox"]:checked`));
const treeviewFileHyperlinks = () => Array.from(document.querySelectorAll(`#ulTreeview a`));

window.treeviewSelectedFiles = treeviewSelectedFiles;
window.queueSelectedFiles = queueSelectedFiles;
let courseMeta, fileSystem, selectedFileDataset, tree;

openButton.onclick = () => {
    if(!window.CallBackControl) return;
    window.CallBackControl.update(selectedFileDataset);
}

downloadButton.onclick = () => {
    const jsonFileName = selectedFileDataset.filename.substring(0, selectedFileDataset.filename.length - 4) + ".json";
    const jsonFilePath = selectedFileDataset.filepath.substring(0, selectedFileDataset.filepath.length - 4) + ".json";
    const files = [{
        zipname: selectedFileDataset.relative_path.replace("/", " - ") + selectedFileDataset.filename,
        filename: selectedFileDataset.filename,
        filepath: selectedFileDataset.filepath,
        relative_path: selectedFileDataset.relative_path,
    }, {
        zipname: selectedFileDataset.relative_path.replace("/", " - ") + jsonFileName,
        filename: selectedFileDataset.filename,
        filepath: jsonFilePath,
        relative_path: selectedFileDataset.relative_path,
    }];
    downloadFiles(files)
}

async function init() {
    fileSystem = await fetch('./php/build-tree-from-directory.php').then(response => response.json());
    window.fileSystem = fileSystem;
    fileSystem.find = (relative_path) => {
        const files = relative_path.split('/').reduce((fs, key) => fs = fs.dirs[key], fileSystem.tree);
        if (files && files.files)
            return files.files;
        return [];
    }

    fileSystem.findTimeline = (relative_path, filename) => {
        const base = filename.substr(0, filename.length - 4);
        const files = fileSystem.find(relative_path);
        const results = [];
        files.forEach(file => {
            if (file.filename === base + '.json' || file.filename === 'modified_' + base + '.json') results.push(file);
        })
        return results;
    }

    tree = new ULTreeView(fileSystem);
    tree.build();
    tree.addEvents();
    courseMeta = CourseURL();
    window.courseMeta = courseMeta;
    findFolderInTreeview();
}

const findFolderInTreeview = () => {
    if(courseMeta.relative_path.length == 0)
        return;
    let child = document.querySelector(`[data-relative_path="${courseMeta.relative_path}"]`);
    while (child) {
        child.closest("ul").classList.add("active");
        child = child.parentNode;
    }
}

init();

const flattenedFileName = (dataset) => dataset.relative_path.split('/').pop() + "_" + dataset.filename;

const fsKeys = {
    date: 'date',
    dirs: 'dirs',
    filename: 'filename',
    filesize: 'filesize',
    folder: 'folder',
    relative_path: 'relative_path',
    filepath: 'filepath'
}

class ULTreeView {
    constructor(fileSystem) {
        this.root = document.createDocumentFragment();
        this.fileSystem = fileSystem;
    }

    build(parent = null, fs = null) {
        const isRoot = !parent;
        if (isRoot) {
            this.root = document.createDocumentFragment();
            parent = document.createElement('div');
            this.root.appendChild(parent);
            fs = this.fileSystem.tree;
        }

        for (let folderName in fs.dirs) {
            const ul = this.createFolderNode(parent, folderName);

            const folder = fs.dirs[folderName];
            if (folder.files)
                folder.files.forEach(file => {
                    file.relative_path = file.relative_path.replace(/\\/g, '/');
                    file.zipname = flattenedFileName(file);
                    if (file.filename.endsWith('.wav')) this.addFileNode(ul, file);
                });
            this.build(ul, folder);
        }

        if (isRoot) {
            ulTreeview.innerHTML = parent.innerHTML;
        }
    }

    createFolderNode(parent, text) {
        parent.insertAdjacentHTML('beforeend', `<li class=""><span class="folder">${text}</span><ul id="tempId" class="nested"></ul></li>`);
        const ul = this.root.getElementById("tempId");
        ul.id = '';
        return ul;
    }

    addFileNode(parent, data) {
        parent.insertAdjacentHTML('beforeend',
            `<li><a href="#" data-date="${data.date}" data-filename="${data.filename}" ` +
            `data-filesize="${data.filesize}" data-relative_path="${data.relative_path}" data-path="${data.path}" ` +
            `data-filepath="${data.filepath}" data-zipName="${data.zipname}" class="file" >${data.filename}</a></li>`);
    }
    
    addEvents() {
        const toggler = document.getElementsByClassName("folder");

        treeviewFileHyperlinks().forEach(element => {
            element.onclick = () => {
                selectedFileDataset = element.dataset;
                const lesson = selectedFileDataset.filename.substr(0, selectedFileDataset.filename.length - 4);
                fileNameCell.innerText = selectedFileDataset.filename;
                relativePathCell.innerText = selectedFileDataset.relative_path;
                createdOnCell.innerText  = selectedFileDataset.date;
                fileSizeCell.innerText  = selectedFileDataset.filesize;
                fileBox.value = selectedFileDataset.filename;
                window.selectedFileDataset = selectedFileDataset;
            }
        })

        for (let i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function () {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("active");

            });
        }
    }
}

async function downloadFiles(files) {
    if (files.length == 0) {
        alert("No files Selected");
        return;
    }
    const filepath = '/archives';
    const filename = 'files.zip';
    const url = `${Config.COURSEZIP}?filename=${filename}&pathname=${filepath}`;
    await fetch(url, {
        method: "POST",
        body: JSON.stringify(files, null, 2)
    }).then(result => result.text()).then(result => console.log(`COURSEZIP: ${result}`));
    console.log(`Config.ARCHIVE_DOWNLOAD_URL`, Config.ARCHIVE_DOWNLOAD_URL)
    const prefix = relativePathCell.innerText.replace("/", " - ");
    saveAs(`${Config.ARCHIVE_DOWNLOAD_URL}`, `${prefix}${getFormattedTime()}.zip`);
}

function getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear();
    // JavaScript months are 0-based.
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    var s = today.getSeconds();
    return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
}

