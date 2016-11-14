var invObj = [];

// Initialization on page load - If data exists in database (localStorage for testing), build the Inventory Table.
function init() {
  if (localStorage.foodInv) {
    invObj = JSON.parse(localStorage.foodInv);
    buildInv();
  }
}

// Loop through inventory object to build the inventory table.
function buildInv() {
  var tableContent = document.getElementById("myInv").getElementsByTagName("tbody")[0];
  for (i = 0; i < invObj.length; i++) {
    var foodName = invObj[i].food;
    var lbl = Object.keys(invObj[i].amount);
    var amt = invObj[i].amount[lbl];
    var expiry = invObj[i].expiration;
    var newRow = tableContent.insertRow();

    var foodCell = newRow.insertCell(0);
    var amtCell = newRow.insertCell(1);
    var expCell = newRow.insertCell(2);

    foodCell.innerHTML = foodName;
    amtCell.innerHTML = amt + ' ' + lbl[0];
    expCell.innerHTML = expiry;
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
  newObj.amount = {};
  newObj.amount[addLabel] = addAmt;
  newObj.expiration = addExp;
  newObj.shelflife = addLife;
  invObj.push(newObj);
  console.log(invObj);
  var inv = JSON.stringify(invObj);
  localStorage.foodInv = inv;
  buildInv();
}
