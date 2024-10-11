const axios = require('axios');
const config = require("./metaConfig.json");
const SERVER_URL = process.env.VITE_API_KEY;
const CLIENT_URL = process.env.VITE_APP_URL;


exports.getMetadata = async (path, params = {}) => {
    let meta = config[path];
    if (meta && meta.type === "static") {
        return {
            title: meta.title,
            description: meta.description,
            image: `${CLIENT_URL}/${meta.imageLocation}`,
            keywords: meta.keywords
        }
    }
    else if (meta && meta.type === "dynamic") {
        try {
            // console.log(`${SERVER_URL}/${meta.apiEndPoint}`)
            const response = await axios.get(`${SERVER_URL}/${meta.apiEndPoint}`, { params: params || {} });
            // console.log(response);
            if (response && response.data && response.data.data && response.data.data.title) {
                const data = response.data.data;
                return {
                    title: data.title || data.keywords,
                    description: data.description,
                    image: data.image,
                    keywords: data.keywords
                }
            }
        } catch (error) {
            // console.log(error);
        }

    }
    meta = config["/"];
    return {
        title: meta.title,
        description: meta.description,
        image: `${CLIENT_URL}/${meta.imageLocation}`,
        keywords: meta.keywords
    }
}