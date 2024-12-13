let userState = "";

function showPurchasePrompt() {
  const items = [];

  function addItem() {
    let item = prompt("What item would you like to buy: Chair, Recliner, Table, or Umbrella?");

    if (item) {
      item = item.trim().toLowerCase();

      const quantity = prompt("How many " + item + "'s would you like to buy today?");

      if (quantity) {
        const itemData = {
          name: item,
          
          quantity: parseInt(quantity),
          price: getItemPrice(item)
        };
        items.push(itemData);

        const continueShopping = confirm("Continue shopping?");
        if (continueShopping) {
          addItem();
        }
      } else {
        alert("Please enter a quantity.");
      }
    } else {
      alert("Please select an item.");
    }
  }

  addItem();

  if (items.length > 0) {
    if (!userState) {
      userState = getUserState();
    }
    displayInvoice(items);
  }
}

function getUserState() {
  const validStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA",
    "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
    "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
    "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  let state = prompt("Please enter the two letter state abbreviation.").toUpperCase();

  while (!validStates.includes(state)) {
    state = prompt("Invalid state abbreviation. Please enter the two letter state abbreviation.").toUpperCase();
  }

  return state;
}


function getItemPrice(item) {
  switch (item) {
    case "chair":
      return 25.50;
    case "recliner":
      return 37.75;
    case "table":
      return 49.95;
    case "umbrella":
      return 24.89;
    default:
      return 0;
  }
}

function displayInvoice(items) {
  const invoiceContainer = document.getElementById("invoice");
  invoiceContainer.innerHTML = "";

  const invoiceTable = document.createElement("table");
  invoiceTable.border = 1;

  const headerRow = invoiceTable.insertRow();
  const headerCells = ["Item", "Quantity", "Unit Price", "Total Price"];
  for (let i = 0; i < headerCells.length; i++) {
    const headerCell = headerRow.insertCell();
    headerCell.textContent = headerCells[i];
  }

  let itemTotal = 0;      

  for (let i = 0; i < items.length; i++) {
    const itemRow = invoiceTable.insertRow();
    const item = items[i];

    itemRow.insertCell().textContent = item.name;
    itemRow.insertCell().textContent = item.quantity;
    itemRow.insertCell().textContent = "$" + item.price.toFixed(2);
    itemRow.insertCell().textContent = "$" + (item.quantity * item.price).toFixed(2);

    itemTotal += item.quantity * item.price;
  }

  const summaryTable = document.createElement("table");
  summaryTable.border = 1;

  const shippingCost = getShippingCost(itemTotal, userState);
  const subtotal = itemTotal + shippingCost;
  const tax = calculateTax(subtotal);
  const invoiceTotal = subtotal + tax;

  const summaryRows = [
    ["Item Total", "$" + itemTotal.toFixed(2)],
    ["Shipping to " + userState + "", "$" + shippingCost.toFixed(2)],
    ["Subtotal", "$" + subtotal.toFixed(2)],
    ["Tax", "$" + tax.toFixed(2)],
    ["Invoice Total", "$" + invoiceTotal.toFixed(2)]
  ];
 
  for (let i = 0; i < summaryRows.length; i++) {
    const summaryRow = summaryTable.insertRow();
    summaryRow.insertCell().textContent = summaryRows[i][0];
    summaryRow.insertCell().textContent = summaryRows[i][1];
  }

  invoiceContainer.appendChild(invoiceTable);
  invoiceContainer.appendChild(summaryTable);
}
  
function getShippingCost(itemTotal, state) {
  const freeShippingStates = ["WY", "NE", "KS", "MO", "IA", "IL", "WI", "MN", "ND", "SD"];
  const twentyDollarShippingStates = ["WA", "OR", "ID", "MT"];
  const thirtyDollarShippingStates = ["CO", "NM", "UT", "AZ", "NV", "CA"];
  const thirtyFiveDollarShippingStates = ["TX", "OK", "AR", "LA", "MS", "AL", "TN", "KY", "IN", "OH", "MI"];
  const fiftyDollarShippingStates = ["FL", "GA", "SC", "AK", "HI"];
  const fortyFiveDollarShippingStates = ["CT", "DE", "DC", "MD", "MA", "NH", "NJ", "NY", "PA", "RI", "VT", "VA", "WV"];

  if (freeShippingStates.includes(state)) {
    return 0;
  } else if (twentyDollarShippingStates.includes(state)) {
    return 20;
  } else if (thirtyDollarShippingStates.includes(state)) {
    return 30;  
  } else if (thirtyFiveDollarShippingStates.includes(state)) {
    return 35;
  } else if (fiftyDollarShippingStates.includes(state)) {
    return 50;
  } else if (fortyFiveDollarShippingStates.includes(state)) {
    return 45;
  } else {
    if (itemTotal >= 100) {
      return 0;
    } else {
      return 10;
    }
  }
}

function calculateTax(amount) {
  return amount * 0.15;
}