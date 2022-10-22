import axios from 'axios';
import cogoToast from 'cogo-toast';
import React, { useEffect, useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import Slider from "react-slick";
import { WithContext as ReactTags } from 'react-tag-input';
import "../assets/css/input-tags.css";
import UserPic from "../assets/images/user_icon.png";
import { ExpertiseNextArrow, ExpertisePrevArrow } from "../common/CustomSetting";
import { S3KEY } from '../Constant';


function AskTalentPage() {
    
    const settingsExpertise = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <ExpertiseNextArrow />,
        prevArrow: <ExpertisePrevArrow />
    };

    const settingsExpertise_infinite = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <ExpertiseNextArrow />,
        prevArrow: <ExpertisePrevArrow />
    };
    const [depertment_id, setDepartmentId] = useState('');
    const [designation_id, setDesignationId] = useState('');
    const [required_experience, setRequiredExperience] = useState('');
    const [total_talent, setTotalTalent] = useState('');
    const [required_skill, setRequiredSkill] = useState([])
    const [certification, setCertification] = useState('');
    const [notes, setNote] = useState('');
    const [designationOptions, setdesignationOptions] = useState([]);
    const [departmentOptions, setdepartmentOptions] = useState([]);
    const [allAskTalents, setallAskTalents] = useState([]);
    const [show, setShow] = useState(false); 
    const [modalData, setmodalData] = useState([]); 
    const [allSkillData, setSkillAllData] = useState([]);
    const [depertmentV, setdepertmentV] = useState('Select Depertment'); 
    const [degignation, setdegignation] = useState('Select Degignation');
    const [numOfTalent, setnumOfTalent] = useState('Select Number Of Talent');



    const [UpdepertmentV, setUpdepertmentV] = useState(''); 
    const [Updegignation, setUpdegignation] = useState('');
    const [Uprequired_experience, setUpRequiredExperience] = useState('');

    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen);

    const handleClose = () => setShow(false);

    function findAskTalentData(id) {
            axios.get("/find_ask_talent/" + id).then(res => {
            setDepartmentId(res.data.depertment_id);
            setDesignationId(res.data.designation_id);
            setRequiredExperience(res.data.required_experience);
            setTotalTalent(res.data.total_talent);
            setnumOfTalent(res.data.total_talent)
            setUpdegignation(res.data.designation_name)
            if (res.data.required_skill) {
                let skill = JSON.parse(res.data.required_skill);
                let element = []
                for (let index = 0; index < skill.length; index++) {
                    let temElm = []
                    temElm.id = index.toString()
                    temElm.text = skill[index]
                    element.push(temElm)
                }
                setTags(element)
            } 
            setRequiredSkill(JSON.parse(res.data.required_skill).map((expert , key) => expert));
            setCertification(res.data.certification);
            setNote(res.data.notes);
            setmodalData(res.data);
            setShow(true);
        }).catch(function (error) {
            cogoToast.error(error.response.data.message , { position: 'top-right' } );
        });
    }

    function designationData(id) {
        axios.get("/get_designations/" + id).then(res => {

            setdegignation("Select Degignation")
            setUpdegignation('Select Degignation')
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
        axios.get("/get_designation/" + id).then(res => {
            if(res.data.expert_in != "") {
                setRequiredSkill(JSON.parse(res.data.expert_in).map((expert , key) => expert));
            } else {
                setRequiredSkill([]);
            }
        }).catch(function (error) {
            cogoToast.error(error.response?.data?.message , { position: 'top-right' } );
        });
    }

    function designationFetchData() {
            axios.get("/all_designations").then(res => {
                if(res.data != "") {
                    setdesignationOptions(res.data);
                }
        }).catch(function (error) {
            cogoToast.error(error.response?.data?.message , { position: 'top-right' } );
        });
    }

    function departmentFetchData() {
            axios.get("/all_departments").then(res => {
            setdepartmentOptions(res.data);
        }).catch(function (error) {
            cogoToast.error(error.response.data.message , { position: 'top-right' } );
        });
    }

    function HandleSubmit() {
        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

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

        if(depertment_id !="" && designation_id !="" && total_talent !="" && tags.length != 0 && required_experience !="") {
            let required_skill_array = [];
            for (let index = 0; index < tags.length; index++) {
                required_skill_array.push(tags[index].text )
            }

            axios.post('/askTalent', {
                depertment_id: depertment_id,
                designation_id: designation_id,
                total_talent: total_talent,
                required_skill: required_skill_array,
                required_experience: required_experience,
                certification: certification,
                notes: notes
                })
                .then(function (response) {

                    setDepartmentId('');
                    setDesignationId('');
                    setRequiredExperience('');
                    setTotalTalent('');
                    setTags([])
                    setRequiredSkill([]);
                    setCertification("");
                    setNote("");
                    
                    askTalentFetchData();
                    cogoToast.success("Your Talent ask query saved successfully!" , {position: 'top-right' });
                })
                .catch(function (error) {
                    cogoToast.error(error.response.data.message , {position: 'top-right' });
            });

            } else {
                cogoToast.error("Please filled all required field!", {position: 'top-right' });
            }
        }

    function HandleUpdate(id) {
        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        document.getElementById("Updepartment_Err").style.display = "none"
        document.getElementById("Updesignation_Err").style.display = "none"
        document.getElementById("Uptotal_talent_Err").style.display = "none"
        document.getElementById("Uprequired_skill_Err").style.display = "none"
        document.getElementById("Upexperence_Err").style.display = "none"

        if (depertment_id =="") {
            document.getElementById("Updepartment_Err").style.display = "block"
        }
        if (designation_id =="") {
            document.getElementById("Updesignation_Err").style.display = "block"
        }
        if (total_talent =="") {
            document.getElementById("Uptotal_talent_Err").style.display = "block"
        }
        if (tags.length == 0 ) {
            document.getElementById("Uprequired_skill_Err").style.display = "block"
        }

        if ( required_experience == "" ) {
            document.getElementById("Upexperence_Err").style.display = "block"
        }

        if(depertment_id !="" && designation_id !="" && total_talent !="" && tags.length != 0 && required_experience !="") {
            let required_skill_array = [];
            for (let index = 0; index < tags.length; index++) {
                required_skill_array.push(tags[index].text )
            }
            axios.put('/askTalent_update/' + id, {
                depertment_id: depertment_id,
                designation_id: designation_id,
                total_talent: total_talent,
                required_skill: required_skill_array,
                required_experience: required_experience,
                certification: certification,
                notes: notes
                })
                .then(function (response) {

                    setShow(false);
                    askTalentFetchData();
                    setDepartmentId('');
                    setDesignationId('');
                    setRequiredExperience('');
                    setTotalTalent('');
                    setTags([])
                    setRequiredSkill([]);
                    setCertification("");
                    setNote("");
                    cogoToast.success("Your Talent ask query updated successfully!" , {position: 'top-right' });
                })
                .catch(function (error) {
                    cogoToast.error(error.response.data.message , {position: 'top-right' });
            });
        } else {
            cogoToast.error("Please filled all required field!", {position: 'top-right' });
        }
    }

    function HandlePauseResumeSubmit(status, id) {
        axios.put('/ask_talent_status_change', {
            id: id,
            status: status,
            })
            .then(function (response) {
                askTalentFetchData();
                cogoToast.success("Your Talent ask query status updated successfully!" , {position: 'top-right' });
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message , {position: 'top-right' });
        });
    }

    function HandleDelete(id) {
        axios.delete('/ask_talent_delete/' + id)
            .then(function (response) {
                askTalentFetchData();
                cogoToast.success("Your Talent ask query deleted successfully!" , {position: 'top-right' });
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message , {position: 'top-right' });
        });
    }

    async function askTalentFetchData() {
        axios.get( "/all_askTalent_with_join?token="+ localStorage.getItem("AuthUserToken") ).then(res => {
            // console.log(res.data);
            setallAskTalents(res.data);
        }).catch(function (error) {
            console.log(error);
            cogoToast.error(error.response?.data?.message , { position: 'top-right' } );
        });
    }







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
    SPACE: 32
    };
    
    const delimiters = [KeyCodes.comma , KeyCodes.enter , KeyCodes.SPACE];

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
        getSelectedSkill(required_skill)
    } , [required_skill]);

    // end input tag fields

    
   

    useEffect(() => {
        getAllSkill();
        departmentFetchData();
        designationFetchData();
        askTalentFetchData();
        
    } , []);

  return (
    <div class="right_content">
        <div className="askTalent">
        <h2 className="askTalent_title">Ask for a Talent</h2>
        <p className="askTalent_tagLine">
        Our talent pool isn't enough to meet your demand! We can still hire
        <br /> for you. let us know your requirement.
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
                                <Dropdown.Item href="#" >  <li key={key} onClick={ (e) => {setDesignationId(data.id); singleDesignationData(data.id); setdegignation(data.name) }}  style={{ cursor: "pointer" }} > { data.name }</li> </Dropdown.Item>
                                
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
                <label>Required Skills *</label>
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


         <div className="your-team-name ask_talent_padding">
            <div className="team_name">
                <div className="name-text">
                <h1> My Asked Talentse </h1>
                </div>
            </div>
            <div className="r_departments Ask_telens">
            <div className="r-department-part">
            <div className="row">
            {/* ========== DEPARTMENT PART ========== */}
            {
                allAskTalents.map((dataGet, key)=>

                    <div className="col-lg-6 pr_padding">
                    <div className="department-profile">
                        <div className="deprt-available">
                        {
                            dataGet.status != 4 &&
                            <span href data-toggle="modal" onClick={() => findAskTalentData(dataGet.id)}>
                            <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <rect
                                width={24}
                                height={24}
                                rx={6}
                                fill="#F48039"
                                fillOpacity="0.1"
                            />
                            <path
                                d="M6.31975 16.6877C6.2007 16.9716 6.26513 17.2993 6.48284 17.517C6.70055 17.7347 7.02824 17.7991 7.31215 17.68L10.087 16.5165L7.48325 13.9128L6.31975 16.6877Z"
                                fill="#F48039"
                            />
                            <path
                                d="M17.5169 8.35927L15.6405 6.48286C15.3444 6.18678 14.8643 6.18678 14.5682 6.48286L8.1784 12.8728C8.17677 12.8744 8.17541 12.8762 8.17383 12.8778L11.122 15.826C11.1237 15.8244 11.1254 15.823 11.127 15.8215L17.5169 9.43156C17.813 9.13544 17.813 8.65538 17.5169 8.35927Z"
                                fill="#F48039"
                            />
                            </svg>
                        </span>
                        }
                        </div>
                        <div className="profile-item">
                        <div className="profile">
                            <img src={ dataGet.emp_image ?  S3KEY + dataGet.emp_image : UserPic } alt="User Pic" />
                        </div>
                        <div className="profile-text">
                            <h3>{ dataGet.designation_name }</h3>
                            <label>x{ dataGet.total_talent }</label>
                        </div>
                        </div>
                        <div className="profile-text-dp">
                        <p>
                            Department <br />
                            <span>{ dataGet.department_name }</span>
                        </p>
                        <p>
                        Required experience <br />
                            <span>{ dataGet.required_experience !== "" ? dataGet.required_experience + "+ Years" : "Not Required" }</span>
                        </p>
                        <p>
                            Status <br />
                            <span>
                            {(() => {
                                if (dataGet.status !== "" && dataGet.status == 0) {
                                return (
                                    "Pending"
                                )
                                } else if(dataGet.status !== "" && dataGet.status == 1) {
                                    return (
                                        "Searching"
                                    )
                                } else if(dataGet.status !== "" && dataGet.status == 2) {
                                    return (
                                        "Meeting scheduled"
                                    )
                                } else if(dataGet.status !== "" && dataGet.status == 3) {
                                    return (
                                        "Hiring completed"
                                    )
                                } else if(dataGet.status !== "" && dataGet.status == 4) {
                                    return (
                                        "Cancelled"
                                    )
                                }
                            })()}
                            </span>
                        </p>
                        </div>
                        <p className="expartics">Expertise</p>

                        {(() => {
                            if ( JSON.parse(dataGet.required_skill).length > 3) {
                                return(
                                    <Slider {...settingsExpertise_infinite} dots={false}>
                                    {
                                        JSON.parse(dataGet.required_skill).map((expert , key) => 
                                        <div key={key}>
                                            <div>{ expert }</div>
                                        </div>
                                        )
                                    }
                                    </Slider>
                                )
                                
                            } else {
                                return(
                                    <Slider {...settingsExpertise} dots={false}>
                                    {
                                        JSON.parse(dataGet.required_skill).map((expert , key) => 
                                        <div key={key}>
                                            <div>{ expert }</div>
                                        </div>
                                        )
                                    }
                                    </Slider>
                                )
                            }
                            
                        })()}
                        <div className="talent-part-flex">
                        <button
                            type="button"
                            className="btn btn-pousereq"
                        >
                        {(() => {
                            if (dataGet.status !== "" && dataGet.status == 0) {
                            return (
                                "Pending"
                            )
                            } else if(dataGet.status !== "" && dataGet.status == 1) {
                                return (
                                    "Meeting scheduled"
                                )
                            } else if(dataGet.status !== "" && dataGet.status == 2) {
                                return (
                                    "Searching"
                                )
                            } else if(dataGet.status !== "" && dataGet.status == 3) {
                                return (
                                    "Hiring completed"
                                )
                            } else  {
                                return (
                                    "Cancelled"
                                )
                            }
                        })()}
                        </button>
                        {dataGet.status != 4 &&
                            <button
                            name="Cancel Requisition"
                            type="button"
                            onClick={ () => HandlePauseResumeSubmit(4, dataGet.id) }
                            className="btn btn-cancelreq"
                        >
                            Cancel Requisition
                        </button>
                        }
                        </div>
                    </div>
                    </div>

                )
            }

            {

            }
            
                    
            </div>
            </div>
            </div>
        </div>


{/* MODAL ASK FOR TALENT */}
    <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" className="myProfile_modal Talent_Modal_R">
  <div className="modal-header">
    <button
      type="button"
      className="close"
      data-dismiss="modal"
      aria-label="Close"
      onClick={handleClose}
    >
      <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.283203 1.66873C-0.0917969 1.29373 -0.0917969 0.669606 0.283203 0.281494C0.671315 -0.0935059 1.28233 -0.0935059 1.67044 0.281494L9.99474 8.61978L18.333 0.281494C18.708 -0.0935059 19.3322 -0.0935059 19.7063 0.281494C20.0944 0.669606 20.0944 1.29461 19.7063 1.66873L11.382 9.99391L19.7063 18.3322C20.0944 18.7072 20.0944 19.3313 19.7063 19.7194C19.3313 20.0944 18.7072 20.0944 18.333 19.7194L9.99474 11.3811L1.67044 19.7194C1.28233 20.0944 0.671315 20.0944 0.283203 19.7194C-0.0917969 19.3313 -0.0917969 18.7063 0.283203 18.3322L8.6075 9.99391L0.283203 1.66873Z"
          fill="black"
        />
      </svg>
    </button>
    <div className="header_btn-group">
      <button type="button" name="Save" className="btn btn-save" value={modalData.id} onClick={() => HandleUpdate(modalData.id)}>
        Update
      </button>
    </div>
  </div>
  <div className="modal-body">
    <div className="row request_talent">
      <h1>Request for Senior UI/UX Designer</h1>
      <form class="askTalentForm">
        <div className="row">
          <div className="col-md-12 ">
            <div className="form-group">
              <label>Department*</label>

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="select_item">
                        {(() => {
                            
                            if (UpdepertmentV) {
                                return <> {UpdepertmentV} </>
                            } else {
                                return(
                                    <>
                                    {
                                        modalData.department_name

                                    }
                                    </>
                                )
                            }
                        })()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu id="select_item_content">

                            {
                                departmentOptions.map((data , key)=>
                                <Dropdown.Item href="#" > <li key={key} onClick={(e) => {setDepartmentId(data.id); designationData(data.id); setUpdepertmentV(data.name); }}  style={{ cursor: "pointer" }} > { data.name }</li> </Dropdown.Item>
                                )
                            }
                        </Dropdown.Menu>
                    </Dropdown>

                <p id="Updepartment_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Designation*</label>

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="select_item">
                        {(() => {
                            
                            if (Updegignation) {
                                return <> {Updegignation} </>
                            } else {
                                return(
                                    <>
                                    {
                                        modalData.designation_name

                                    }
                                    </>
                                )
                            }
                        })()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu id="select_item_content">

                            {
                                designationOptions.map((data , key)=>
                                <Dropdown.Item href="#" >
                                    <li key={key} onClick={ (e) => {setDesignationId(data.id); setUpdegignation(data.name); }}  style={{ cursor: "pointer" }} > { data.name }</li>
                                </Dropdown.Item> 
                                
                                )
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    <p id="Updesignation_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Number of talents*</label>

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="select_item">
                            {numOfTalent} 
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
                <p id="Uptotal_talent_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Required experience*</label>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="select_item">
                        {Uprequired_experience ? Uprequired_experience : modalData.required_experience } Year
                    </Dropdown.Toggle>

                    <Dropdown.Menu id="select_item_content">

                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(1); setUpRequiredExperience(1);}}  style={{ cursor: "pointer" }} > 1+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(2); setUpRequiredExperience(2);}}  style={{ cursor: "pointer" }} > 2+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(3); setUpRequiredExperience(3);}}  style={{ cursor: "pointer" }} > 3+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(4); setUpRequiredExperience(4);}}  style={{ cursor: "pointer" }} > 4+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(5); setUpRequiredExperience(5);}}  style={{ cursor: "pointer" }} > 5+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(6); setUpRequiredExperience(6);}}  style={{ cursor: "pointer" }} > 6+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(7); setUpRequiredExperience(7);}}  style={{ cursor: "pointer" }} > 7+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(8); setUpRequiredExperience(8);}}  style={{ cursor: "pointer" }} > 8+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(9); setUpRequiredExperience(9);}}  style={{ cursor: "pointer" }} > 9+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(10); setUpRequiredExperience(10);}}  style={{ cursor: "pointer" }} > 10+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(11); setUpRequiredExperience(11);}}  style={{ cursor: "pointer" }} > 11+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(12); setUpRequiredExperience(12);}}  style={{ cursor: "pointer" }} > 12+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(13); setUpRequiredExperience(13);}}  style={{ cursor: "pointer" }} > 13+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(14); setUpRequiredExperience(14);}}  style={{ cursor: "pointer" }} > 14+ Year </li> </Dropdown.Item>
                            <Dropdown.Item href="#" > <li  onClick={ (e) => {setRequiredExperience(15); setUpRequiredExperience(15);}}  style={{ cursor: "pointer" }} > 15+ Year </li> </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <p id="Upexperence_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Required certification</label>
                <input
                type="text"
                name="certification"
                defaultValue={modalData.certification}
                onChange = { (e) => setCertification(e.target.value) }
                placeholder="Required certification"
                className="form-control"
                />
            </div>
          </div>
          <div className="col-md-6">
              {
                (modalData.required_skill !=null && modalData.required_skill !="") &&

                <div className="form-group">
                <label>Required Skills*</label>

                    <ReactTags
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        handleTagClick={handleTagClick}
                        onClearAll={onClearAll}
                        onTagUpdate={onTagUpdate}
                        suggestions={allSkillData}
                        delimiters={delimiters}
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
                    />
                </div>
                }
            <p id="Uprequired_skill_Err" style={{ color:"red" , display:"none" }}> This field can not be empty </p>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Note</label>
                <textarea
                name="notes"
                onChange = { (e) => setNote(e.target.value) }
                className="form-control custome_text_area"
                placeholder="Message"
                defaultValue={modalData.notes}
                />
            </div>
          </div>
        </div>
      </form>
        </div>
    </div>

</Modal>
    </div>
  );
}

export default AskTalentPage;