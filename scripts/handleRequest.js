// segurança da informação claramente não é o objetivo

main();

function main() {
  const urlParams = new URLSearchParams(window.location.search);

  let response = document.getElementById('response');

  response.innerHTML = `BEGIN_RESPONSE{`;
  for (const [key, value] of urlParams)
    response.innerHTML += `${key}: '${value}',`;
  response.innerHTML += `}END_RESPONSE`;

}
