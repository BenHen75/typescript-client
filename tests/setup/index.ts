import { FFTTApi } from '#/index';
import { HttpClientMock } from '#tests/setup/http_client_mock';

export const instance = FFTTApi.create('', '', '1234', HttpClientMock);

export const badInstance = FFTTApi.create('', '', '6789', HttpClientMock);
