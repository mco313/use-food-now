var invObj = [];

// Initialization on page load - If data exists in database (localStorage for testing), build the Inventory Table.
// Loop through and assign Item Index Number to handle deletion / editing of items.
function init() {
  if (localStorage.foodInv) {
    invObj = JSON.parse(localStorage.foodInv);
    buildInv();
  };
};

// Loop through inventory object to build the inventory table.
//var delIcon = '<button id="delFood"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';

function buildInv() {
  var tableContent = document.getElementById("myInv").getElementsByTagName("tbody")[0];
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
    delCell.innerHTML = '<button class="trash" id="' + i + '"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
  };
};

var submit = document.getElementById("addNew");
submit.addEventListener("click", addItem);

// Push user entered item into inventory and rebuild the inventory table.
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
var deleteFood = document.querySelector('tbody');
deleteFood.addEventListener('click', delFunc);

function delFunc() {
    var currEle = event.target;
    console.log(currEle);
    var currId = currEle.id;
    console.log(currId);
    var loc = parseInt(currId);
    console.log(loc);
    invObj = invObj.splice(loc, 1);
    console.log(invObj);
    buildInv();
};
