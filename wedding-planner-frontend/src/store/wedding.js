import { createStore, Reducer } from "redux";

const wedPass = (wedding = { wedID: "", budget: "" }, message) => {
    if (message.type === "check") {
        if (wedding != undefined) {
            const newWedPass = { wedID: message.wedID, budget: message.budget };
            return newWedPass;
        }
        return wedding;
    }
};

const store = createStore(wedPass);

export default store;
