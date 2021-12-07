const debugMode = !window.location.startsWith(`https://ia.dev-scripts.com/taskpane`);
export default {
    debugMode: debugMode,
    COURSEZIP: debugMode ? 'http://localhost/audio-visualizer/audio-visualizer/filedialog/php/coursezip.php' : 'https://dev-scripts.com/ia/taskpane/lessons-bin/audio-visualizer/filedialog/php/coursezip.php',
    ARCHIVE_DOWNLOAD_URL: debugMode ? 'http://localhost/audio-visualizer/audio-visualizer/filedialog/php/archives/files.zip' : 'https://dev-scripts.com/ia/taskpane/lessons-bin/audio-visualizer/filedialog/php/archives/files.zip',
}

export function CourseURL() {

    const data = {
        pathname: "",
        relative_path: "",
        lesson: "",
        sheetName: "",
        version: "",
        workbookName: ""
    }
    const params = new URLSearchParams(window.location.search);
    const pathname = params.get("pathname");
    if (!pathname)
        return data;

    const list = pathname ? pathname.split("/") : Array(4).fill("");

    data.pathname = pathname;
    data.relative_path = pathname.substring(6, pathname.length - 1);
    data.lesson = params.get("lesson");
    data.sheetName = list[list.length - 2];
    data.version = list[list.length - 3];
    data.workbookName = list[list.length - 4];

    return data;

}
