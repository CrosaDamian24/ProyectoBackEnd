const socket = io();
const div = document.getElementById("div");

console.log('pasa por aca')

socket.on("updateProducts", (data) => {
    console.log('pasa por acaasasa')
    div.innerHTML = ` `
  for (products of data) {
    let li = document.createElement("li");
    li.innerHTML = `${products.title}`;
    div.appendChild(li)
  }
 
});
 