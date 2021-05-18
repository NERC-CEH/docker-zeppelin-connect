const http = require('http');

jest.mock('http');
http.createServer = jest.fn(() => ({ listen: jest.fn() }));

const MockRes = require('mock-res');
const MockReq = require('mock-req');

process.env.CONNECT_TYPE = 'RSTUDIO';
const connectServer = require('./server');

describe('server', () => {
  describe('connectType', () => {
    it('handles RSTUDIO', () => {
      expect(connectServer.getConnectType()).toEqual('RSTUDIO');
    });
  });

  describe('setRStudioHeaders', () => {
    it('sets the RStudio cookies', () => {
      const headers = {};
      const query = {
        username: 'username',
        expires: 'expires',
        token: 'token',
        csrfToken: 'csrf',
      };
      connectServer.setRStudioHeaders(headers, query);
      expect(headers).toEqual({ 'Set-Cookie': [
        'user-id=username|expires|token; Path=/; HttpOnly',
        'csrf-token=csrf; Path=/',
      ] });
    });
  });

  describe('processCookie', () => {
    it('processes RStudio cookie', () => {
      const req = new MockReq({
        method: 'GET',
        url: '/path/connect?username=username&expires=expires&token=token&csrfToken=csrf',
      });
      const res = new MockRes();
      connectServer.processCookie(req, res);
      expect(res.statusCode).toEqual(302);
      expect(res.statusMessage).toEqual('Found');
      expect(res.getHeaders()).toEqual({
        location: '/path/',
        'set-cookie': [
          'user-id=username|expires|token; Path=/; HttpOnly',
          'csrf-token=csrf; Path=/',
        ],
      });
      expect(res._getJSON()).toEqual({ // eslint-disable-line no-underscore-dangle
        username: 'username',
        expires: 'expires',
        token: 'token',
        csrfToken: 'csrf',
      });
    });
  });
});
