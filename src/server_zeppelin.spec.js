const http = require('http');

jest.mock('http');
http.createServer = jest.fn(() => ({ listen: jest.fn() }));

const MockRes = require('mock-res');
const MockReq = require('mock-req');

process.env.CONNECT_TYPE = 'ZEPPELIN';
const connectServer = require('./server');

describe('server', () => {
  describe('connectType', () => {
    it('handles ZEPPELIN', () => {
      expect(connectServer.getConnectType()).toEqual('ZEPPELIN');
    });
  });

  describe('setZeppelinHeaders', () => {
    it('sets the Zeppelin cookies', () => {
      const headers = {};
      const query = {
        token: 'token',
      };
      connectServer.setZeppelinHeaders(headers, query);
      expect(headers).toEqual({ 'Set-Cookie': 'JSESSIONID=token; Path=/; HttpOnly' });
    });
  });

  describe('processCookie', () => {
    it('processes Zeppelin cookie', () => {
      const req = new MockReq({
        method: 'GET',
        url: '/?token=token',
      });
      const res = new MockRes();
      connectServer.processCookie(req, res);
      expect(res.statusCode).toEqual(302);
      expect(res.statusMessage).toEqual('Found');
      expect(res.getHeaders()).toEqual({
        location: '/',
        'set-cookie': 'JSESSIONID=token; Path=/; HttpOnly',
      });
      expect(res._getJSON()).toEqual({ // eslint-disable-line no-underscore-dangle
        token: 'token',
      });
    });
  });
});
