import { Feed } from 'feed';
import fetch from 'node-fetch';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { html2atom } from './html2atom';
import { path } from './util';

const ensureError = (err: any): Error => {
  if (err instanceof Error) {
    return err;
  } else if (err && typeof err.message === 'string') {
    return new Error(err.message);
  } else {
    return new Error(err);
  }
};

export const atom: APIGatewayProxyHandler = async (event, context) => {
  try {
    const page = await fetch(path('/s/k46o/news/list?ima=0000'));
    const html = await page.text();
    const atom = html2atom(html);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/atom+xml',
      },
      body: atom,
    };
  } catch (err) {
    const error = ensureError(err);
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
