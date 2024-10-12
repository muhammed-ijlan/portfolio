const CLIENT_URL = process.env.VITE_APP_URL;

module.exports = (html, meta, url) => {
    return html
        .replace('__META_OG_TITLE__', meta.title)
        .replace('__META_TW_TITLE__', meta.title)
        .replace('__META_OG_DESCRIPTION__', meta.description)
        .replace('__META_TW_DESCRIPTION__', meta.description)
        .replace('__META_OG_IMAGE__', meta.image)
        .replace('__META_TW_IMAGE__', meta.image)
        .replace('__META_OG_URL__', `${CLIENT_URL}${url}`)
        .replace('__META_TW_URL__', `${CLIENT_URL}${url}`)
        .replace('__META_DESCRIPTION__', meta.description)
        .replace('__META_KEYWORDS__', meta.keywords);
};
