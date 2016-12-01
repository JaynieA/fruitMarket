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

var createFruits = function() {
    var apple = {
        type: "apple",
        price: 1.49
    };
    var orange = {
        type: "orange",
        price: 1.25
    };
    var banana = {
        type: "banana",
        price: 1.75
    };
    var grape = {
        type: "grape",
        price: 4.69
    };
    fruitStock.push(apple, orange, banana, grape);
};

/* --- DOM DISPLAY FUNCTIONS --- */

function displayStoreFruit(fruitArray, displayId) {
    /* Creates a set of buttons for each fruit in the array and appends to the
    DOM */
    var htmlString = '';
    fruitArray.forEach(function(fruit) {
        htmlString += '<button type="button" class="buyFruit"';
        htmlString += 'name="' + fruit.type + '" id="' + fruit.type + '">';
        htmlString += '<p>' + fruit.price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        }) + '</p></button>';
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
                //push purchased fruit into the array
                userStock.push(fruitStock[i]);
                console.log('fruit stock: ', userStock);
            } // end if
        } // end for
        updateWallet(price);
        //display update wallet on DOM
        $('#userWalletDiv').html('<p>' + userWallet.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        }) + '</p>');
        displayUserStock();
    }); // end .purchaseFruit on click
}); // end doc ready


var updateModal = function(modalType) {
    console.log(modalType);
    var modalHeaderText;
    var modalHeader = $('.modal-header');
    switch (modalType) {
        case 'red':
            modalHeader.addClass('red');
            modalHeaderText = '<span class="glyphicon glyphicon-warning-sign red" aria-hidden="true"></span> Not Enough Money';
            modalBodyPText = 'You do not have enough money in your wallet to purchase this fruit.';
            $('#purchaseModal').modal('show');
            break;
        case 'yellow':
            modalHeader.addClass('yellow');
            modalHeaderText = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> You are now out of money';
            modalBodyPText = 'Your wallet is now empty.';
            $('#purchaseModal').modal('show');
            break;
        case 'green':
            modalHeader.addClass('green');
            modalHeaderText = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Fruit Purchased';
            modalBodyPText = 'You successfully purchased this fruit.';
            break;
        default:
            modalHeaderText = '';
    }
    $('#purchaseModal').find('.modal-header').html(modalHeaderText);
    $('#modalBodyP').html(modalBodyPText);
};

var updateWallet = function(price) {
    //subtract price of fruit from userWallet
    userWallet -= price;
    //make sure there is enough in wallet for the purchase
    modalType = '';
    //change modal response according to userWallet
    if (userWallet < 0) {
        console.log('you do not have enough money to do this');
        modalType = 'red';
    } else if (userWallet === 0) {
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
    for (var i = 0; i < userStock.length; i++) {
        outputText += '<button class="sellFruit" id="' + userStock[i].type + '"></button>';
    }
    //display results of userStock to the DOM
    $('#userStock').html(outputText);
};
