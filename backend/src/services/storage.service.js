
const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(buffer, fileName) {
    const result = await imagekit.files.upload({
        file: buffer.toString("base64"),
        fileName: fileName,
    });

    return result;
}

module.exports = uploadFile;
