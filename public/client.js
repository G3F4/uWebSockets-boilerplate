document.addEventListener('DOMContentLoaded', () => {
  const contentNode = document.createElement('div');
  const headerNode = document.createElement('h1');
  const headerTextNode = document.createTextNode('uWebSockets.js boilerplate!');
  const divNode = document.createElement('div');
  const divTextNode = document.createTextNode(`Server time: ${(new Date(Date.now()).toLocaleTimeString())}`);

  headerNode.setAttribute('class', 'header');
  divNode.setAttribute('id', 'time-now');
  headerNode.appendChild(headerTextNode);
  divNode.appendChild(divTextNode);
  contentNode.appendChild(headerNode);
  contentNode.appendChild(divNode);
  document.getElementById('root').appendChild(contentNode);

  const ws = new WebSocket('ws://localhost:3001');

  ws.onopen = event => {
    console.log(['WebSocket.onopen'], event);
  };
  ws.onclose = event => {
    console.log(['WebSocket.onclose'], event);
  };
  ws.onmessage = event => {
    const { data, type } = JSON.parse(event.data);
    console.log(['WebSocket.onmessage'], { data, type });

    if (type === 'SERVER_TIME') {
      divNode.innerHTML = `Server time: ${(new Date(data).toLocaleTimeString())}`;
    }
  };
  ws.onerror = event => {
    console.log(['WebSocket.onerror'], event);
  };
});
