/* @flow */

/* eslint-disable max-nested-callbacks */
/* eslint-disable no-loop-func */

import {
  range,
} from 'lodash';

import nock from 'nock';
// Required to make nock work with axios and jest
import axios from 'axios';

// $FlowFixMe
import httpAdapter from 'axios/lib/adapters/http';

import {Fasttrack} from '../Fasttrack';

import type {
  Company,
  Contact,
} from '../types';

import {
  PATHNAME_COMPANY,
  PATHNAME_CONTACT,
  URL,
} from '../constants';

import companyFixture from './fixtures/company';
import contactFixture from './fixtures/contact';

axios.defaults.adapter = httpAdapter;

const FAKE_DOMAIN = 'test.com';
const FAKE_EMAIL  = 'test@test.com';
const FAKE_TOKEN  = 'fake_token';

const BAD_STATUS_CODES = [
  ...range(400, 407),
  429,
  500,
  501,
  700,
];

const TIMEOUT = 50000;

function getFasttrackInstance(opts: Object = {}): Fasttrack {
  return new Fasttrack(FAKE_TOKEN, opts);
}

describe('Fasttrack', (): void => {
  beforeAll((): void => {
    nock.disableNetConnect();
  });

  afterEach((): void => {
    nock.cleanAll();
  });

  afterAll((): void => {
    nock.enableNetConnect();
    nock.restore();
  });

  it('should exits', (): void => {
    expect(Fasttrack).toBeDefined();
  });

  it('should return valid instance', (): void => {
    expect(getFasttrackInstance()).toBeInstanceOf(Fasttrack);
  });

  it('should handle options', (): void => {
    let instance = getFasttrackInstance({
      timeout: TIMEOUT,
    });

    expect(instance).toBeInstanceOf(Fasttrack);
    expect(instance.__client.defaults.timeout).toEqual(TIMEOUT);
  });

  describe('#getCompany', (): void => {
    it('should return valid company', (): Promise<*> => {
      nock(URL)
        .get(PATHNAME_COMPANY)
        .query({
          domain: FAKE_DOMAIN,
        })
        .reply(200, companyFixture.data);

      let fasttrack = getFasttrackInstance();

      return fasttrack.getCompany(FAKE_DOMAIN)
        .then((company: Company): void => {
          expect(company).toEqual(companyFixture.result);
        });
    });

    for (let statusCode of BAD_STATUS_CODES) {
      it(`should reject on error ${statusCode}`, (): Promise<*> => {
        nock(URL)
          .get(PATHNAME_COMPANY)
          .query({
            domain: FAKE_DOMAIN,
          })
          .reply(statusCode);

        let fasttrack = getFasttrackInstance();

        return fasttrack.getCompany(FAKE_DOMAIN)
          .catch((err: Error): void => {
            expect(err).toBeInstanceOf(Error);
          });
      });
    }

    it(`should reject on bad version`, (): Promise<*> => {
      nock(URL)
        .get(PATHNAME_COMPANY)
        .query({
          domain: FAKE_DOMAIN,
        })
        .reply(404, {
          error_code: '1',
        });

      let fasttrack = getFasttrackInstance();

      return fasttrack.getCompany(FAKE_DOMAIN)
        .catch((err: Error): void => {
          expect(err).toBeInstanceOf(Error);
        });
    });
  });

  describe('#getContact', (): void => {
    it('should return valid contact', (): Promise<*> => {
      nock(URL)
        .get(PATHNAME_CONTACT)
        .query({
          email: FAKE_EMAIL,
        })
        .reply(200, contactFixture.data);

      let fasttrack = getFasttrackInstance();

      return fasttrack.getContact(FAKE_EMAIL)
        .then((company: Contact): void => {
          expect(company).toEqual(contactFixture.result);
        });
    });

    for (let statusCode of BAD_STATUS_CODES) {
      it(`should reject on error ${statusCode}`, (): Promise<*> => {
        nock(URL)
          .get(PATHNAME_CONTACT)
          .query({
            email: FAKE_EMAIL,
          })
          .reply(statusCode);

        let fasttrack = getFasttrackInstance();

        return fasttrack.getContact(FAKE_EMAIL)
          .catch((err: Error): void => {
            expect(err).toBeInstanceOf(Error);
          });
      });
    }

    it(`should reject on bad version`, (): Promise<*> => {
      nock(URL)
        .get(PATHNAME_CONTACT)
        .query({
          email: FAKE_EMAIL,
        })
        .reply(404, {
          error_code: '1',
        });

      let fasttrack = getFasttrackInstance();

      return fasttrack.getContact(FAKE_EMAIL)
        .catch((err: Error): void => {
          expect(err).toBeInstanceOf(Error);
        });
    });
  });
});

/* eslint-enable max-nested-callbacks */
/* eslint-enable no-loop-func */
