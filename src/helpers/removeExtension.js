export const removeExtension = (fileName = '') => {
    const splitName = fileName.split('.');
    return splitName[0];
}