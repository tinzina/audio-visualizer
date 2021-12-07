const debugMode = true;
export default {
    debugMode: debugMode,
    COURSEZIP: debugMode ? 'http://localhost/viewer/coursezip.php' : 'https://dev-scripts.com/viewer/coursezip.php',
    FILECOPY_PHP: debugMode ? 'http://localhost/viewer/filecopy.php' : 'https://dev-scripts.com/viewer/filecopy.php',
    FILESAVER_PHP: debugMode ? 'http://localhost/viewer/filesaver.php' : 'https://dev-scripts.com/viewer/filesaver.php',
    VIEWER_PHP: debugMode ? 'http://localhost/viewer/index.php' : 'https://dev-scripts.com/viewer/index.php',
    "subfolders": ["staging", "production"]
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
