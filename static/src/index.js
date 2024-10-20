const addPortMappingButton = document.getElementById("add-port-mapping-button");
const portMappingForm = document.getElementById("port-mapping-form");
addPortMappingButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  portMappingForm.classList.toggle("hidden");
});
