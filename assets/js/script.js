// HTML element declarations
const enterEl = document.getElementById("enter-button");
const apiFieldEl = document.getElementById("api-key");
const goldFieldEl = document.getElementById("gold");
const gemsFieldEl = document.getElementById("gems");
const usdFieldEl = document.getElementById("usd");
const currencyFieldEl = document.getElementById("my-currency");
const apiHistoryEl = $('#history-buttons');
const apiHistoryButtonsEl = document.querySelector(".api-history");

/* ---------------------- MODALS ----------------------- */
// Get the modal main div
var modal = document.getElementById("my-modal");
// Get the modal div that will display the error text to user
var modalAlert = document.getElementById("modal-alert");
// create a <p> element in html, give it an ID, determine text content
// append the text to the modalAlert div
var modalText = document.createElement("p");
modalText.setAttribute("id", "modal-text");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


let currencyHistory = [];

// Testing API Keys: 3866BD83-5D2B-AA46-8859-518486210B510E1ED7BA-9AE9-49C2-8035-A5B53A93DF06 | 6A8C3A68-7264-054E-8E91-6E368B2C223B803FA554-3434-402A-B047-C8657E85F416 | 47CCF467-6BAC-384A-862D-9CB56277395909CA89B9-B43F-4E8C-BD64-1185E8426D04

// ------------------- GW2 API JS --------------------

// GLOBALS----------------------
let gwApiKey = "";
let usdValue = "";
let newUsdValue = "";

let apiSave = localStorage.getItem(`apiSaveNumber`)

// Sets history buttons if search history already exists
if (!apiSave) {
  localStorage.setItem(`apiSaveNumber`, 0)
} else {
  for (let i = 1; i < apiSave+1; i++) {
    if (localStorage.getItem(`api${i}`) === null) break; {
      apiHistoryEl.append(`<a class="waves-effect waves-light btn" data-count"${apiSave}" data-name="${localStorage.getItem(`api${i}`)}">${localStorage.getItem(`api${i}`)}</a>`);
    }
  }
}

// FUNCTIONS--------------------

// Pulls GW2 API data
function getApi(key) {
  // Looks up entered key account's gold value
  let requestUrl = `https://api.guildwars2.com/v2/account/wallet?access_token=${key}`;

  fetch(requestUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        // If the response is not 'ok', display to user in modal
        console.log("BAD REPONSE: " + !response.ok);
        modalText.textContent = "Status Error on Fetch: " + response.status + ". Check your API key or network connection.";
        modalAlert.append(modalText);
        modal.style.display = "block";
      }
    })
    .then(function (data) {
      // Pulls the value of the entered key account's gold value
      coinSpacing(data[0].value);
      
      // Looks up entered GW2's global gold to gem conversion rate, based on amount of gold from previous input
      let requestOtherUrl = `https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=${data[0].value}`;

      fetch(requestOtherUrl)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            // If the response is not 'ok', display to user in modal
            console.log("BAD REPONSE: " + !response.ok);
            modalText.textContent = "Status Error on Fetch: " + response.status + ". Check your API key or network connection.";
            modalAlert.append(modalText);
            modal.style.display = "block";
          }
        })
        .then(function (data1) {
          // Pulls the amount of gems the entered key account's gold converts into
          gemsFieldEl.innerHTML = `${data1.quantity} <img src="./assets/images/Gem.png" alt="Gem">`;
          // Converts account's gem value into USD based on a non-fluctuating amount at a rate of 1 Gem = .0125 Cents
          usdValue = Math.round(data1.quantity * 0.0125 * 100) / 100;
          // Adjusts USD value to present it in a ledgeable format, aka 2 decimal cents and all dollars
          newUsdValue = parseFloat(usdValue).toFixed(2);
          // Further adjusts displayed USD to include "$" sign, then displays it
          let displayUsdValue = `$${newUsdValue}`;
          usdFieldEl.textContent = displayUsdValue;

          // Checks if an optional currency is used to convert after USD is established
          if (acceptedCurrencyCodeArray.includes(currencyFieldEl.value)) {
          currencyExchange();
          }
        });
    });
}

