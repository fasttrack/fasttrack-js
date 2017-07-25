/* @flow */

import {
  camelCase,
  inRange,
  mapKeys,
  toString,
} from 'lodash';

import {
  BadParametersError,
  BadRequestError,
  InternalServerError,
  InvalidVersionError,
  MethodNotAllowedError,
  NoResultError,
  NotAcceptableError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
  VersionRequiredError,
} from './errors';

const ERRORS_BY_STATUS = {
  '400' : BadRequestError,
  '401' : UnauthorizedError,
  '404' : NotFoundError,
  '405' : MethodNotAllowedError,
  '406' : NotAcceptableError,
  '429' : TooManyRequestsError,
};

const ERRORS_BY_ERROR_CODE = {
  '1' : VersionRequiredError,
  '2' : NoResultError,
  '3' : BadParametersError,
  '4' : InvalidVersionError,
};

export function camelCaseEveryProps(obj: Object): Object {
  return mapKeys(obj, (value: string, key: string): string => {
    return camelCase(key);
  });
}

export function errorForResponse(
  status: number,
  errorCode: string,
  detail: string
): Error {
  let FastTrackError;

  if (errorCode != null) {
    FastTrackError = ERRORS_BY_ERROR_CODE[errorCode];
  }

  if (
    FastTrackError == null &&
    status != null
  ) {
    FastTrackError = ERRORS_BY_STATUS[toString(status)];
  }

  if (
    FastTrackError == null &&
    inRange(status, 500, 600)
  ) {
    FastTrackError = InternalServerError;
  }

  if (FastTrackError == null) {
    FastTrackError = Error;
  }

  return new FastTrackError(detail);
}
