// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://localhost:${
  import.meta.env.REACT_APP_JSON_SERVER_PORT
}`;
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

// ***** Constants / Variables ***** //
const stateURL = `${baseServerURL}/states`;
let mainSection = document.getElementById("data-list-wrapper");
let paginationWrapper = document.getElementById("pagination-wrapper");

// state
let stateNameInput = document.getElementById("state-Name");
let stateImageInput = document.getElementById("state-image");
let statecapitalInput = document.getElementById("state-capital");
let statepopulationInput = document.getElementById("state-population");
let statelanguageInput = document.getElementById("state-language");
let stateGDPRankingInput = document.getElementById("state-GDPRanking");
let stateRegionInput = document.getElementById("state-region");
let statetourismPlacesInput = document.getElementById("state-tourismPlaces");
let stateCreateBtn = document.getElementById("add-state");

// Update state
let updateStateIdInput = document.getElementById("update-state-id");
let updatestateNameInput = document.getElementById("update-state-Name");
let updateStateImageInput = document.getElementById("update-state-image");
let updateStatecapitalInput = document.getElementById("update-state-capital");
let updateStatepopulationInput = document.getElementById(
  "update-state-population"
);
let updateStatelanguageInput = document.getElementById("update-state-language");
let updateStateGDPRankingInput = document.getElementById(
  "update-state-GDPRanking"
);
let updateStateRegionInput = document.getElementById("update-state-region");

let updateStatetourismPlacesInput = document.getElementById(
  "update-state-tourismPlaces"
);
let updateStateBtn = document.getElementById("update-state");

//Update GDPRanking
let updateGDPStateId = document.getElementById("update-GDP-state-id");
let updateGDPRankingStateGDPRanking = document.getElementById(
  "update-GDP-state-GDPRanking"
);
let updateGDPRankingStateBtn = document.getElementById("update-GDP-stateBtn");

//sort and filter
let sortAtoZBtn = document.getElementById("sort-low-to-high");
let sortZtoABtn = document.getElementById("sort-high-to-low");
let filterNortheast = document.getElementById("filter-North-East-India");
let filterWest = document.getElementById("filter-West-India");
let filterNorth = document.getElementById("filter-North-India");

//Search by name/language
let searchBySelect = document.getElementById("search-by-select");
let searchByInput = document.getElementById("search-by-input");
let searchByButton = document.getElementById("search-by-button");

//States Data
let statesData = [];
let queryParamString = null;
let pageNumber = 1;

async function fetchData(url ,queryParams=""){
  try{
    let res = await fetch(`${url}&${queryParams}`);
    let count = res.headers.get("X-Total-Count");
    pagination(count,5,queryParams)
    
    let data = await res.json();
    addCardList(data)
    console.log(data);
  }
  catch(error){
    console.log(error);
  }
}
 fetchData(`${stateURL}?_page=1&_limit=5`)

 // boiler 

 function addCardList(data){
  let cardList = document.createElement('div');
  cardList.className ='card-list';
  data.forEach((item)=>{
    let card = document.createElement('div');
    card.className ='card';

    let cardImg = document.createElement('div');
    cardImg.className ='card-img';
    let img = document.createElement('img');
    img.src = item.image;
    img.setAttribute('alt','state');

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let stateName = document.createElement('h5');
    stateName.className = 'card-stateName';
    let stateCap = document.createElement('p');
    stateCap.className = 'card-capital';
    let statePop = document.createElement('p');
    statePop.className = 'card-population';

    let stateRegion = document.createElement('p');
    stateRegion.className = 'card-region';
    let stateLang = document.createElement('p');
    stateLang.className = 'card-language';
    let stateRank = document.createElement('p');
    stateRank.className = 'card-GDPRanking';
    let stateTourism = document.createElement('p');
    stateTourism.className = 'card-tourismPlaces';
    let cardLink = document.createElement('a');
    cardLink.className = 'card-link';
    cardLink.setAttribute('href','#')
    let delBtn = document.createElement('button');
    delBtn.className = 'card-button';

    stateName.innerHTML = item.stateName;
    stateCap.innerHTML= item.capital;
    statePop.innerHTML = item.population;
    stateRegion.innerHTML = item.region;
    stateLang.innerHTML = item.language;
    stateRank.innerHTML = item.GDPRanking;
    stateTourism.innerHTML = item.tourismPlaces;
    cardLink.innerHTML ='Edit';
    
    cardLink.addEventListener('click',(e)=>{
      mainSection.innerHTML=""
      populatedData(item)
    })

    delBtn.innerHTML='Delete';
    delBtn.addEventListener('click',(e)=>{
      mainSection.innerHTML =""
      deleteData(item);
    })

    cardBody.append(stateName,stateCap,statePop, stateRegion,stateLang,stateRank,stateTourism, cardLink,delBtn)
    cardImg.append(img)
    card.append(cardImg,cardBody)
    cardList.append(card)
  })
  mainSection.append(cardList);
 }

 //pagination
 function pagination(total,limit,queryParams){
  let totalButtons = Math.ceil(total/limit);
  paginationWrapper.innerHTML ="";
  for(let i=1 ; i<=totalButtons; i++){
    let button = document.createElement('button');
    button.innerText = i;

    button.addEventListener('click',(e)=>{
      mainSection.innerHTML ="";
      fetchData(`${stateURL}?_page=${i}&_limit=5`,queryParams)
    })
    paginationWrapper.append(button)
  }
 }

 // add state
 async function addStates(){
  let newState ={
    stateName : stateNameInput.value,
    population : +statepopulationInput.value,
    GDPRanking : stateGDPRankingInput.value,
    image: stateImageInput.value,
    language : statelanguageInput.value,
    capital : statecapitalInput.value,
    region : stateRegionInput.value,
    tourismPlaces :[statetourismPlacesInput.value]
  }
  let res = await fetch(stateURL,{
    method : "POST",
    headers : {
      'Content-Type' : "application/json"
    },
    body : JSON.stringify((newState))
  })
  let data = await res.json();
  console.log(data)
  fetchData(`${stateURL}?_page=1&_limit=5`)
 }

 stateCreateBtn.addEventListener('click', function(){
  mainSection.innerHTML=""
  addStates();
 })

 //delete
async function deleteData(ele){
  let delUrl = `${stateURL}/${ele.id}`;
  let res = await fetch(delUrl,{
    method : "DELETE",
    headers : {
      'Content-Type' : "application/json"
    }
  })
  fetchData(`${stateURL}?_page=1&_limit=5`)
}

//populated data

async function populatedData(ele){
updateStateIdInput.value = +ele.id,
updatestateNameInput.value = ele.stateName,
updateStateImageInput.value = ele.image,
updateStatecapitalInput.value = ele.capital,
updateStatepopulationInput.value = +ele.population,
updateStatelanguageInput.value = ele.language,
updateStateGDPRankingInput.value = ele.GDPRanking,
updateStateRegionInput.value  = ele.region,
updateStatetourismPlacesInput.value = ele.tourismPlaces

localStorage.setItem("eleId",+ele.id)

updateGDPStateId.value = +ele.id,
updateGDPRankingStateGDPRanking.value = ele.GDPRanking
}

//update all

async function updateAll(){
  let stateId = localStorage.getItem("eleId");
  let newData ={
    id : updateStateIdInput.value,
    stateName : updatestateNameInput.value,
    image : updateStateImageInput.value,
    capital : updateStatecapitalInput.value ,
    population : updateStatepopulationInput.value,
    language : updateStatelanguageInput.value,
    GDPRanking : updateStateGDPRankingInput.value,
    region : updateStateRegionInput.value,
    tourismPlaces : updateStatetourismPlacesInput.value
  }
  let newUrl = `${baseServerURL}/states/${stateId}`;
  let res = await fetch(newUrl,{
    method : "PATCH",
    headers : {
      'Content-Type' : "application/json"
    },
    body : JSON.stringify(newData)
  })
  let data = await res.json()
  console.log(data)
  fetchData(`${stateURL}?_page=${1}&_limit=5`)

}

updateStateBtn.addEventListener('click', function(){
  mainSection.innerHTML=""
  updateAll();
 })

 //update gdp

 async function updateGDP(){
  let stateId = localStorage.getItem("eleId");
  let newData ={
    id : updateGDPStateId.value,
    GDPRanking : updateGDPRankingStateGDPRanking.value
  }
  let newUrl = `${baseServerURL}/states/${stateId}`;
  let res = await fetch(newUrl,{
    method : "PATCH",
    headers : {
      'Content-Type' : "application/json"
    },
    body : JSON.stringify(newData)
  })
  let data = await res.json()
  console.log(data)
  fetchData(`${stateURL}?_page=${1}&_limit=5`)

}

updateGDPRankingStateBtn.addEventListener('click', function(){
  mainSection.innerHTML=""
  updateGDP();
 })

 //search

 searchByButton.addEventListener('click',(e)=>{
  mainSection.innerHTML ="";
  fetchData(`${stateURL}?_page=1&_limit=5`,
  `${searchBySelect.value}_like=${searchByInput.value}`);
 })

 //sort

 sortAtoZBtn.addEventListener('click',(e)=>{
  mainSection.innerHTML ="";
  fetchData(`${stateURL}?_page=1&_limit=5`,`_sort=GDPRanking&_order=asc`)
 })

 sortZtoABtn.addEventListener('click',(e)=>{
  mainSection.innerHTML ="";
  fetchData(`${stateURL}?_page=1&_limit=5`,`_sort=GDPRanking&_order=desc`)
 })

 // filter

 filterNortheast.addEventListener('click',(e)=>{
  mainSection.innerHTML ="";
  fetchData(`${stateURL}?_page=1&_limit=5`,`region_like=North East India`)
 })

 filterNorth.addEventListener('click',(e)=>{
  mainSection.innerHTML ="";
  fetchData(`${stateURL}?_page=1&_limit=5`,`region_like=North India`)
 })

 filterWest.addEventListener('click',(e)=>{
  mainSection.innerHTML ="";
  fetchData(`${stateURL}?_page=1&_limit=5`,`region_like=West India`)
 })