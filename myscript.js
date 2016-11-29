var invObj = [];
var today = new Date();
var currYear = parseInt(today.getFullYear());
var currMon = parseInt(today.getMonth() + 1);
var currDay = parseInt(today.getDate());

// Initialization on page load - If data exists in database (localStorage for testing), build the Inventory Table.

function init() {
  if (localStorage.foodInv) {
    invObj = JSON.parse(localStorage.foodInv);
    buildInv();
    var inv = JSON.stringify(invObj);
    localStorage.foodInv = inv;
  }
}

// Loop through inventory object to build the inventory table.

function buildInv() {
  var tableContent = document.getElementById('myInv').getElementsByTagName('tbody')[0];
  tableContent.innerHTML = '';

  // expArr has days till expiration values that get sorted and used to access
  // and build sorted table with soonest exp on top.
  // Also, delete the index values to be reassigned corresponding to expiration.
  var expArr = [];
  for (j = 0; j < invObj.length; j++) {
    delete invObj[j].index;
    invObj[j].days = daysLeft(invObj[j].expiration);
    expArr.push(invObj[j].days);
  }
  expArr.sort(function(a, b) {
    return a - b;
  });


  // Loop through the sorted expiration array and find the item with that expiration
  // by the index by looping through inventory for each expiration.  For multiple items
  // with same expiration, check to see if items already has an index value assigned
  // (already written into table) and break loop after writing to ensure only one item
  // gets written per expiration.
  loop1:
    for (i = 0; i < invObj.length; i++) {
  loop2:
      for (l = 0; l < invObj.length; l++) {
        if (expArr[i] == invObj[l].days) {
          var duplicate = invObj[l].index;
          if (!duplicate) {
            // Assign index number to each entry for deletion / editing
            var indexLoc = i + 1;
            invObj[l].index = indexLoc;

            var foodName = invObj[l].food;
            var amt = invObj[l].amount;
            var lbl = invObj[l].label;
            var expiry = invObj[l].days;
            var newRow = tableContent.insertRow();

            var selectCell = newRow.insertCell(0)
            var foodCell = newRow.insertCell(1);
            var amtCell = newRow.insertCell(2);
            var expCell = newRow.insertCell(3);
            var delCell = newRow.insertCell(4);

            foodCell.innerHTML = foodName;
            amtCell.innerHTML = amt + ' ' + lbl;
            if (expiry == 0) {
              expCell.innerHTML = 'Today!';
            } else if (expiry < 0) {
              expCell.innerHTML = (0 - expiry) + ' days ago';
            } else {
              expCell.innerHTML = expiry + ' days';
            }

            var checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.value = foodName;
            checkBox.name = 'selectFood';
            checkBox.title = 'Select For Recipe Search';
            selectCell.append(checkBox);

            var delButton = document.createElement('button');
            delButton.setAttribute('id', indexLoc);
            delButton.setAttribute('class', 'trash');
            delButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
            delCell.append(delButton);
            delButton.addEventListener('click', delFunc);
            break loop2;
        }
      }
    }
  }
}

// Push user entered item into inventory and rebuild the inventory table.

var submit = document.getElementById('addNew');
submit.addEventListener('click', addItem);

function addItem() {
  var addFood = document.getElementById('newFood').value;
  var addAmt = document.getElementById('newAmt').value;
  var addLabel = document.getElementById('newLabel').value;
  var addLoc = document.getElementById('newLoc').value;
  var addExp = document.getElementById('newExp').value;
  var newObj = {};
  newObj.food = addFood;
  newObj.amount = addAmt;
  newObj.label = addLabel;
  newObj.location = addLoc;
  newObj.expiration = addExp;
  invObj.push(newObj);
  buildInv();
  var inv = JSON.stringify(invObj);
  localStorage.foodInv = inv;
}

// Delete Item From Inventory Using Trash Button

function delFunc() {
  var currEle = event.target;
  var currId = currEle.id;

  // If user clicks on trash icon instead of surrounding button, assign id of the parent button.
  if (!currId) {
    currId = currEle.parentElement.id;
  }

  // Loop through index values to find/del selected entry corresponding to id assigned to trash button.
  for (var m = 0; m < invObj.length; m++) {
    var itemLoc = invObj[m].index.toString();
    if (currId == itemLoc) {
      invObj.splice(m, 1);
    }
  }
  buildInv();
  var inv = JSON.stringify(invObj);
  localStorage.foodInv = inv;
}

