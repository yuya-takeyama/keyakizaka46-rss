import { path } from './util';

describe('#path', () => {
  it('returns an absolute URL', () => {
    expect(path('/foo/bar')).toEqual('https://www.keyakizaka46.com/foo/bar');
  });
});