// Seperates coins into the 3 different in-game values: Gold, Silver, and Copper
function coinSpacing(coins) {
  let coinValue = coins + '';
  let coinArray = [];
  let goldArray = [];
  // Creates an array from the Account's coin value
  coinArray = coinValue.split("");
  // Reverses the Array such that the "Copper" value will always be the first 2 numbers, and the "Silver" value will always be the second 2 numbers
  coinArray.reverse();
  copper = `${coinArray[1]}${coinArray[0]}`;
  silver = `${coinArray[3]}${coinArray[2]}`;
  // Corrects the Coin Array such that the "Gold" value will be all numbers starting from the beginning, minus the last 4 digits (Copper and Silver values)
  coinArray.reverse();
  // Inserts the "Gold" values into a new array, then combines them into a single number
  for (let i = 0; i < coinArray.length-4; i++) {
    goldArray.push(coinArray[i]);
  }
  gold = goldArray.join("");
  // Displays coinage values, placing coin symbols where appropriate
  goldFieldEl.innerHTML = `${gold} <img src="./assets/images/Gold_coin.png" alt="Gold"> ${silver} <img src="./assets/images/Silver_coin.png" alt="Silver"> ${copper} <img src="./assets/images/Copper_coin.png" alt="Copper">`;
}

// ------------------- EXCHANGE RATE JS --------------------

// QUERIES----------------------

// GLOBALS----------------------
var currencyNameArray = [];
var currencyRateArray = [];
// This webpage will allow users to select the following 15
// currency options as a base option.
// It is possible to push more to codes to this array if desired
var acceptedCurrencyCodeArray = [
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "EUR",
  "GBP",
  "HKD",
  "INR",
  "JPY",
  "KRW",
  "MXN",
  "NOK",
  "NZD",
  "SEK",
  "SGD",
];
var acceptedCurrencyCodeString = acceptedCurrencyCodeArray.toString();
// This array will hold the rates corresponding to the
// acceptedCurrencyCodeArray
var acceptedCurrencyRateArray = [];
// Object will hold the Codes and corresponding Rates
var acceptedCodeRateObject = {};
// baseCurrency will be USD
var baseCurrency = "USD";

var exchangeApiKey = "904542f1d90e49118826f374af1f2cbf";

var exchangeUrl = `https://api.currencyfreaks.com/latest?apikey=${exchangeApiKey}&symbols=${acceptedCurrencyCodeString}`;

// FUNCTIONS--------------------

function init() {
  // retrieve latest data from exchange rate API

  getExchangeRate();
  
}

var getExchangeRate = function() {

  fetch(exchangeUrl)
      .then(function (response) {
          // check that code is viable
          // store data from API into global object
          if (response.ok) {
              myData = response.json();
              myData.then(function (data) {
                  // stores the object 'rates' from the data response into
                  // global variable object
                  acceptedCodeRateObject = data.rates;
                  i = 0

                  // Dynamically create dropdown to select currency
                  var myOptions = acceptedCodeRateObject;
                  var mySelect = $('#my-currency');                    
                  // for each key-value (myCountryCode-myExchangeRate) pair
                  // append the country code as an option in the drop down
                  // use the exchange rate to perform operation to convert data
                  $.each(myOptions, function(myCountryCode, myExchangeRate) {
                      mySelect.append($(`<option data-name="${i++}"></option>`).val(myCountryCode).html(myCountryCode));
                      acceptedCurrencyRateArray.push(myExchangeRate)               
                  });
              });
            } else {
              console.log("BAD REPONSE: " + !response.ok);
              modalText.textContent = "Status Error on Fetch: " + response.status;
              modalAlert.append(modalText);
              modal.style.display = "block";
            }              
      });
}

