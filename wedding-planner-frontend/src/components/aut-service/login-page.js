import { useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Component } from "react";

export default function LoginPage() {
    const loginEmail = useRef();
    const loginPassword = useRef();
    const [reset, setReset] = useState(false);
    const [log, setLog] = useState();
    const resetPass = useRef();
    const checkReset = useRef();

    const dispatcher = useDispatch();

    async function login() {
        try {
            const logEmail = loginEmail.current.value;
            const logPass = loginPassword.current.value;

            if (logPass === "Welcome123!") {
                alert("Password Reset required");
                setReset(true);
                return;
            }

            const loginObj = { email: logEmail, password: logPass };
            const response = await axios.patch("https://wedding-planner-cjester.ue.r.appspot.com/users/login", loginObj);
            setLog(response.data);
            dispatcher({ type: "check", fname: response.data.fname, lname: response.data.fname });
        } catch (error) {
            alert("This is not a valid log in, please try again");
        }
    }

    function confirmResetPassword() {
        setReset(true);
    }
    async function resetPassword() {
        try {
            const logEmail = loginEmail.current.value;
            const logPass = loginPassword.current.value;
            const loginObj = { email: logEmail, password: logPass };
            const response = await axios.patch("https://wedding-planner-cjester.ue.r.appspot.com/users/login", loginObj);
            if (response.data) {
                if (checkReset.current.value === resetPass.current.value) {
                    const logEmail = loginEmail.current.value;
                    const logPass = checkReset.current.value;
                    const loginObj = { email: logEmail, password: logPass };
                    await axios.put("https://wedding-planner-cjester.ue.r.appspot.com/users/login", loginObj);
                    alert("Password has been changed, please attempt to log in using new password");
                    window.location = "http://localhost:3001/home";
                } else {
                    alert("Passwords do not match try again!");
                }
            }
        } catch (error) {
            alert(error + " User information provided was incorrect");
        }
    }

    return (
        <>
            <input placeholder="Enter Email" ref={loginEmail}></input>
            <input type="password" placeholder="Enter Current Password" ref={loginPassword}></input>
            <button onClick={login}>LOGIN</button>
            <button onClick={confirmResetPassword}>Reset Password</button>
            <br></br>
            {reset ? (
                <>
                    <input type="password" placeholder="Enter New Password" ref={resetPass}></input>
                    <input type="password" placeholder="Repeat New Password" ref={checkReset}></input>
                    <button onClick={resetPassword}>Reset Password</button>
                </>
            ) : (
                <div></div>
            )}
            {log === undefined ? (
                <div></div>
            ) : (
                <div>
                    <p>Where would you like to go</p>
                    <Link to={{ pathname: "/wedding", state: { log } }}>
                        <button>Wedding Planner</button>
                    </Link>
                    <Link to={{ pathname: "/chat", state: { log } }}>
                        <button>Chat Log</button>
                    </Link>
                </div>
            )}
        </>
    );
}
