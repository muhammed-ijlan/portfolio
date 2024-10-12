const axios = require('axios');
const config = require("./metaConfig.json");
const CLIENT_URL = process.env.VITE_APP_URL;

exports.getMetadata = async (path, params = {}) => {
    let meta = config[path];

    // Static metadata
    if (meta && meta.type === "static") {
        return {
            title: meta.title,
            description: meta.description,
            image: meta.imageLocation,
            keywords: meta.keywords
        };
    }

    // Fallback to default metadata
    meta = config["/"];
    return {
        title: meta.title,
        description: meta.description,
        image: meta.imageLocation,
        keywords: meta.keywords
    };
};