// Exchanges and displays a selected currency
var currencyExchange = function () {
  const currencyTitle = $("#extra-currency");
    // Checks for a specified currencies dataset value
    let rateValue = currencyFieldEl.selectedOptions[0].dataset.name;
    // Displays output for optional currency conversion
    currencyTitle[0].textContent = currencyFieldEl.value;
    $(".usd-card").removeClass("hide");
    // Uses currency dataset value to multiply USD value with currency exchange rates, displaying it with the correct currency symbol
    if (currencyFieldEl.value === 'AUD')  {
      currencyTitle.append($("<p></p>").html(`$ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'CAD'){
      currencyTitle.append($("<p></p>").html(`$ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'CHF') {
      currencyTitle.append($("<p></p>").html(`fr. ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'CNY'){
      currencyTitle.append($("<p></p>").html(`¥ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'EUR'){
      currencyTitle.append($("<p></p>").html(`€${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'GBP'){
      currencyTitle.append($("<p></p>").html(`£${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'HKD'){
      currencyTitle.append($("<p></p>").html(`HK$ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'INR'){
      currencyTitle.append($("<p></p>").html(`₹ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'JPY'){
      currencyTitle.append($("<p></p>").html(`¥ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'KRW'){
      currencyTitle.append($("<p></p>").html(`₩ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'MXN'){
      currencyTitle.append($("<p></p>").html(`$ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'NOK'){
      currencyTitle.append($("<p></p>").html(`kr ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'NZD'){
      currencyTitle.append($("<p></p>").html(`$ ${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    } else if (currencyFieldEl.value === 'SEK'){
      currencyTitle.append($("<p></p>").html(`${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)} kr`));
    } else if (currencyFieldEl.value === 'SGD'){
      currencyTitle.append($("<p></p>").html(`$${parseFloat(newUsdValue * acceptedCurrencyRateArray[rateValue]).toFixed(2)}`));
    }
};


// EVENT HANDLERS-----------------------------------

let formSubmitHandler = function (event) {
  event.preventDefault();

  // Trims API input, then converts and pushes it to an array for verifacation
  let api = apiFieldEl.value.trim();
  let apiArray = [];
  apiArray.push(api.split(""));
  // Checks if an API Key that is entered is of a valid length
  if (apiArray[0].length === 72) {
    gwApiKey = api;
    // Runs the GW2 API function on the entered API key
    getApi(gwApiKey)
    // Checks if all 3 slots have been used for search history; if they have, resets the counter; if not, increases the counter and makes a new button if 3 do not already exist
    if (apiSave === 3) {
      apiSave = 1
      localStorage.setItem(`apiSaveNumber`, apiSave)
      localStorage.setItem(`api${apiSave}`, api)
      if (apiSave) {
        apiHistoryEl[0].children[0].textContent = localStorage.getItem(`api1`)
        apiHistoryEl[0].children[1].textContent = localStorage.getItem(`api2`)
        apiHistoryEl[0].children[2].textContent = localStorage.getItem(`api3`)
      }
    } else {
      apiSave++
      localStorage.setItem(`apiSaveNumber`, apiSave)
      localStorage.setItem(`api${apiSave}`, api)
      if (apiHistoryEl[0].children[0]) {
        apiHistoryEl[0].children[0].textContent = localStorage.getItem(`api1`)
      }
      if (apiHistoryEl[0].children[1]) {
        apiHistoryEl[0].children[1].textContent = localStorage.getItem(`api2`)
      }
      if (apiHistoryEl[0].children[2]) {
        apiHistoryEl[0].children[2].textContent = localStorage.getItem(`api3`)
      }
      if (!apiHistoryEl[0].children[2]) {
        apiHistoryEl.append(`<a class="waves-effect waves-light btn" data-count"${apiSave}" data-name="${localStorage.getItem(`api${apiSave}`)}">${localStorage.getItem(`api${apiSave}`)}</a>`);
      }
    };
  } else {
    // Alert user to enter valid API key
    modalText.textContent = "Please enter a valid 72 digit Guild Wars 2 API Key";
    modalAlert.append(modalText);
    modal.style.display = "block";
  }
  
};

// Setting previous searches data attributes
apiHistoryButtonsEl.addEventListener("click", function(event) {
  let element = event.target;

  if (element.matches("a")) {
     
    let name = element.getAttribute("data-name");
    getApi(name);
  }
}
);

enterEl.addEventListener("click", formSubmitHandler);

// MODAL EVENTS -----------------------------------
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// RUN PROGRAM--------------------------------------
init();