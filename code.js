const Papa = require('papaparse');

const data = Papa.parse('data.csv');

// Uso split para separar los strings y que "decodifique" el codigo de MyTE
const output = data.data.map((row) => {
  return {
    value: row[0],
    role: row[1],
    scope: row[3].split('/')
  };
});

const newMyteScope = [];
const newMyteRole = [];

output.forEach((row) => {
  newMyteScope.push(row.scope);
  newMyteRole.push(row.role);
});

// Cargo el archivo CSV
function loadMappingListFromCSV() {
  const csvFilePath = 'C:/Users/l.contreras/Downloads/Role to entitlement Lau 30 (10).csv';

  //Lee el archivo CSV
  Papa.parse(csvFilePath, {
    header: true, 
    dynamicTyping: true, 
    complete: function (results) {
      if (results.data) { //Guarda la lista en results.data
        mappingList = results.data;
      }
    },
  });
}

//Llamo a la fc para cargar el CSV
loadMappingListFromCSV();

//---------------BUTTONS-------------------

//:::::COPY BUTTON:::
grabBtn.addEventListener("click", async () => {

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true},
    function: getScope,
  });
  
  grabBtn.innerText = "Copied!";
  grabBtn.style.background = "#2edd8c";

  setTimeout(() => {
    grabBtn.innerText = "Copy Scope";
    grabBtn.style.background = "rgb(119, 25, 207)";
  }, 800);

});

//:::::CHECK BUTTON:::

checkBtn.addEventListener("click", function(){
  inputValidation() ? scopeInfo(): false; 
});

//:::::SELECT BUTTON:::

selectBtn.addEventListener("click", () => {
  if(inputValidation()){
    setNewScope();
    async function asyncCall(){
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true},
        function: selectScope,
        args: [newMyteScope, newMyteRole]
      });
    };
    asyncCall();
  }  
});


//:::::REMOVE BUTTON:::

removeBtn.addEventListener("click", () => {
  if(inputValidation()){
    async function asyncCall(){
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true},
        function: removeScope,
        args: [newMyteScope]
      });
    };
    asyncCall();
  }  
});

//:::::VALIDATION BUTTON:::

validateBtn.addEventListener("click", () => {
    setNewScope();
    async function asyncCall(){
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true},
        function: validateScope,
        args: [newMyteScope, scopeInput, mappingList]
      });
    };
    asyncCall();
});

//:::::CLEAR INPUT BUTTON:::

clearBtn.addEventListener("click", () => {
  clearInput();
});
