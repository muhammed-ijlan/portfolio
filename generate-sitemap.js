import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const sitemap = new SitemapStream({ hostname: 'https://ijlandev.online' });

const writeStream = createWriteStream('./public/sitemap.xml');

sitemap.pipe(writeStream);

// Add your routes manually
sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
sitemap.write({ url: '/projects', changefreq: 'weekly', priority: 0.8 });

sitemap.end();

streamToPromise(sitemap)
    .then((data) => {
        console.log('Sitemap generated');
    })
    .catch(console.error);
