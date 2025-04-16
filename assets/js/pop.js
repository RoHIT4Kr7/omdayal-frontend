const popupscreen=document.querySelector(".pop-up");
const closebtn=document.querySelector("#close-btn");

window.addEventListener("load",() =>{
  setTimeout(() =>{
    popupscreen.classList.add("active");
  }, 2000);

  closebtn.addEventListener("click",()=>{
    popupscreen.classList.remove("active");
  })
});