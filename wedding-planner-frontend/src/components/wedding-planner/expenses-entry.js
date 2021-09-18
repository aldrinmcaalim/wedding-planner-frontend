import ExpenseTable from "./expenses-table";
import { useRef, useState } from "react";
import { useLocation } from "react-router";
import ImageUpload from "./imageUpload";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ExpenseEntry() {
    const urlFE = "http://localhost:3001";
    const urlBE = "http://localhost:3000";
    const location = useLocation();

    const [expenses, setExpenses] = useState();
    const [sumExpenses, setSumExpenses] = useState();
    const [budget, setBudget] = useState();

    const expenseIdInput = useRef();
    const expenseReasonInput = useRef();
    const expenseAmountInput = useRef();
    const weddingIdInput = useRef();

    let login = undefined;
    if (location.state !== undefined) {
        login = location.state.log;
    } else {
        login = undefined;
        if (!alert("Return to home page to login in order to access this information")) {
            window.location = `${urlFE}/home`;
        }
    }

    function clear() {
        expenseIdInput.current.value = "";
        expenseReasonInput.current.value = "";
        expenseAmountInput.current.value = "";
        weddingIdInput.current.value = "";
    }

    async function getAllExpenses() {
        const response = await axios.get(`${urlBE}/expenses`);
        setExpenses(response.data);
        setSumExpenses();
    }

    async function getAllExpensesByWeddingID() {
        try {
            const id = Number(weddingIdInput.current.value);
            console.log(`${urlBE}/weddings/${id}/expenses`);
            const response = await axios.get(`${urlBE}/weddings/${id}/expenses`);
            setExpenses(response.data);
            const expSum = response.data.map((i) => i.expenseAmount).reduce((a, b) => a + b);
            setSumExpenses(expSum);

            const response2 = await axios(`${urlBE}/weddings/${id}`);
            const budgetGET = Number(response2.data.weddingBudget);
            if (expSum > budgetGET) {
                alert("You are over budget check printout underneath expenses table!");
            }
            setBudget(budgetGET);
        } catch (error) {
            alert(error + " The wedding queried either does not exist or have any expenses yet.");
        }
    }

    async function searchByID() {
        try {
            const expenseID = expenseIdInput.current.value;
            const response = await axios.get(`${urlBE}/expenses/${expenseID}`);
            const singleArray = [response.data];

            expenseReasonInput.current.value = response.data.expenseReason;
            expenseAmountInput.current.value = Number(response.data.expenseAmount);
            weddingIdInput.current.value = response.data.weddingID;

            setExpenses(singleArray);
            setSumExpenses();
        } catch (error) {
            alert(error);
        }
    }

    async function updateExpense() {
        try {
            const expenseID = expenseIdInput.current.value;
            const response = await axios.get(`${urlBE}/expenses/${expenseID}`);
            const expense = {
                expenseID: response.data.expenseID,
                expenseReason: expenseReasonInput.current.value,
                expenseAmount: Number(expenseAmountInput.current.value),
                weddingID: weddingIdInput.current.value,
            };
            await axios.put(`${urlBE}/expenses/${expenseID}`, expense);
            const finResponse = await axios.get(`${urlBE}/expenses/${expenseID}`);
            const singleArray = [finResponse.data];
            setExpenses(singleArray);
            setSumExpenses();
        } catch (error) {
            alert(error);
        }
    }

    async function addExpense() {
        const wedding = {
            expenseID: 0,
            expenseReason: expenseReasonInput.current.value,
            expenseAmount: Number(expenseAmountInput.current.value),
            weddingID: weddingIdInput.current.value,
        };
        const response = await axios.post(`${urlBE}/expenses`, wedding);

        const singleArray = [response.data];
        expenseIdInput.current.value = response.data.expenseID;
        setExpenses(singleArray);
        setSumExpenses();
    }

    async function deleteExpense() {
        try {
            const expenseID = expenseIdInput.current.value;
            await axios.delete(`${urlBE}/expenses/${expenseID}`);
            const response = await axios.get(`${urlBE}/weddings/${weddingIdInput.current.value}/expenses`);
            setExpenses(response.data);
            setSumExpenses();
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            {login === undefined ? (
                <div></div>
            ) : (
                <>
                    <h3>Search through our Expenses Database here!</h3>
                    <ImageUpload></ImageUpload>
                    <input placeholder="Enter Expenses ID" ref={expenseIdInput}></input>
                    <button onClick={searchByID}>Search ID</button>
                    <button onClick={getAllExpenses}>All Expenses!</button>
                    <button onClick={deleteExpense}>Delete by ID</button>
                    <button onClick={updateExpense}>Update by ID</button>
                    <button onClick={clear}>Clear Input</button>
                    <br></br>
                    <input placeholder="Enter Expense  Reason" ref={expenseReasonInput}></input>
                    <input placeholder="Enter Expense  Amount" ref={expenseAmountInput}></input>
                    <input placeholder="Enter Wedding ID" ref={weddingIdInput}></input>
                    <button onClick={getAllExpensesByWeddingID}>Expenses By Wedding</button>
                    <button onClick={addExpense}>Add Expense</button>
                </>
            )}
            {expenses === undefined ? <div></div> : <ExpenseTable props={expenses}></ExpenseTable>}
            {sumExpenses === undefined ? (
                <div></div>
            ) : (
                <h1>
                    Currently the wedding budget is ${budget} and your expenses total ${sumExpenses}. The current remaining funds are $
                    {budget - sumExpenses}{" "}
                </h1>
            )}
        </div>
    );
}
