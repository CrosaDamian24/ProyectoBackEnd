const socket = io();
const div = document.getElementById("div");

socket.on("updateProducts", (data) => {
  div.innerHTML = ` `;
  for (products of data) {
    let li = document.createElement("li");
    li.innerHTML = `${products.title}`;
    div.appendChild(li);
  }
});
