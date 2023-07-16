// segurança da informação claramente não é o objetivo

main();

function main() {
  const urlParams = new URLSearchParams(window.location.search);

  let response = document.getElementById('response');

  for (const [key, value] of urlParams)
    response.innerHTML += `${key} -> ${value}<br>`;
}
