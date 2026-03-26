import { HttpClientMock } from '#tests/setup/http_client_mock';

import { FFTTApi } from '../../src';

export const instance = FFTTApi.create('', '', '1234', HttpClientMock);

export const badInstance = FFTTApi.create('', '', '6789', HttpClientMock);
