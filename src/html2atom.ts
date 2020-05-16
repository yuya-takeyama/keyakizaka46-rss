import { Feed } from 'feed';
import { JSDOM } from 'jsdom';
import { path } from './util';

interface options {
  updated: Date;
}

export const html2atom = (html: string, options?: options): string => {
  const updated = options && options.updated;
  const feed = new Feed({
    title: '欅坂46公式サイト',
    description: '「坂道シリーズ」第2弾　欅坂46',
    feed: path('/'),
    id: path('/'),
    link: path('/'),
    feedLinks: {},
    copyright: 'Seed & Flower LLC',
    updated,
  });

  const dom = new JSDOM(html);
  const elems = dom.window.document.querySelectorAll('.box-news ul li');

  for (const elem of elems) {
    const dateElem = elem.querySelector('.date');
    const date = dateElem && new Date(dateElem.innerHTML);
    const linkElem = elem.querySelector('.text a');
    let link: string | null;
    let title: string | null;
    if (linkElem) {
      link = linkElem.attributes && linkElem.getAttribute('href');
      title = linkElem.innerHTML;

      if (title && link && date) {
        feed.addItem({
          title,
          link,
          date,
        });
      }
    }
  }

  return feed.atom1();
};
