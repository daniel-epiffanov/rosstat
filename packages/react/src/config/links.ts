const isProd = process.env.NODE_ENV === 'production';
const PROD_HOST = 'production.com';
const DEV_HOST = 'http://localhost:5000';

export const HOST = isProd ? PROD_HOST : DEV_HOST;
export const HOST_API = isProd ? PROD_HOST : `${DEV_HOST}/api`;

export const AUTHORS_GITHUB_LINK = 'https://github.com/daniel-epiffanov/regional-stats';
export const GITHUB_PROJECT_LINK = 'https://github.com/daniel-epiffanov';
export const GITHUB_BACKEND_LINK = 'https://github.com/daniel-epiffanov/regional-stats/tree/master/packages/backend';
export const AUTHORS_TELEGRAM_LINK = 'https://t.me/danielEpifanov';
export const ROSSTAT_LINK = 'https://rosstat.gov.ru/';
export const RUSSIAN_REGIONS_LINK = 'https://rosstat.gov.ru/folder/210/document/13204';
export const LERNA_LINK = 'https://lerna.js.org/';
export const GRAPHQL_LINK = 'https://graphql.org/';