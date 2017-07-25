/* @flow */

import {Fasttrack} from '../src';

/* eslint-disable no-console */

var client = new Fasttrack('your_token');
// var client = new Fasttrack('719b9830b37a0da84c6917e0db6845b8489306bd');

client.getCompany('example.com')
  .then((company: Object): void => {
    console.log(company);
  })
  .catch((err: Error): void => {
    console.error(err);
  });

/* eslint-enable no-console */
