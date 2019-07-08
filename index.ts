import { App } from 'uWebSockets.js';

const PORT = parseInt(process.env.PORT, 10) || 3001;

// http://localhost:3001/test/testParametruPierwszego/test/testParametruDrugiego/?parampierwszy=test1&paramdrugi=test2
const server = App().get('/test/:firstParam/test/:secondParam', (res, req) => {
  // print User-Agent header
  process.stdout.write(req.getHeader('user-agent'));
  process.stdout.write(`${req.getMethod()}\n`);
  process.stdout.write(`${req.getQuery()}\n`);
  process.stdout.write(`${req.getUrl()}\n`);
  process.stdout.write(`${req.getParameter(0)}\n`);
  process.stdout.write(`${req.getParameter(1)}\n`);

  // set Content-Type header
  res.writeHeader('Content-Type', 'text/html');

  // write simple html doc
  res.write('<html>');
  res.write('<body>');
  res.write('<div>');
  res.write('hello from uWebSockets.js!');
  res.write('</div>');
  res.write('</body>');
  res.write('</html>');

  // end response - send
  res.end();

});

// start server by setting PORT to listening
server.listen(PORT, listenSocket => {
  // if callback function argument is defined, then server is up and running
  if (listenSocket) {
    process.stdout.write('\x1b[33m');
    process.stdout.write('Listening to port 3001\n');
    process.stdout.write('\x1b[0m');
  }
});
