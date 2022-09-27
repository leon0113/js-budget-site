let initial = {
    balance: 0,
    expenses: 0,
};

//                              Error check 
//                      Checking validity of input element
document.getElementById("income").focus();
document
    .querySelector(".income-saving-container")
    .addEventListener("blur", validateInput, true);


//                          Calculate  clicked
document
    .getElementById("calculate-income")
    .addEventListener("click", function (e) {
        //                     Calculate Expenses
        const expense = calculateExpenses(
            getValue("food"),
            getValue("rent"),
            getValue("clothes")
        );

        //                   saving amount
        if (isAmountAvailable(e, Number(getValue("income")), expense)) {
            //                 set total expenses
            initial.expenses = expense;
            setValue("total-expenses", formatToReadableDigit(expense), "innerText");

            //                      Balance Update
            const balance = calculateBalance(getValue("income"), expense);
            initial.balance = balance;
            setValue("balance", formatToReadableDigit(initial.balance), "innerText");
        }
    });

//                       Clicking  Saving Button 
document
    .getElementById("calculate-saving")
    .addEventListener("click", function (e) {
        // get saving percentage
        const income = getValue("income");
        const percent = parseInt(Number(getValue("saving-percent"))) / 100;
        const savingAmount = Number(income) * percent;

        //                         check amount to save
        if (isAmountAvailable(e, Number(initial.balance), savingAmount)) {
            //                    set saving amount
            setValue(
                "saving-amount",
                formatToReadableDigit(savingAmount),
                "innerText"
            );

            //               update balance
            const remainingBalance = calculateBalance(
                Number(initial.balance),
                savingAmount
            );


            setValue(
                "remaining-balance",
                formatToReadableDigit(remainingBalance),
                "innerText"
            );
        }
    });
//                            Calculate Expenses
function calculateExpenses() {
    let total = 0;

    for (let item of arguments) {
        total += Number(item);
    }

    return total;
}

//                             Calculate Balance
function calculateBalance(income, expense) {
    const remaining = Number(income) - Number(expense);

    return remaining;
}

//                      isAmountAvailable 
function isAmountAvailable(e, principal, cost) {
    let errorNode = document.querySelector("#" + e.target.id + " ~ .error-text");

    if (principal >= cost) {
        errorNode.innerText = "";
        return true;
    } else {
        errorNode.innerText = `${e.target.id === "calculate-income" ? "Income" : "Balance"
            }, ${formatToReadableDigit(principal)} is low to ${e.target.id === "calculate-income" ? "Expense" : "Saving"
            }, ${formatToReadableDigit(cost)}`;
    }

    return false;
}

//                            Validate Input
function validateInput(e) {
    e.stopImmediatePropagation();

    if (e.target.className.includes("form-control")) {
        const { value } = e.target;

        switch (true) {
            case !Boolean(value):
                createNode(e).innerHTML = "Can't left empty!!!";
                break;

            case isNaN(value):
                createNode(e).innerHTML = "No letter is allowed!";
                break;

            case Number(value) < 0:
                createNode(e).innerHTML = "Please input only positive Number!";
                break;

            default:
                if (e.target.parentNode.childElementCount > 1) {
                    document.querySelector("#" + e.target.id + " + small").remove();
                }
                e.target.style.border = "2px solid blue";
        }
    }
}

//                              Creating error msg node
function createNode(e) {
    e.target.focus();
    e.target.style.border = "2px solid red";

    if (e.target.parentElement.childElementCount < 2) {
        let errorNode = document.createElement("small");
        errorNode.setAttribute("class", "text-danger error-msg");
        e.target.parentNode.appendChild(errorNode);

        return errorNode;
    } else {
        return document.querySelector("#" + e.target.id + " + small");
    }
}


//                   get value of dom
function getValue(id, action = "value") {
    return document.getElementById(id)[action];
}

//                     set value of dom
function setValue(id, value = "", action = "value") {
    document.getElementById(id)[action] = value;
}

//              Number formatting to readable digit
function formatToReadableDigit(number, currency = "BDT") {
    const formattedNumber = number.toLocaleString(undefined, {
        style: "currency",
        currency: currency,
    });

    return formattedNumber;
}
