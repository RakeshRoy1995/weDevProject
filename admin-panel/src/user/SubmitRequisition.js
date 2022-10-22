import { Link, Redirect, useHistory } from "react-router-dom"
import { Form } from "reactstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";
import axios from "axios";
import cogoToast from "cogo-toast";
import { Dropdown } from 'react-bootstrap';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function Next(){
    return(
        <div className="Callender_arrow"> 
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.79297 7.21484C8.03906 6.96875 8.03906 6.55859 7.79297 6.3125L2.48828 0.980469C2.21484 0.734375 1.80469 0.734375 1.55859 0.980469L0.929688 1.60938C0.683594 1.85547 0.683594 2.26562 0.929688 2.53906L5.14063 6.75L0.929688 10.9883C0.683594 11.2617 0.683594 11.6719 0.929688 11.918L1.55859 12.5469C1.80469 12.793 2.21484 12.793 2.48828 12.5469L7.79297 7.21484Z" fill="#F48039"/>
            </svg>
        </div>
    )
}

function Prev(){
    return(
        <div className="Callender_arrow"> 
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.0625 6.5C0.78125 6.78125 0.78125 7.25 1.0625 7.53125L7.125 13.625C7.4375 13.9062 7.90625 13.9062 8.1875 13.625L8.90625 12.9062C9.1875 12.625 9.1875 12.1562 8.90625 11.8438L4.09375 7L8.90625 2.1875C9.1875 1.875 9.1875 1.40625 8.90625 1.125L8.1875 0.40625C7.90625 0.125 7.4375 0.125 7.125 0.40625L1.0625 6.5Z" fill="#BBBBBB"/>
            </svg>
        </div>
    )
}

