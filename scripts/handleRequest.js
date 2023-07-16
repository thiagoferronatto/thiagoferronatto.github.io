// segurança da informação claramente não é o objetivo

main();

function main() {
  const urlParams = new URLSearchParams(window.location.search);

  let response = document.getElementById('response');

  response.innerHTML = `{<br/>`;
  for (const [key, value] of urlParams)
    response.innerHTML += `&nbsp&nbsp${key}: '${value}'<br/>`;
  response.innerHTML += `}`;
}
