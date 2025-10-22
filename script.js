const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionsList = document.getElementById("transactions");
const transactionForm = document.getElementById("transactionForm");

const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const ctx = document.getElementById("financeChart");

// ====== LOCAL STORAGE SETUP ======
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ====== INITIALIZE CHART ======
let financeChart;

function updateChart() {
  const incomeTotal = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#43a047", "#e53935"],
        borderWidth: 1,
      },
    ],
  };

  if (financeChart) {
    financeChart.destroy();
  }

  financeChart = new Chart(ctx, {
    type: "pie",
    data,
  });
}

// ====== UPDATE BALANCE SUMMARY ======
function updateSummary() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = balance;
}

// ====== RENDER TRANSACTIONS ======
function renderTransactions() {
  transactionsList.innerHTML = "";

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.classList.add(t.type);
    li.innerHTML = `
      <span>${t.text}</span>
      <span>₹${t.amount}</span>
      <button class="delete-btn" onclick="deleteTransaction(${index})">✖</button>
    `;
    transactionsList.appendChild(li);
  });
}

// ====== ADD NEW TRANSACTION ======
transactionForm.addEventListener("submit", e => {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value.trim();
  const type = typeInput.value;

  if (text === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter valid details!");
    return;
  }

  const newTransaction = { text, amount, type };
  transactions.push(newTransaction);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  textInput.value = "";
  amountInput.value = "";

  renderTransactions();
  updateSummary();
  updateChart();
});

// ====== DELETE TRANSACTION ======
function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateSummary();
  updateChart();
}

// ====== INITIALIZE APP ======
function init() {
  renderTransactions();
  updateSummary();
  updateChart();
}

init();