function SubmitRequisition() {
    const routerHistory = useHistory();
    const [data, setData] = useState([]);
    const [Cvalue, setCvalue] = useState(new Date());
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAdress] = useState('');
    const [InHouseEmployees, setInhouse_employee] = useState('1-10');
    const [website, setWebsite] = useState('');
    const [phone, setPhone] = useState('');
    const [inhouseText, setinhouseText] = useState('1-10');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorDate, setErrorDate] = useState('');
    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen);  

    const selectDate =(e) =>{

        let value = String(e)
        let date_value = value.substring(0 , value.indexOf(":") - 3 )
        localStorage.setItem("start_date" , date_value )

        if(document.getElementById("selectDatePre")){
            document.getElementById("selectDatePre").style.display ="none"
        }

        if(document.getElementById("selectDateLast")){
            document.getElementById("selectDateLast").style.display ="block"
        }

        if(document.getElementById("starting_date")){
            document.getElementById("starting_date").value = date_value
        }

        if(document.getElementById("startDate")){
            document.getElementById("startDate").innerHTML = date_value
        }

    }


    function fetchData(){

        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        if( localStorage.getItem("teamName") !=null && localStorage.getItem("teamName") != "" && localStorage.getItem("TeamMemberID") !=null && localStorage.getItem("TeamMemberID") ){
            
            axios.get( "user" )
            .then(response => {
                setData(response.data)
                setName(response.data.name)
                setEmail(response.data.email)
                setAdress(response.data.address)
                setWebsite(response.data.website)
                setPhone(response.data.phone)

            }).catch(function (error) {
                if(error.response.data.loginStatus == false){
                    routerHistory.push("login");
                    localStorage.removeItem("AuthUserToken")
                }
                cogoToast.error(error.response.data.message , { position: 'top-right' } );
            });

        }else{
            cogoToast.error("Please select team name and member" , { position: 'top-right' } );
            routerHistory.push("/");
        }

    }


    const handleSubmit =(e)=>{
        var starting_date = localStorage.getItem("start_date")
        var userId = document.getElementById("userId").value
        if(name == ""){
            setErrorName("Name is required")
        }else{
            setErrorName("")
        }

        if(email == ""){
            setErrorEmail("Email is required")
        }else{
            setErrorEmail("")
        }

        if( starting_date  =="" || starting_date == null ){
            setErrorDate("Start date is required ")
        }else{
            setErrorDate("")
        }

        if(name !="" && email !="" && starting_date !="" ){

            if(localStorage.getItem("TeamMemberID").length !=0 ){
                if(localStorage.getItem("AuthUserToken") != ""){

                    var AuthUserToken = localStorage.getItem("AuthUserToken")
                    axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

                    let slaCost = localStorage.getItem("slaCost") !=null  ? localStorage.getItem("slaCost") : 0

                    axios.post('storeTeamInfo', {

                        name: name,
                        email: email,
                        address:address,
                        InHouseEmployees,
                        website:website,
                        phone,
                        teamMember : localStorage.getItem("TeamMemberID"),
                        AuthUserToken : localStorage.getItem("AuthUserToken"),
                        startDate : localStorage.getItem("start_date"),
                        team_type: localStorage.getItem("typeType"),
                        teamName: localStorage.getItem("teamName"),
                        slaCost,
                        teamCost: localStorage.getItem("teamCost"),
                        editTeamID: localStorage.getItem("editTeamID")? localStorage.getItem("editTeamID") : 0,
                        userId:userId
                        })
                        .then(function (response) {

                            cogoToast.success("Successfully Inserted" , {position: 'top-right' });
                            
                            localStorage.removeItem("typeType")
                            localStorage.removeItem("TeamMemberID")
                            localStorage.removeItem("slaCost")
                            localStorage.removeItem("teamCost")
                            localStorage.removeItem("teamName")
                            localStorage.removeItem("start_date")
                            localStorage.removeItem("editTeamID")
                            routerHistory.push("ScheduleMetting/"+starting_date);

                        })
                        .catch(function (error) {
                            cogoToast.error(error.response.data.message , {position: 'top-right' });
                    });

                }else{
                    alert("Please Login First")
                }
            }else{
                alert("You did not select any team members")
            }
        }
    }

    const clickTab =(value)=>{
        routerHistory.push(value);
    }

    const phoneNumber= (val)=>{
        setPhone(val)
    } 


    useEffect(() => {
        fetchData()
    } , []);

  return (
    
    <div className="right_content review_team_u">
        <div className="progressbarDiv">
            <form id="progress_form">
            <ul id="progressbar">
                <li className="active done" id="step1" style={{cursor:"pointer"}} onClick={ ()=>clickTab("/") }>
                Add Talents
                </li>
                <li className="active done" id="step2" style={{cursor:"pointer"}} onClick={ ()=>clickTab("/review_your_team") }>Review Team</li>
                <li className="active" id="step3">Submit Requisition</li>
                <li id="step4">Schedule a Meeting</li>
            </ul>
            <div className="progress">
                <div className="progress-bar" />
            </div>
            <br />
            <fieldset>
                <input
                type="button"
                name="next-step"
                className="next-step"
                defaultValue="Next Step"
                />
            </fieldset>
            <fieldset>
                <input
                type="button"
                name="next-step"
                className="next-step"
                defaultValue="Next Step"
                />
                <input
                type="button"
                name="previous-step"
                className="previous-step"
                defaultValue="Previous Step"
                />
            </fieldset>
            <fieldset>
                <input
                type="button"
                name="next-step"
                className="next-step"
                defaultValue="Next Step"
                />
                <input
                type="button"
                name="previous-step"
                className="previous-step"
                defaultValue="Previous Step"
                />
            </fieldset>
            <fieldset>
                <div className="finish"></div>
                <input
                type="button"
                name="previous-step"
                className="previous-step"
                defaultValue="Previous Step"
                />
            </fieldset>
            </form>
        </div>
        <div className="your-team-name">
            <div className="team_name">
            <div className="name-text">
                <h1>Submit Requisition</h1>
            </div>
            <div className="btn_manage">
                <Link onClick={handleSubmit} to="#">
                    Schedule a Meeting
                    <svg
                        width={11}
                        height={10}
                        viewBox="0 0 11 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M10.2338 4.79591L6.47795 1.04002C6.37074 0.932811 6.22785 0.873962 6.07549 0.873962C5.92296 0.873962 5.78015 0.932895 5.67294 1.04002L5.33194 1.38111C5.22481 1.48815 5.16579 1.63113 5.16579 1.78357C5.16579 1.93594 5.22481 2.08373 5.33194 2.19078L7.52302 4.38668H0.561848C0.247991 4.38668 0 4.63239 0 4.94633V5.42853C0 5.74247 0.247991 6.01296 0.561848 6.01296H7.54788L5.33202 8.22112C5.22489 8.32833 5.16588 8.46742 5.16588 8.61987C5.16588 8.77215 5.22489 8.91327 5.33202 9.02039L5.67302 9.36038C5.78023 9.46759 5.92304 9.52601 6.07557 9.52601C6.22794 9.52601 6.37083 9.46683 6.47804 9.35962L10.2338 5.60381C10.3413 5.49626 10.4004 5.35269 10.4 5.20007C10.4003 5.04695 10.3413 4.9033 10.2338 4.79591Z"
                        fill="white"
                        />
                    </svg>
                </Link>
            </div>
            </div>
            <div className="submitRequisitionInfo">
            <Form className="info_form">
                <h2>Company Information</h2>
                <div className="row">
                    <input id="starting_date" name="starting_date" type="hidden"  />
                    <input id="userId" name="user_id" type="hidden" value={data.id}  />
                    <div className="col-md-4">
                        <div className="form-group">

                        <label>Company Name *</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Company Name"
                            onChange={ (e)=> setName( e.target.value ) }
                            defaultValue={data.name}
                        />
                        <p style={{color:"red"}}> {errorName} </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            readOnly={true}
                            className="form-control"
                            placeholder="Email"
                            onChange={ (e)=> setEmail( e.target.value ) }
                            defaultValue={data.email}
                        />
                        <p style={{color:"red"}}> {errorEmail} </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            className="form-control"
                            placeholder="Address"
                            onChange={ (e)=> setAdress( e.target.value ) }
                            defaultValue={data.address}
                        />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                        <label>Company Website</label>
                        <input
                            type="text"
                            name="website"
                            className="form-control"
                            placeholder="Company Website"
                            onChange={ (e)=> setWebsite( e.target.value ) }
                            defaultValue={data.website}
                        />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                        <label>Phone</label>

                        <PhoneInput
                            international
                            placeholder="Enter phone number"
                            defaultCountry="US"
                            value={phone}
                            className="form-control"
                            onChange={(e)=> phoneNumber(e)}
                            name="phoneInput"
                            id="phoneInput"
                        />

                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group re_svg">
                        <label>Number of Inhouse Employes</label>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="select_item">
                                {inhouseText}
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="select_item_content">
                                <li onClick={ (e)=> { setInhouse_employee("1-10"); setinhouseText("1-10"); }} style={{ cursor: "pointer" }} >1-10</li>
                                <li onClick={ (e)=> { setInhouse_employee("11-50"); setinhouseText("11-50"); }} style={{ cursor: "pointer" }} >11-50</li>
                                <li onClick={ (e)=> { setInhouse_employee("51-100"); setinhouseText("51-100"); }} style={{ cursor: "pointer" }} >51-100</li>
                                <li onClick={ (e)=> { setInhouse_employee("101-500"); setinhouseText("101-500"); }} style={{ cursor: "pointer" }} >101-500</li>
                                <li onClick={ (e)=> { setInhouse_employee("500+"); setinhouseText("500+"); }} style={{ cursor: "pointer" }} >500+</li>
                            </Dropdown.Menu>
                        </Dropdown>
                        
                        </div>
                    </div>
                </div>
            </Form>
            </div>
            <div className="expectedStartingDate">
            <div className="row">



                {/* <div className="col-md-6">
                    <p style={{color:"red"}}> { errorDate } </p>
                    <h3>Expected Starting Date</h3>
                    <p>
                        Select your targeted date Vulputate massa sit arcu id. Aliquam
                        pharetra in egestas etiam massa sit arcu vulputate.
                    </p>
                    <div className="calenderDateView" id="selectDatePre">Select Date From Calendar</div>

                    <div className="calenderDateView padding" style={{display:"none"}} id="selectDateLast">
                        <label>Expected Stating Date</label>
                        <br />
                        <span className="dateView" id="startDate">  </span>
                    </div>

                </div> */}

                <div className="col-md-6">
                <p style={{color:"red"}}> { errorDate } </p>

                {
                    localStorage.getItem("start_date") ? 
                    <>
                    <h3>Expected Starting Date</h3>
                    <p>
                        Select your targeted date Vulputate massa sit arcu id. Aliquam
                        pharetra in egestas etiam massa sit arcu vulputate.
                    </p>
                    
                    <div className="calenderDateView padding" style={ localStorage.getItem("start_date") ==null || localStorage.getItem("start_date") == "" ?  { display:"none"} : { display:"block"}  } id="selectDateLast">
                        <label>Expected Stating Date</label>
                        <br />
                        <span className="dateView" id="startDate">  { localStorage.getItem("start_date")  }  </span>
                    </div> 
                    </>

                    :

                    (
                        <>

                        <h3>Expected Starting Date</h3>
                        <p>
                            Select your targeted date Vulputate massa sit arcu id. Aliquam
                            pharetra in egestas etiam massa sit arcu vulputate.
                        </p>
                        <div className="calenderDateView" id="selectDatePre">Select Date From Calendar</div>

                        <div className="calenderDateView padding" style={{display:"none"}} id="selectDateLast">
                            <label>Expected Stating Date</label>
                            <br />
                            <span className="dateView" id="startDate">  </span>
                        </div>
                        </>

                    )
                }
                </div>
                <div className="col-md-6 text-right">

                <Calendar
                    onChange={ selectDate }
                    defaultValue={Cvalue}
                    minDate={ new Date() }
                    next2Label = {<Next />} 
                    prev2Label = {<Prev />} 
                    className="customClander"
                />
                
                </div>
            </div>
            </div>
        </div>
        </div>

  );
}

export default SubmitRequisition;