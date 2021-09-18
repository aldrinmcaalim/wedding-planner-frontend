import axios from "axios";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import WeddingTable from "./wedding-table";

export default function WeddingEntry(props) {
    const urlFE = "http://localhost:3001";
    const urlBE = "http://localhost:3000";
    const [weddings, setWeddings] = useState();
    const weddingIdInput = useRef("");
    const weddingNameInput = useRef();
    const weddingDateInput = useRef();
    const weddingLocationInput = useRef();
    const weddingBudgetInput = useRef();
    const location = useLocation();
    const dispatch = useDispatch();

    const createSSN = function () {
        const ssn = Math.floor(100000 + Math.random() * 900000);
        return ssn;
    };

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
        weddingIdInput.current.value = "";
        weddingNameInput.current.value = "";
        weddingLocationInput.current.value = "";
        weddingDateInput.current.value = "";
        weddingBudgetInput.current.value = "";
    }

    async function getAllWeddings() {
        const response = await axios.get(`${urlBE}/weddings`);
        setWeddings(response.data);
    }

    async function searchByID() {
        try {
            const weddingID = weddingIdInput.current.value;
            const response = await axios.get(`${urlBE}/weddings/${weddingID}`);
            const singleArray = [response.data];

            weddingNameInput.current.value = response.data.weddingName;
            weddingLocationInput.current.value = response.data.weddingLocation;
            weddingDateInput.current.value = response.data.weddingDate;
            weddingBudgetInput.current.value = response.data.weddingBudget;

            console.log(weddingID);
            dispatch({ type: "check", wedID: weddingID, budget: weddingBudgetInput.current.value });
            setWeddings(singleArray);
        } catch (error) {
            alert(error);
        }
    }

    async function updateWedding() {
        try {
            const weddingID = weddingIdInput.current.value;
            const response = await axios.get(`${urlBE}/weddings/${weddingID}`);
            const wedding = {
                weddingID: response.data.weddingID,
                weddingDate: weddingDateInput.current.value,
                weddingLocation: weddingLocationInput.current.value,
                weddingName: weddingNameInput.current.value,
                weddingBudget: Number(weddingBudgetInput.current.value),
                ssn: response.data.ssn,
            };
            await axios.put(`${urlBE}/weddings/${weddingID}`, wedding);
            const finResponse = await axios.get(`${urlBE}/weddings/${weddingID}`);
            const singleArray = [finResponse.data];
            setWeddings(singleArray);
        } catch (error) {
            alert(error);
        }
    }

    async function addWedding() {
        const wedding = {
            weddingID: 0,
            weddingDate: weddingDateInput.current.value,
            weddingLocation: weddingLocationInput.current.value,
            weddingName: weddingNameInput.current.value,
            weddingBudget: Number(weddingBudgetInput.current.value),
            ssn: createSSN(),
        };
        const response = await axios.post(`${urlBE}/weddings`, wedding);

        const singleArray = [response.data];
        weddingIdInput.current.value = response.data.weddingID;
        setWeddings(singleArray);
    }

    async function deleteWedding() {
        try {
            const weddingID = weddingIdInput.current.value;
            await axios.delete(`${urlBE}/weddings/${weddingID}`);
            const response = await axios.get(`${urlBE}/weddings`);
            setWeddings(response.data);
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
                    <h3>Search through our Wedding Database here!</h3>
                    <input placeholder="Enter Wedding ID" ref={weddingIdInput}></input>
                    <button onClick={searchByID}>Search ID</button>
                    <button onClick={getAllWeddings}>All Weddings!</button>
                    <button onClick={deleteWedding}>Delete by ID</button>
                    <button onClick={updateWedding}>Update by ID</button>
                    <button onClick={clear}>Clear Input</button>
                    <button onClick={addWedding}>Add Wedding</button>
                    <br></br>
                    <input placeholder="Enter Wedding Name" ref={weddingNameInput}></input>
                    <input placeholder="Enter Wedding Date" ref={weddingDateInput}></input>
                    <input placeholder="Enter Wedding Location" ref={weddingLocationInput}></input>
                    <input placeholder="Enter Wedding Budget" ref={weddingBudgetInput}></input>
                </>
            )}
            {weddings === undefined ? <div></div> : <WeddingTable props={weddings}></WeddingTable>}
        </div>
    );
}
