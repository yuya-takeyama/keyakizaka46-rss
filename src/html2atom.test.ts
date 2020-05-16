import { join } from 'path';
import { readFile as origReadFile } from 'fs';
import { promisify } from 'util';
import { html2atom } from './html2atom';

const readFile = promisify(origReadFile);

const newsFixturesDir = join(__dirname, 'fixtures', 'news');

describe('#html2atom', () => {
  it('returns an Atom feed', async () => {
    const html = (
      await readFile(join(newsFixturesDir, 'news.html'))
    ).toString();
    const options = {
      updated: new Date(2020, 1, 1, 9, 0, 0),
    };
    expect(html2atom(html, options)).toMatchSnapshot();
  });
});
