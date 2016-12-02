// --- GLOBALS ---
var fruitStock = [];
var userStock = [];
// User starts with $100.00
var userWallet = 100;

/* --- MAIN LOGIC --- */
$(document).ready(function() {
    // Initialize the store's stock
    createFruits();
    console.log(fruitStock);
    // Display the intial store fruit
    displayStoreFruit(fruitStock, '#fruitStock');
    // Start the counter for random price changes (every 15 seconds)
    setInterval(function() {
        changePrices();
        displayStoreFruit(fruitStock, '#fruitStock');
    }, 15000);
});

var randomStart = function() {
  var startPrice = Math.random()*10;
  console.log('Start price: ' + startPrice);
  if (startPrice>=3.5 && startPrice<=6.99) {
    return startPrice;
  }
  else {
    return randomStart();
  }
};
randomStart();

var createFruits = function() {
    var apple = {
        type: "apple",
        price: randomStart()
    };
    var orange = {
        type: "orange",
        price: randomStart()
    };
    var banana = {
        type: "banana",
        price: randomStart()
    };
    var grape = {
        type: "grape",
        price: randomStart()
    };
    fruitStock.push(apple, banana, grape, orange);
};

/* --- DOM DISPLAY FUNCTIONS --- */

function displayStoreFruit(fruitArray, displayId) {
    /* Creates a set of buttons for each fruit in the array and appends to the
    DOM */
    var htmlString = '';
    fruitArray.forEach(function(fruit) {
        htmlString += '<div class="col-sm-3"><div class="marketFruit"><button type="button" class="buyFruit"';
        htmlString += 'name="' + fruit.type + '" id="' + fruit.type + '">';
        htmlString += '<p>' + fruit.price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        }) + '</p></button></div></div>';
    });
    // Makes sure the display ID passed in matches the required syntax
    if (displayId[0] !== '#') {
        displayId = '#' + displayId;
    }
    // Append to the DOM at the provided display ID
    $(displayId).html(htmlString);
}

/* --- RANDOM PRICE CHANGING FUNCTIONS --- */

function changePrices() {
    /* Changes the price of all fruits in fruitStock according to the following
    rulse:
      * Price change should be between $0.01 and $0.50
      * Price change can be up or down
      * A fruit's price should never be higher than $9.99 or lower than $0.50 */
    fruitStock.forEach(function(fruit) {
        var priceChange = randomPriceChangeValue();
        if (fruit.price + priceChange > 9.99) {
            // Subtract the price if the new price would be over the ceiling
            fruit.price -= priceChange;
        } else if (fruit.price - priceChange < 0.50) {
            // Add the price if the new price would be below the floor
            fruit.price += priceChange;
        } else {
            // If either direction is safe, determine at random
            fruit.price = randomPriceChange(fruit.price, priceChange);
        }
    });
}

function randomPriceChangeValue() {
    /* Returns a random value between 0.01 and 0.50 */
    return Math.round((Math.random() + 0.01) / 2 * 100) / 100;
}

function randomPriceChange(originalPrice, priceChange) {
    /* Returns the new price of the fruit with the change value added or
    subtracted at random */
    if (Math.random() > 0.50) {
        return originalPrice + priceChange;
    } else {
        return originalPrice - priceChange;
    }
}

$(document).ready(function() {
    $(document).on('click', '.buyFruit', function() {
        //get type of fruit to purchase
        var fruitToBuy = $(this).attr('name');
        // loop through fruits in fruitStock array to find matching type
        for (var i = 0; i < fruitStock.length; i++) {
            //get current price of that type
            fruitType = fruitStock[i].type;
            if (fruitType === fruitToBuy) {
                var price = fruitStock[i].price;
                console.log('price: ', price);
                updateWalletAndInventory(price, fruitStock[i]);
                //push purchased fruit into the array
                // userStock.push(fruitStock[i]);
                console.log('fruit stock: ', userStock);
            } // end if
        } // end for
        //display update wallet on DOM
        $('#userWalletDiv').html('<p>' + userWallet.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        }) + '</p>');
        displayUserStock();
    }); // end .purchaseFruit on click
    $(document).on('click', '.sellFruit', sellFruit);
}); // end doc ready

function sellFruit() {
  /* Removes the clicked fruit from the user's basket and refunds them for the
  current market price of the matching type */
  var fruitType = $(this).attr('id');
  // Find the matching fruit in the user's basket and remove it
  for (var i = 0; i < userStock.length; i++) {
    if(userStock[i].type === fruitType) {
      // Remove the matching fruit from the user's basket
      userStock.splice(i, 1);
      // Stop once the first match is found
      break;
    }
  }
  // Find the matching fruit type in the store and get the current price
  var currentPrice = 0;
  for (var j = 0; j < fruitStock.length; j++) {
    if (fruitStock[j].type === fruitType) {
      currentPrice = fruitStock[j].price;
    }
  }
  userWallet += currentPrice;
  $('#userWalletDiv').html('<p>' + userWallet.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
  }) + '</p>');
  displayUserStock();
}

var updateModal = function(modalType) {
    console.log(modalType);
    var modalHeaderText;
    var modalHeader = $('.modal-header');
    var modalBodyPText;
    var modalDiv = $('#purchaseModal');
    //update modal based on modalType and show if 'red' or 'green'
    if (modalType === 'red') {
        modalHeader.addClass('red');
        modalHeaderText = '<span class="glyphicon glyphicon-warning-sign red" aria-hidden="true"></span> Not Enough Money';
        modalBodyPText = 'You do not have enough money in your wallet to purchase this fruit.';
        modalDiv.modal('show');
    } else if (modalType === 'yellow') {
        modalHeader.addClass('yellow');
        modalHeaderText = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> You are now out of money';
        modalBodyPText = 'Your wallet is now empty.';
        modalDiv.modal('show');
    }
    modalDiv.find('.modal-header').html(modalHeaderText);
    $('#modalBodyP').html(modalBodyPText);
};
var updateWalletAndInventory = function(price, fruitToPush) {
    var walletAfterPurchase = userWallet - price;
    console.log('wallet after purchase: ' + walletAfterPurchase);
    //make sure there is enough in wallet for the purchase
    //subtract price of fruit from userWallet and push to inventory if purchase does not put amount under 0
    if (walletAfterPurchase >= 0) {
        console.log('change amount in wallet and push to user inventory');
        userWallet -= price;
        userStock.push(fruitToPush);
    }
    modalType = '';
    //change modal response according to userWallet
    if (walletAfterPurchase < 0) {
        console.log('you do not have enough money to do this');
        modalType = 'red';
    } else if (walletAfterPurchase === 0) {
        console.log('you are now out of money');
        modalType = 'yellow';
    } else {
        console.log('ok');
        modalType = 'green';
    }
    //update and show modal
    updateModal(modalType);
    console.log('$ left in wallet: ', userWallet);
};

var displayUserStock = function() {
    console.log('in displayUserStock:', displayUserStock);
    var outputText = "The fruits you own: ";
    sortArray(userStock);
    for (var i = 0; i < userStock.length; i++) {
        outputText += '<button class="sellFruit" id="' + userStock[i].type + '"></button>';
    }
    //display results of userStock to the DOM
    $('#userStock').html(outputText);
};

var sortArray = function(arr){
  arr.sort(function(a, b) {
      aName = a.type.toLowerCase();
      bName = b.type.toLowerCase();
      if (aName < bName) {
          return -1;
      } else if (aName > bName) {
          return 1;
      } else {
          return 0; //default return value (no sorting);
      }
  });
};
