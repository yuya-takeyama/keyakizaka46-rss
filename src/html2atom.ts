import { Feed } from 'feed';
import { JSDOM } from 'jsdom';
import { path } from './util';

const feed = new Feed({
  title: '欅坂46公式サイト',
  description: '「坂道シリーズ」第2弾　欅坂46',
  feed: path('/'),
  id: path('/'),
  link: path('/'),
  feedLinks: {},
  copyright: 'Seed & Flower LLC',
});

export const html2atom = (html: string): string => {
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

      if (link && date) {
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
