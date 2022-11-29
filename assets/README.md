# Project 01 - Game Currency to Real World Currency Exchange

# Purpose
The purpose of this project is to develop an original responsive webpage as a team using concepts learned in class over the previous several weeks. The main concepts for this integration are to:
1) Incorporate two or more [server-side APIs](https://coding-boot-camp.github.io/full-stack/apis/api-resources).
2) Utilize client-side storage.
3) Design the page with a CSS framework other than Bootstrap.
4) Allow user to interact with webpage.

Other points of interest within the acceptance criteria are to follow best practices as discussed in class. For example:
1) Have a polished User Interface (UI).
2) Do not use alerts, confirms, or prompts (use modals).
3) Deploy the webpage to GitHub Pages.

## Description

The webpage waits for a user to input their Guild Wars 2 API Key. On "Submit" the webpage will display the amount of gold the user currently has on their person; converts that amount into a secondary game currency called Gems (curreny that is usually obtained with real world money); then converts the gem amount into USD; a final, optional, step allows the user to select one of 15 currencies in the dropdown; and converts USD into the user-selected currency.

Each API entered is saved into local storage for quick recall by the user in the future.


![Image of website on initial load](./assets/images/initial-load.png)
![Image of website displaying local storage use](./assets/images/local-storage.png)
![Image of website with conversion figures displayed](./assets/images/all-features.png)


## Installation

N/A

## Usage

Open the webpage using the [live URL link](https://mdinkelbach.github.io/gw2-gold-conversion/) and use Chrome Developer Tools to inspect the source code. The code is commented and includes accessibility tags compared to the original code that used generic division tags.


## Credits

Resources used:
1) [Guild Wars 2 API](https://wiki.guildwars2.com/wiki/API:Main)
2) [Currency Freaks API ](https://currencyfreaks.com/documentation.html)
3) [Materialize]() 
4) Bootcamp Modules
5) [jQuery.each()](https://api.jquery.com/jquery.each/#:~:text=each()%2C%20which%20is%20used,corresponding%20array%20value%20each%20time.)
6) [jQuery Get Selected Option From Dropdown](https://stackoverflow.com/questions/10659097/jquery-get-selected-option-from-dropdown)
7) [World Currency Symbols](https://fastspring.com/blog/how-to-format-30-currencies-from-countries-all-over-the-world/)




## License

Please refer to the LICENSE in the repository.
