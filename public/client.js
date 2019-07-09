document.addEventListener('DOMContentLoaded', () => {
  const contentNode = document.createElement('div');
  const headerNode = document.createElement('h1');
  const headerTextNode = document.createTextNode('uWebSockets.js boilerplate!');
  const divNode = document.createElement('div');
  const divTextNode = document.createTextNode(new Date(Date.now()).getDate());

  headerNode.setAttribute('class', 'header');
  divNode.setAttribute('id', 'time-now');
  headerNode.appendChild(headerTextNode);
  divNode.appendChild(divTextNode);
  contentNode.appendChild(headerNode);
  contentNode.appendChild(divNode);
  document.getElementById('root').appendChild(contentNode);

  const ws = new WebSocket('ws://localhost:3001');
  console.log(['Socket'], ws);
  ws.onopen = event => {
    console.log(['WebSocket.onopen'], event);
    ws.send('text that the server is immediately returns!');
  };
  ws.onclose = event => {
    console.log(['WebSocket.onclose'], event);
  };
  ws.onmessage = event => {
    const { data } = JSON.parse(event.data);
    console.log(['WebSocket.onmessage'], data);
    const date = new Date(data).getDate();
    console.log(['WebSocket.date'], date);
    divNode.innerHTML = `Server time: ${(new Date(data).toLocaleTimeString())}`;
  }
});
