'use server';

import * as cheerio from 'cheerio';

export async function fetchOgp(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const getMetaContent = (name: string) => {
      return $(`meta[property='og:${name}']`).attr('content') || $(`meta[name='${name}']`).attr('content') || '';
    };

    const ogp = {
      title: getMetaContent('title'),
      description: getMetaContent('description'),
      imageUrl: getMetaContent('image'),
    };

    return ogp;
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    return null;
  }
}