// Calculate days to expiration or days past.

function daysLeft(exp) {
  var dateArr = exp.split('-');
  var entYear = parseInt(dateArr[0]);
  var entMon = parseInt(dateArr[1]);
  var entDay = parseInt(dateArr[2]);
  var todDay = currDay;
  var todMon = currMon;
  var todYear = currYear;
  var days = 0;
  if (todDay == entDay && todMon == entMon && todYear == entYear) {
    days = 0;
    return days;
  }

  // If today's date is after the items exp date, step item date up and do days -= 1.
  while (isDateAfter(todDay, todMon, todYear, entDay, entMon, entYear)) {
    var pastDate = nextDay(entDay, entMon, entYear);
    entDay = pastDate[0];
    entMon = pastDate[1];
    entYear = pastDate[2];
    days -= 1;
  }

  // If item's exp date is after today's date, step today's date up and days += 1.
  while (isDateAfter(entDay, entMon, entYear, todDay, todMon, todYear)) {
    var newDate = nextDay(todDay, todMon, todYear);
    todDay = newDate[0];
    todMon = newDate[1];
    todYear = newDate[2];
    days += 1;
  }
  return days;
}

// Is day1,mon1,year1 after day2,mon2,year2?
function isDateAfter(day1, mon1, year1, day2, mon2, year2) {
  if (year1 > year2) {
    return true;
  }
  if (year1 == year2) {
    if (mon1 > mon2) {
      return true;
    }
    if (mon1 == mon2) {
      return (day1 > day2);
    }
  return false;
  }
}

// Get the next day's date incrementally.
function nextDay(day, mon, year) {
  day += 1;
  var numDays = daysInMonth(year, mon);
  if (day > numDays) {
    mon += 1;
    day = 1;
    if (mon > 12) {
      year += 1;
      mon = 1;
    }
  }
  return [day, mon, year];
}

// Get the days in the requested month and account for leap year.
function daysInMonth(year, mon) {
  var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(year)) {
    months[1] = 29;
  }
  return months[(mon - 1)];
}

function isLeapYear(year) {
  if (year % 4 !== 0) {
    return false;
  } else if (year % 100 !== 0) {
    return true;
  } else if (year % 400 !== 0) {
    return false;
  } else {
    return true;
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
      }
    }

  // If user clicks on the active filter, turn off butActive class and remove .hidden from item rows.
  } else if(currState == currAct) {
    currAct.removeAttribute('class', 'butActive');
    var oldFilter = document.querySelectorAll('.hidden');
    for (var i = 0; i < oldFilter.length; i++) {
      oldFilter[i].removeAttribute('class', 'hidden');
    }

  // If user clicks on fridge while cupboard is active, remove .butActive and .hidden classes
  // corresponding to cupboard before adding them for fridge.
  } else {
    currAct.removeAttribute('class', 'butActive');
    var oldFilter = document.querySelectorAll('.hidden');
    for (var i = 0; i < oldFilter.length; i++) {
      oldFilter[i].removeAttribute('class', 'hidden');
    }
    currState.setAttribute('class', 'butActive');
    for (var i = 0; i < invObj.length; i++) {
      if (invObj[i].location !== currLoc) {
        var hideId = invObj[i].index;
        var hideRow = document.getElementById(hideId).parentNode.parentNode;
        hideRow.setAttribute('class', 'hidden');
      }
    }
  }
}

// Rebuild Inventory with no filters or active button on home click.

var homeView = document.getElementById('home');
homeView.addEventListener('click', function () {
  var remActive = document.querySelector('.butActive');
  if (remActive) {
    remActive.removeAttribute('class', '.butActive');
  }
  buildInv();
});

// Search for Recipes Using Checked Food

var recipeSearch = document.getElementById('recipe');
recipeSearch.addEventListener('click', function () {
  var foodList = document.querySelectorAll('input:checked');
  var queries = [];
  for (var i = 0; i < foodList.length; i++) {
    queries.push(foodList[i].value);
  }
  var foodStr = queries.toString();
  var foodUrl = 'http://www.recipepuppy.com/api/?i=' + foodStr;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      var recArr = this.responseText;
      alert(recArr);
  }
  xhttp.open('GET', foodUrl, true);
  xhttp.send();
});
