const fs = require('fs');
const crypto = require('crypto');

function createFileHash(filePath) {
    const fileContent = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileContent);
    return hash.digest('hex');
}

function findMatchingFiles(fileList) {
    const hashes = {};

    fileList.forEach((file) => {
        const fileHash = createFileHash(file);
        if (hashes[fileHash]) {
            hashes[fileHash].push(file);
        } else {
            hashes[fileHash] = [file];
        }
    });

    return Object.values(hashes).filter((files) => files.length > 1);
}

function getFirstMatchingFileData(fileList) {
    const matchingFiles = findMatchingFiles(fileList);

    if (matchingFiles.length > 0) {
        const firstMatchingFile = matchingFiles[0][0]; // First matching file
        const fileContent = fs.readFileSync(firstMatchingFile, 'utf-8'); // Reading file content
        return fileContent;
    } else {
        return null; // Return null if there are no matching files
    }
}
function writeToMultipleFiles(fileList, data) {
    fileList.forEach((filePath) => {
        fs.writeFileSync(filePath, data);
    });
}
  
module.exports = { getFirstMatchingFileData ,writeToMultipleFiles};
