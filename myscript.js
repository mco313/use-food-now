var invObj = [];

// Initialization on page load - If data exists in database (localStorage for testing), build the Inventory Table.

function init() {
  if (localStorage.foodInv) {
    invObj = JSON.parse(localStorage.foodInv);
    buildInv();
  };
};

// Loop through inventory object to build the inventory table.

function buildInv() {
  var tableContent = document.getElementById("myInv").getElementsByTagName("tbody")[0];
  tableContent.innerHTML = '';
  for (i = 0; i < invObj.length; i++) {
    // Assign index number to each entry for deletion / editing
    invObj[i].index = i;

    var foodName = invObj[i].food;
    var amt = invObj[i].amount;
    var lbl = invObj[i].label;
    var expiry = invObj[i].expiration;
    var newRow = tableContent.insertRow();

    var foodCell = newRow.insertCell(0);
    var amtCell = newRow.insertCell(1);
    var expCell = newRow.insertCell(2);
    var delCell = newRow.insertCell(3);

    foodCell.innerHTML = foodName;
    amtCell.innerHTML = amt + ' ' + lbl;
    expCell.innerHTML = expiry;

    var delButton = document.createElement('button');
    delButton.setAttribute('id', i);
    delButton.setAttribute('class', 'trash');
    delButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    delCell.append(delButton);
    delButton.addEventListener('click', delFunc);
  };
};

// Push user entered item into inventory and rebuild the inventory table.

var submit = document.getElementById("addNew");
submit.addEventListener("click", addItem);

function addItem() {
  var addFood = document.getElementById('newFood').value;
  var addAmt = document.getElementById('newAmt').value;
  var addLabel = document.getElementById('newLabel').value;
  var addExp = document.getElementById('newExp').value;
  var addLife = document.getElementById('newLife').value;
  var newObj = {};
  newObj.food = addFood;
  newObj.amount = addAmt;
  newObj.label = addLabel;
  newObj.expiration = addExp;
  newObj.shelflife = addLife;
  invObj.push(newObj);
  buildInv();
  var inv = JSON.stringify(invObj);
  localStorage.foodInv = inv;
};

// Delete Item From Inventory Using Trash Button

function delFunc() {
  var currEle = event.target;
  var currId = currEle.id;
  // If user clicks on trash icon instead of surrounding button, assign id of the button.
  if (!currId) {
    currId = currEle.parentElement.id;
  };
  var loc = parseInt(currId);
  invObj.splice(loc, 1);
  buildInv();
  var inv = JSON.stringify(invObj);
  localStorage.foodInv = inv;
};
