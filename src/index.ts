import { readFileSync } from 'fs';
import { App } from 'uWebSockets.js';
import { CounterAction, StaticFileExtension, Topic } from './types';

const PORT = parseInt(process.env.PORT, 10) || 3001;

const server = App();

let counter = 0;

server.ws('/*', {
  // Zero memory overhead compression
  compression: 0,
  // Maximum length of received message
  maxPayloadLength: 16 * 1024 * 1024,
  // Maximum amount of seconds that may pass without sending or getting a message
  idleTimeout: 99999,
  // Handler for new WebSocket connection. WebSocket is valid from open to close, no errors
  open: (ws, req) => {
    console.log(['server.ws.open'], ws, req);

    // https://github.com/uNetworking/uWebSockets.js/issues/164
    // #TODO w wersji 16 maja działać
    ws.subscribe('counter');
    ws.subscribe('home/sensors/#');
    ws.publish('counter', JSON.stringify({ action: 'update', topic: 'counter', data: counter }));
    ws.send(JSON.stringify({ action: 'update', topic: 'counter', data: counter }));
  },
  // Handler for a WebSocket message
  message: (ws, message, isBinary) => {
    // console.log(['server.ws.message'], message, isBinary);
    const enc = new TextDecoder('utf-8');
    const { action, topic, data } = JSON.parse(enc.decode(message));

    console.log(['enc.decode(message)'], { action, topic, data });

    if (topic as Topic === 'counter') {
      if (action as CounterAction === 'increment') {
        counter++;

        ws.publish('home/sensors/temperature', message);
        ws.publish('counter', JSON.stringify({ action: 'update', topic: '', data: counter }));
        ws.send(JSON.stringify({ action: 'update', topic: 'counter', data: counter }));
      }
    }
  },
  // Handler for when WebSocket backpressure drains. Check ws.getBufferedAmount()
  drain: (ws) => {
    console.log(['server.ws.drain'], ws.getBufferedAmount());
  },
  // Handler for close event, no matter if error, timeout or graceful close. You may not use WebSocket after this event
  close: (ws, code, message) => {
    console.log(['server.ws.close'], ws, code, message);
  }
});

server.get('/', (res, req) => {
  // set Content-Type header
  res.writeHeader('Content-Type', 'text/html');

  // read index.html into text string
  const indexPage = readFileSync(`${process.cwd()}/public/index.html`, 'utf8');

  // end response - send
  res.end(indexPage);

});

server.any('/*', (res, req) => {
  process.stdout.write(`${req.getUrl()}\n`);

  try {
    // read url
    const url = req.getUrl();

    // split url by dot to extract file extension
    const urlParts = url.split('.');
    const fileExtension = urlParts[urlParts.length - 1] as StaticFileExtension;

    // set Content-Type header based on file extension
    switch (fileExtension) {
      case 'css': {
        res.writeHeader('Content-Type', 'text/css');
        break;
      }
      case 'js': {
        res.writeHeader('Content-Type', 'text/javascript');
        break;
      }
      case 'ico': {
        res.writeHeader('Content-Type', 'image/x-icon');
        break;
      }
    }

    // read file
    const file = readFileSync(`${process.cwd()}/public${req.getUrl()}`, 'utf8');

    // end response - send
    res.end(file);
  }

  catch (e) {
    res.end(e.toString());
  }
});

// start server by setting PORT to listening
server.listen(PORT, listenSocket => {
  // if callback function argument is defined, then server is up and running
  if (listenSocket) {
    process.stdout.write('\x1b[33m');
    process.stdout.write(`Listening to port ${PORT}\n`);
    process.stdout.write('\x1b[0m');
  }
});
