var invObj = [];
var today = new Date();
var currYear = today.getFullYear();
var currMon = today.getMonth()+1;
var currDay = today.getDate();

// Initialization on page load - If data exists in database (localStorage for testing), build the Inventory Table.

function init() {
  if (localStorage.foodInv) {
    invObj = JSON.parse(localStorage.foodInv);
    buildInv();
    var inv = JSON.stringify(invObj);
    localStorage.foodInv = inv;
  };
};

// Loop through inventory object to build the inventory table.

function buildInv() {
  var tableContent = document.getElementById("myInv").getElementsByTagName("tbody")[0];
  tableContent.innerHTML = '';

  // expArr has days till expiration values that get sorted and used to access
  // and build sorted table with soonest exp on top.
  // Also, delete the index values to be reassigned corresponding to expiration.
  var expArr = [];
  for (j = 0; j < invObj.length; j++) {
    delete invObj[j].index;
    expArr.push(parseInt(invObj[j].expiration));
    expArr.sort(function(a, b) {
      return a - b;
    });
  };

  // Loop through the sorted expiration array and find the item with that expiration
  // by the index by looping through inventory for each expiration.  For multiple items
  // with same expiration, check to see if items already has an index value assigned
  // (already written into table) and break loop after writing to ensure only one item
  // gets written per expiration.
  loop1:
    for (i = 0; i < invObj.length; i++) {
  loop2:
      for (l = 0; l < invObj.length; l++) {
        if (expArr[i] == parseInt(invObj[l].expiration)) {
          var duplicate = invObj[l].index;
          if (!duplicate) {
            // Assign index number to each entry for deletion / editing
            var indexLoc = i + 1;
            invObj[l].index = indexLoc;

            var foodName = invObj[l].food;
            var amt = invObj[l].amount;
            var lbl = invObj[l].label;
            var expiry = invObj[l].expiration;
            var newRow = tableContent.insertRow();

            var foodCell = newRow.insertCell(0);
            var amtCell = newRow.insertCell(1);
            var expCell = newRow.insertCell(2);
            var delCell = newRow.insertCell(3);

            foodCell.innerHTML = foodName;
            amtCell.innerHTML = amt + ' ' + lbl;
            expCell.innerHTML = expiry + ' days';

            var delButton = document.createElement('button');
            delButton.setAttribute('id', indexLoc);
            delButton.setAttribute('class', 'trash');
            delButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
            delCell.append(delButton);
            delButton.addEventListener('click', delFunc);
            break loop2;
        };
      };
    };
  };
};

// Push user entered item into inventory and rebuild the inventory table.

var submit = document.getElementById("addNew");
submit.addEventListener("click", addItem);

function addItem() {
  var addFood = document.getElementById('newFood').value;
  var addAmt = document.getElementById('newAmt').value;
  var addLabel = document.getElementById('newLabel').value;
  var addLoc = document.getElementById('newLoc').value;
  var addExp = document.getElementById('newExp').value;
  var days = daysLeft(addExp);
  var newObj = {};
  newObj.food = addFood;
  newObj.amount = addAmt;
  newObj.label = addLabel;
  newObj.location = addLoc;
  newObj.expiration = days;
  invObj.push(newObj);
  buildInv();
  var inv = JSON.stringify(invObj);
  localStorage.foodInv = inv;
};

// Delete Item From Inventory Using Trash Button

function delFunc() {
  var currEle = event.target;
  var currId = currEle.id;

  // If user clicks on trash icon instead of surrounding button, assign id of the parent button.
  if (!currId) {
    currId = currEle.parentElement.id;
  };

  // Loop through index values to find/del selected entry corresponding to id assigned to trash button.
  for (var m = 0; m < invObj.length; m++) {
    var itemLoc = invObj[m].index.toString();
    if (currId == itemLoc) {
      invObj.splice(m, 1);
    };
  };
  buildInv();
  var inv = JSON.stringify(invObj);
  localStorage.foodInv = inv;
};

// Calculate days to expiration (NOTE: ONLY WORKS FOR SAME MONTH CURRENTLY!)

function daysLeft(exp) {
  var dateArr = exp.split('-');
  var entYear = dateArr[0];
  var entMon = dateArr[1];
  var entDay = dateArr[2];
  days = 0;
  if (entYear == currYear) {
    if (entMon == currMon) {
      days = parseInt(entDay) - parseInt(currDay);
      return days;
    }
  }
}

// Clicking on Fridge or Cupboard hides item rows not in current selection.

var fridgeView = document.getElementById('fridge');
fridgeView.addEventListener('click', filterView);

var cupboardView = document.getElementById('cupboard');
cupboardView.addEventListener('click', filterView);

function filterView() {
  var currLoc = this.id;
  var currState = this;
  var currAct = document.querySelector('.butActive');

  // If no current filter exists, add .butActive class to button and hide non-selected rows.
  if (!currAct) {
    currState.setAttribute('class', 'butActive');
    for (var i = 0; i < invObj.length; i++) {
      if (invObj[i].location !== currLoc) {
        var hideId = invObj[i].index;
        var hideRow = document.getElementById(hideId).parentNode.parentNode;
        hideRow.setAttribute('class', 'hidden');
      };
    };

  // If user clicks on the active filter, turn off butActive class and remove .hidden from item rows.
  } else if(currState == currAct) {
    currAct.removeAttribute('class', 'butActive');
    var oldFilter = document.querySelectorAll('.hidden');
    for (var i = 0; i < oldFilter.length; i++) {
      oldFilter[i].removeAttribute('class', 'hidden');
    };

  // If user clicks on fridge while cupboard is active, remove .butActive and .hidden classes
  // corresponding to cupboard before adding them for fridge.
  } else {
    currAct.removeAttribute('class', 'butActive');
    var oldFilter = document.querySelectorAll('.hidden');
    for (var i = 0; i < oldFilter.length; i++) {
      oldFilter[i].removeAttribute('class', 'hidden');
    };
    currState.setAttribute('class', 'butActive');
    for (var i = 0; i < invObj.length; i++) {
      if (invObj[i].location !== currLoc) {
        var hideId = invObj[i].index;
        var hideRow = document.getElementById(hideId).parentNode.parentNode;
        hideRow.setAttribute('class', 'hidden');
      };
    };
  }
};

// Rebuild Inventory with no filters on home button.

var homeView = document.getElementById('home');
homeView.addEventListener('click', buildInv);
