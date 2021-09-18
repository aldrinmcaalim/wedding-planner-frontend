import axios from "axios";
import { useState } from "react";
import ImageShow from "./imageShow";
const { encode, decode } = require("base64-arraybuffer");

export default function ImageUpload() {
    let filereader;
    const bucketURL = "https://us-east1-wedding-planner-cjester.cloudfunctions.net/file-upload";
    const [name, setName] = useState();
    const [extension, setExtension] = useState();
    const [b64, setB64] = useState();
    const [linkage, setLink] = useState();

    function fileRead() {
        const content = filereader.result;
        const base = encode(content);
        console.log(base);
        setB64(base);
    }
    async function uploadFile() {
        const upFile = {
            name: name,
            extension: extension,
            content: b64,
        };
        console.log(upFile);
        const response = await axios.post(`${bucketURL}`, upFile);
        console.log(response.data.photoLink);
        setLink(response.data.photoLink);
    }
    function chooseFile(file) {
        if (file.size <= 10_000_000) {
            const [fname, fext] = file.name.split(".");
            setName(fname);
            setExtension(fext);
            console.log(file);
            filereader = new FileReader();
            filereader.onloadend = fileRead;
            filereader.readAsArrayBuffer(file);
        } else {
            const size = Math.round(file.size / 1_000_000);
            alert(`Your file is too large! The max image is 10MB, this image is ${size} MB`);
        }
    }

    return (
        <div>
            <input type="file" id="file" accept=".png, .jpeg, .jpg" onChange={(e) => chooseFile(e.target.files[0])}></input>
            <button onClick={uploadFile}>Upload</button>
            <br></br>
            {linkage === undefined ? <div></div> : <ImageShow props={linkage}></ImageShow>}
        </div>
    );
}
