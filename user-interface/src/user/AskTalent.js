import axios from 'axios';
import cogoToast from 'cogo-toast';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useHistory } from 'react-router';
import "../assets/css/input-tags.css";
import rocketImg from "../assets/images/rocket.png";

function AskTalent() {
    const [depertment_id, setDepartmentId] = useState('');
    const [designation_id, setDesignationId] = useState('');
    const [required_experience, setRequiredExperience] = useState('');
    const [total_talent, setTotalTalent] = useState('');
    const [required_skill, setRequiredSkill] = useState('');
    const [certification, setCertification] = useState('');
    const [notes, setNote] = useState('');
    const [designationOptions, setdesignationOptions] = useState([]);
    const [departmentOptions, setdepartmentOptions] = useState([]);

    const [depertmentV, setdepertmentV] = useState('Select Depertment'); 
    const [degignation, setdegignation] = useState('Select Degignation');
    const [numOfTalent, setnumOfTalent] = useState('Select Number Of Talent'); 
    const [allSkillData, setSkillAllData] = useState([]);
    const [askTalentagain, setaskTalentagain] = useState(0);
    const [User_id, setUser_id] = useState(0);


    const routerHistory = useHistory();


    // input tag fields

    const getSelectedSkill = (skill_ID) => {
        if ( skill_ID && skill_ID.length > 0) {
            
            var AuthUserToken = localStorage.getItem("AuthUserToken")
            axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

            axios.post( "/getSelectedSkill" , 
            {
                required_skill 
            }
            ).then(res => {
                if (res.data.length>0) {
                    let element = []
                    for (let index = 0; index < res.data.length; index++) {
                        let temElm = []
                        temElm.id = res.data[index].id.toString()
                        temElm.text = res.data[index].text
                        element.push(temElm)
                    }
                    setTags(element)
                }
            }).catch(function (error) {
                console.log(error);
                cogoToast.error(error.response?.data?.message , { position: 'top-right' } );
            });

        } else {
            setTags([])
        }
    }


    const getAllSkill = () => {

            var AuthUserToken = localStorage.getItem("AuthUserToken")
            axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

            axios.post( "/get-all-skill").then(res => {
                let element = [];
                for (let index = 0; index < res.data.length; index++) {
                    let element_2 = [];
                    element_2.id = res.data[index].id.toString();
                    element_2.text = res.data[index].text;
                    element.push(element_2)
                }
                
                setSkillAllData(element)

            }).catch(function (error) {
                console.log(error);
                cogoToast.error(error.response?.data?.message , { position: 'top-right' } );
            });


    }

    const KeyCodes = {
    comma: 188,
    enter: 13,
    };
    
    const delimiters = [KeyCodes.comma, KeyCodes.enter];

    const [tags, setTags] = useState([]);
  
    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = [...tags].slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
    };

    const handleTagClick = (index) => {
        console.log("The tag at index " + index + " was clicked");
    };

    const onClearAll = () => {
        setTags([]);
    };

    const onTagUpdate = (i, newTag) => {
        const updatedTags = tags.slice();
        updatedTags.splice(i, 1, newTag);
        console.log("updatedTags" , updatedTags)
        setTags(updatedTags);
    };


    useEffect(() => {
        getAllSkill();
        getSelectedSkill(required_skill)
    } , [required_skill]);

    // end input tag fields

    function designationData(id) {
        axios.get("/get_designations/" + id).then(res => {

            setdegignation("Select Degignation")
            setDesignationId('')
            if (res.data.length > 0) {
                setdesignationOptions(res.data);
                if(res.data[0].expert_in != "") {
                    setRequiredSkill(JSON.parse(res.data[0].expert_in).map((expert , key) => expert));
                } else {
                    setRequiredSkill([]);
                }
            } else {
                setTags([])
                setRequiredSkill([]);
                setdesignationOptions([]);
            }
            
        }).catch(function (error) {
            cogoToast.error(error.response?.data.message , { position: 'top-right' } );
        });
    }

    function singleDesignationData(id) {
        axios
            .get("/get_designation/" + id)
            .then(res => {
                if (res.data.expert_in != "") {
                    setRequiredSkill(JSON.parse(res.data.expert_in).map((expert, key) => expert));
                } else {
                    setRequiredSkill("");
                }
            })
            .catch(function (error) {
                cogoToast.error(error.response
                    ?.data
                        ?.message, {position: 'top-right'});
            });
    }

    function designationFetchData() {
        axios
            .get("/all_designations")
            .then(res => {
                if (res.data != "") {
                    setdesignationOptions(res.data);
                }
            })
            .catch(function (error) {
                cogoToast.error(error.response
                    ?.data
                        ?.message, {position: 'top-right'});
            });
    }

    function departmentFetchData() {
        axios
            .get("all_departments")
            .then(res => {
                setdepartmentOptions(res.data);
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message, {position: 'top-right'});
            });
    }

    function statusAskingFetchData() {

        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        axios
            .post("askingStatus")
            .then(res => {
                setUser_id(res.data)
                if (res.data.length == 0) {
                    setaskTalentagain(0)
                    departmentFetchData();
                    designationFetchData();
                }else{
                    setaskTalentagain(1)
                }
                
            })
            .catch(function (error) {
                if(error.response.data.loginStatus == false){
                    routerHistory.push("login");
                    localStorage.removeItem("AuthUserToken")
                }
                cogoToast.error(error.response.data.message , { position: 'top-right' } );

            });
    }


    console.log(" askTalentagain " , askTalentagain )

    function HandleSubmit() {

        document.getElementById("department_Err").style.display = "none"
        document.getElementById("designation_Err").style.display = "none"
        document.getElementById("total_talent_Err").style.display = "none"
        document.getElementById("required_skill_Err").style.display = "none"
        document.getElementById("experence_Err").style.display = "none"

        if (depertment_id =="") {
            document.getElementById("department_Err").style.display = "block"
        }
        if (designation_id =="") {
            document.getElementById("designation_Err").style.display = "block"
        }
        if (total_talent =="") {
            document.getElementById("total_talent_Err").style.display = "block"
        }
        if (tags.length == 0 ) {
            document.getElementById("required_skill_Err").style.display = "block"
        }

        if ( required_experience == "" ) {
            document.getElementById("experence_Err").style.display = "block"
        }

        if (total_talent !== "" && depertment_id !== "" && designation_id !== "" && tags.length != 0 ) {
            let required_skill_array = [];
            for (let index = 0; index < tags.length; index++) {
                required_skill_array.push(tags[index].text )
            }
            var AuthUserToken = localStorage.getItem("AuthUserToken")
            axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;
            axios
                .post('askTalent', {
                    depertment_id: depertment_id,
                    designation_id: designation_id,
                    total_talent: total_talent,
                    required_skill: required_skill_array,
                    required_experience: required_experience,
                    certification: certification,
                    notes: notes
                })
                .then(function (response) {
                    setaskTalentagain(1)
                    // document.getElementsByClassName("askTalent").style.display = "none";
                    // document.getElementsByClassName("askTalentagain").style.display = "block";
                    cogoToast.success("Your Talent ask query saved successfully!", {position: 'top-right'});
                })
                .catch(function (error) {
                    cogoToast.error(error.response.data.message, {position: 'top-right'});
                });
        } else {
            cogoToast.error("Please fill all required field!", {position: 'top-right'});
        }
    }

    const changeAskingStatus =(user_id) =>{

        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        axios
            .post("askingStatusChange", {
                user_id : user_id.user_id
            })
            .then(res => {
                setaskTalentagain(0)
                departmentFetchData();
                designationFetchData();
            })
            .catch(function (error) {
                if(error.response.data.loginStatus == false){
                    routerHistory.push("login");
                    localStorage.removeItem("AuthUserToken")
                }
                cogoToast.error(error.response.data.message , { position: 'top-right' } );

            });

            
    }

    useEffect(() => {
        statusAskingFetchData();
        
    }, []);

    return ( 
    <> 
        {
        askTalentagain == 0 &&
        <div className="askTalent" style={{display : "block"}}>
        
            <h2 className="askTalent_title">Ask for a Talent</h2>
            <p className="askTalent_tagLine">
                Our talent pool isn't enough to meet your demand! We can still hire
                <br/>
                for you. let us know your requirement.
            </p>

            <form className="askTalentForm">
                <div className="row">
                <div className="col-md-12 form-title"></div>
                <div className="col-md-4">
                <div className="form-group">
                    <label>Department*</label>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="select_item">
                                {depertmentV}
                                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.66016 7.19531C5.90625 7.44141 6.31641 7.44141 6.5625 7.19531L11.8945 1.89062C12.1406 1.61719 12.1406 1.20703 11.8945 0.960938L11.2656 0.332031C11.0195 0.0859375 10.6094 0.0859375 10.3359 0.332031L6.125 4.54297L1.88672 0.332031C1.61328 0.0859375 1.20312 0.0859375 0.957031 0.332031L0.328125 0.960938C0.0820312 1.20703 0.0820312 1.61719 0.328125 1.89062L5.66016 7.19531Z" fill="#BBBBBB"></path>
                                </svg>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="select_item_content">

                                {
                                    departmentOptions.map((data , key)=>
                                    
                                    <Dropdown.Item href="#" > <li key={key} onClick={ (e) => {setDepartmentId(data.id); designationData(data.id); setdepertmentV(data.name); }}  style={{ cursor: "pointer" }} > { data.name }</li> </Dropdown.Item>

                                    )
                                }
                              
                            </Dropdown.Menu>
                        </Dropdown>
                        <p id="department_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
                </div>
                <div className="form-group">
                    <label>Designation*</label>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="select_item">
                                {degignation}
                                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.66016 7.19531C5.90625 7.44141 6.31641 7.44141 6.5625 7.19531L11.8945 1.89062C12.1406 1.61719 12.1406 1.20703 11.8945 0.960938L11.2656 0.332031C11.0195 0.0859375 10.6094 0.0859375 10.3359 0.332031L6.125 4.54297L1.88672 0.332031C1.61328 0.0859375 1.20312 0.0859375 0.957031 0.332031L0.328125 0.960938C0.0820312 1.20703 0.0820312 1.61719 0.328125 1.89062L5.66016 7.19531Z" fill="#BBBBBB"></path>
                                </svg>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="select_item_content">

                                {
                                    designationOptions.map((data , key)=>

                                    <Dropdown.Item href="#" >
                                        <li key={key} onClick={ (e) => {setDesignationId(data.id); singleDesignationData(data.id); setdegignation(data.name) }}  style={{ cursor: "pointer" }} > { data.name }</li>
                                    </Dropdown.Item>
                                    
                                    )
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <p id="designation_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
                </div>
                <div className="form-group">
                    <label>Required experience*</label>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="select_item">
                                {required_experience} Year
                                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.66016 7.19531C5.90625 7.44141 6.31641 7.44141 6.5625 7.19531L11.8945 1.89062C12.1406 1.61719 12.1406 1.20703 11.8945 0.960938L11.2656 0.332031C11.0195 0.0859375 10.6094 0.0859375 10.3359 0.332031L6.125 4.54297L1.88672 0.332031C1.61328 0.0859375 1.20312 0.0859375 0.957031 0.332031L0.328125 0.960938C0.0820312 1.20703 0.0820312 1.61719 0.328125 1.89062L5.66016 7.19531Z" fill="#BBBBBB"></path>
                                </svg>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="select_item_content">
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(1);}}  style={{ cursor: "pointer" }} > 1+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(2);}}  style={{ cursor: "pointer" }} > 2+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(3);}}  style={{ cursor: "pointer" }} > 3+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(4);}}  style={{ cursor: "pointer" }} > 4+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(5);}}  style={{ cursor: "pointer" }} > 5+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(6);}}  style={{ cursor: "pointer" }} > 6+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(7);}}  style={{ cursor: "pointer" }} > 7+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(8);}}  style={{ cursor: "pointer" }} > 8+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(9);}}  style={{ cursor: "pointer" }} > 9+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(10);}}  style={{ cursor: "pointer" }} > 10+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(11);}}  style={{ cursor: "pointer" }} > 11+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(12);}}  style={{ cursor: "pointer" }} > 12+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(13);}}  style={{ cursor: "pointer" }} > 13+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(14);}}  style={{ cursor: "pointer" }} > 14+ Year </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(15);}}  style={{ cursor: "pointer" }} > 15+ Year </li> </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <p id="experence_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>

                </div>
                </div>
                <div className="col-md-4">
                <div className="form-group">
                    <label>Number of talents*</label>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="select_item">
                                {numOfTalent} 
                                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.66016 7.19531C5.90625 7.44141 6.31641 7.44141 6.5625 7.19531L11.8945 1.89062C12.1406 1.61719 12.1406 1.20703 11.8945 0.960938L11.2656 0.332031C11.0195 0.0859375 10.6094 0.0859375 10.3359 0.332031L6.125 4.54297L1.88672 0.332031C1.61328 0.0859375 1.20312 0.0859375 0.957031 0.332031L0.328125 0.960938C0.0820312 1.20703 0.0820312 1.61719 0.328125 1.89062L5.66016 7.19531Z" fill="#BBBBBB"></path>
                                </svg>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="select_item_content">
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(1); setnumOfTalent(1); }}  style={{ cursor: "pointer" }} > 1 </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(2); setnumOfTalent(2);}}  style={{ cursor: "pointer" }} > 2 </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(3); setnumOfTalent(3);}}  style={{ cursor: "pointer" }} > 3 </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(4); setnumOfTalent(4);}}  style={{ cursor: "pointer" }} > 4 </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(5); setnumOfTalent(5);}}  style={{ cursor: "pointer" }} > 5 </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(6); setnumOfTalent(6);}}  style={{ cursor: "pointer" }} > 6 </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(7); setnumOfTalent(7);}}  style={{ cursor: "pointer" }} > 7 </li></Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(8); setnumOfTalent(8);}}  style={{ cursor: "pointer" }} > 8 </li></Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(9); setnumOfTalent(9);}}  style={{ cursor: "pointer" }} > 9 </li> </Dropdown.Item>
                                <Dropdown.Item href="#" > <li  onClick={ (e) => {setTotalTalent(10);setnumOfTalent(10);}}  style={{ cursor: "pointer" }} > 10 </li></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <p id="total_talent_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
                </div>
                <div className="form-group">
                    <label>Required Skills*</label>

                    {/* <ReactTags
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        delimiters={delimiters}
                        handleTagClick={handleTagClick}
                        onClearAll={onClearAll}
                        onTagUpdate={onTagUpdate}
                        suggestions={allSkillData}
                        placeholder="Search..."
                        minQueryLength={1}
                        maxLength={55}
                        autofocus={false}
                        allowDeleteFromEmptyInput={true}
                        autocomplete={true}
                        readOnly={false}
                        allowUnique={true}
                        allowDragDrop={true}
                        inline={true}
                        allowAdditionFromPaste={true}
                        editable={true}
                        clearAll={true}
                        tags={tags}
                    /> */}
                    <textarea
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    delimiters={delimiters}
                    handleTagClick={handleTagClick}
                    onClearAll={onClearAll}
                    onTagUpdate={onTagUpdate}
                    suggestions={allSkillData}
                    placeholder="Search..."
                    minQueryLength={1}
                    maxLength={55}
                    autofocus={false}
                    allowDeleteFromEmptyInput={true}
                    autocomplete={true}
                    readOnly={false}
                    allowUnique={true}
                    allowDragDrop={true}
                    inline={true}
                    allowAdditionFromPaste={true}
                    editable={true}
                    clearAll={true}
                    tags={tags}
                    className="form-control"
                    />
                    <p id="required_skill_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
                </div>
                </div>
                <div className="col-md-4">
                <div className="form-group">
                    <label>Required certification</label>
                    <input
                    type="text"
                    name="certification"
                    onChange = { (e) => setCertification(e.target.value) }
                    placeholder="Required certification"
                    className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Note</label>
                    <textarea
                    name="notes"
                    onChange = { (e) => setNote(e.target.value) }
                    className="form-control"
                    placeholder="Message"
                    defaultValue={""}
                    />
                </div>
                </div>
                <div className="col-md-12 text-right">
                <button type="button" onClick={HandleSubmit} className="btn btn-submit">
                    Submit
                </button>
                </div>
        </div> 
            </form>
            
        </div> 
        }

        {
            askTalentagain == 1 &&

            <div className = "askTalentagain"> 
                <img src={rocketImg} alt="img"/> 
                <p> Your talent requisition is successfully submitted.It may take 3 - 7 < br /> working days to find a talent for you. </p>
                <button
                name="Ask for a Talent Again"
                type="button"
                className="btn btn-talentAgain"
                onClick={ (e)=> changeAskingStatus(User_id) }
                >
                Ask for a Talent Again
                </button > 
            </div> 
        }
    
    </>
  );
}

export default AskTalent;