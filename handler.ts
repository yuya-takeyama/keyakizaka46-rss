import express, { Request, Response } from 'express';
import { Feed } from 'feed';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const app = express();
const baseUrl = 'http://www.keyakizaka46.com';
const path = (path: string) => baseUrl + path;

const feed = new Feed({
  title: '欅坂46公式サイト',
  description: '「坂道シリーズ」第2弾　欅坂46',
  feed: path('/'),
  id: path('/'),
  link: path('/'),
  feedLinks: {
    atom: 'https://keyakizaka46-rss.herokuapp.com/atom',
  },
  copyright: 'Seed & Flower LLC',
});

const ensureError = (err: any): Error => {
  if (err instanceof Error) {
    return err;
  } else if (err && typeof err.message === 'string') {
    return new Error(err.message);
  } else {
    return new Error(err);
  }
};

app.get('/atom', async (_: Request, res: Response) => {
  try {
    res.type('atom');

    const page = await fetch(path('/s/k46o/news/list?ima=0000'));
    const html = await page.text();
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

    res.status(200);
    res.send(feed.atom1());
  } catch (err) {
    res.type('txt');

    const error = ensureError(err);
    res.status(500);
    res.send(error.message);
  }
});

export default app;
