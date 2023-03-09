const convertToBase64 = (file: Blob) => {
    return new Promise ((resolve, reject) => {
        const readFile = new FileReader();

        readFile.readAsDataURL(file);
        readFile.onload = function () {
            resolve (readFile.result);
        };
        readFile.onerror = function (error) {
            reject (error);
        };
    });
}

export default convertToBase64;