import axios from "axios";
import cogoToast from "cogo-toast";
import { toPng } from 'html-to-image';
import { jsPDF } from "jspdf";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import Slider from "react-slick";
import resume_userPic from '../assets/images/cv_images.png';
import OffshoreImg from "../assets/images/Offshore.png";
import slaImg from "../assets/images/sla.png";
import tic from "../assets/images/tick.svg";
import UserPic from "../assets/images/user_icon.png";
import { ExpertiseNextArrow, ExpertisePrevArrow } from "../common/CustomSetting";
import { S3KEY } from '../Constant';
import AskTalent from "./AskTalent";

const Images = 'data:image/jpeg;base64,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'


const settingsExpertise = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  nextArrow: <ExpertiseNextArrow />,
  prevArrow: <ExpertisePrevArrow />
};


function ReviewYourTeam() {

  const [status, setSendStatus] =useState()
  const observer = useRef()
  const lastBookElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
        console.log(entries[0], 'entries[0].isIntersecting')
      setSendStatus(entries[0].isIntersecting);
    })
    if (node) observer.current.observe(node)
  },[])

  const routerHistory = useHistory();
  const [data, setData] = useState([]);
  const [SpacialistData, setSpacialistData] = useState([]);
  const [Modaldata, setModalData] = useState([]);
  const [EstimatedTotalCost, setEstimatedTotalCost] = useState(0);
  const [teamMemberCost, setteamMemberCost] = useState(0);
  const [SLAcost, setSLAcost] = useState(0);
  const [emp_Image, setemp_Image] = useState('');

  const [offshoreTeam, setoffshoreTeam] = useState(false);
  const [slaTeam, setslaTeam] = useState(false);

  //modal start

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  function close() {
      setShow(false);
  }

  function openModal(e , id) {
        
    setemp_Image('')
    for (let index = 0; index < data.length; index++) {
        if( data[index].id == id ){
        setModalData( data[index] )

        if (data[index].emp_image) {

            axios.post( "base64convert", {
                imageUrl: 'https://doodlelatestbuckte102925-prod.s3.ap-southeast-1.amazonaws.com/'+ data[index].emp_image ,
                })
                .then(function (response) {
                    setemp_Image(response.data)
                    setShow(true);
                })
                .catch(function (error) {
                console.log(error);
                setShow(true);
                });

            
        }else{
            setemp_Image(resume_userPic)
            setShow(true);
        }
        
        }
    }
  }

  // modal end

  const saveBtnSvg =(e)=>{

    let value = document.getElementById("givenName").value;
    if (value) {
        document.getElementById("iconAddTeam").style.visibility ="visible"
        let value = document.getElementById("givenName").value;
        localStorage.setItem("teamName" , value );
        let el =  document.getElementById("takeTeamName")
        el.innerHTML = value
        document.getElementById("saveBtnSvg").style.display = "none"

    } else {
        alert("Please Enter Team Name")
    }
  }


  const teamName = (e)=>{
    document.getElementById("saveBtnSvg").style.display = "block"
    let tName = localStorage.getItem("teamName")
    let el =  document.getElementById("takeTeamName")
    
    if(tName != null){
        el.innerHTML = "<input name='teamName' class='form-control addTeamName' id='givenName' placeholder='Enter Tean Name' value='"+tName+"' ' />"
    }else{
        el.innerHTML = "<input name='teamName' class='form-control addTeamName' id='givenName' placeholder='Enter Tean Name'  />"
    }

    // el.onchange = function() { changeTeamName(e) };
    document.getElementById("iconAddTeam").style.visibility  ="hidden"
  }

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const RemoveMember =(e, id , key) =>{

    let TeamMemberID = localStorage.getItem("TeamMemberID").split(",")
    let arr 
    arr = TeamMemberID.filter(function(item) {
        return item != id
    })

    localStorage.setItem("TeamMemberID" , arr)
    fetchData()

  }

  const teamType = async(e , type)=>{
    let totalEstimate = 0
    let slaCost = 0

    if(type == "sla"){
      slaCost = teamMemberCost * .2;
      totalEstimate = teamMemberCost * .2 + teamMemberCost
    }else{
      totalEstimate = teamMemberCost * 0 + teamMemberCost
    }
    localStorage.setItem("typeType" , type )
    localStorage.setItem("slaCost" , slaCost )

    setEstimatedTotalCost(totalEstimate)
    setSLAcost(slaCost)

    let classname = e.target.className
    document.getElementById("Offshore").className = "ui-state-inactive";
    document.getElementById("SLA").className = "ui-state-inactive";
    document.getElementById(classname).className = "ui-state-active";

    if(classname == "Offshore"){
      document.getElementById("tabs-2").style.display = "block";
      document.getElementById("tabs-3").style.display = "none";
      document.getElementById("slaIteam").style.visibility = "hidden";
    }else{
      document.getElementById("tabs-2").style.display = "none";
      document.getElementById("tabs-3").style.display = "block";
      document.getElementById("slaIteam").style.visibility = "visible";
    }
    
  }

  const teamTypeChange = async (type)=>{
    let totalEstimate = 0
    let slaCost = 0

    let teammembercost = parseFloat(localStorage.getItem("teamCost")) 

    if(type != "offshore"){
      slaCost = teammembercost * .2;
      totalEstimate = teammembercost * .2 +  teammembercost
    }else{
      totalEstimate = teammembercost * 0 + teammembercost
    }
    localStorage.setItem("typeType" , type )
    localStorage.setItem("slaCost" , slaCost )

    setEstimatedTotalCost(totalEstimate)
    setSLAcost(slaCost)

    document.getElementById("Offshore").className = "ui-state-inactive";
    document.getElementById("SLA").className = "ui-state-inactive";

    if(type == "offshore"){
      document.getElementById("tabs-2").style.display = "block";
      document.getElementById("tabs-3").style.display = "none";
      document.getElementById("Offshore").className = "ui-state-active";
      document.getElementById("slaIteam").style.visibility = "hidden";
    }else{
      document.getElementById("tabs-2").style.display = "none"; 
      document.getElementById("tabs-3").style.display = "block";
      document.getElementById("SLA").className = "ui-state-active";
      document.getElementById("slaIteam").style.visibility = "visible";
    }
    
  }



  const fetchDataSpacialist =() =>{

    var AuthUserToken = localStorage.getItem("AuthUserToken")
    axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

    axios.get('reviewSpacialTeam')
      .then(function (response) {
        document.getElementById("submitRequisitionBtn").style.display ="block"
        setSpacialistData(response.data)


        for (let index = 0; index < response.data.length; index++) {
          if (response.data[index].is_sla == 2) {
            setslaTeam(true)
          }else{
            setoffshoreTeam(true)
          }
        }

      }).catch(function (error) {
          if(error.response?.data.loginStatus == false){
              routerHistory.push("login");
              localStorage.removeItem("AuthUserToken")
          }
          cogoToast.error(error.response?.data.message , { position: 'top-right' } );
    });


  }

  function fetchData(){

    var AuthUserToken = localStorage.getItem("AuthUserToken")
    axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

    if( localStorage.getItem("teamName") !=null && localStorage.getItem("teamName") != "" && localStorage.getItem("TeamMemberID") !=null && localStorage.getItem("TeamMemberID") ){

      axios.post('reviewYourTeam', {
        teamMembers: localStorage.getItem("TeamMemberID")
        })
        .then(function (response) {
  
          if(response.data.errno !=undefined){
            localStorage.removeItem("teamName")
            routerHistory.push("/");
          }
          setData(response.data)
  
          let teamType = localStorage.getItem("typeType")
          if(teamType == null || teamType == "" ){
            localStorage.setItem("typeType" , "offshore" )
          }
  
          if(response.data.length !=0){
            let total = 0;
            let sla = 0;
  
            let TeamMemberID = localStorage.getItem("TeamMemberID")
  
            for (let index = 0; index < response.data.length; index++) {
                if( TeamMemberID.includes(response.data[index].id) ){

                    console.log("response.data[index].salary" , response.data[index].salary)
                    total += response.data[index].salary
                }
            }
            localStorage.setItem("teamCost" ,total )
            document.getElementById("takeTeamName").innerHTML = localStorage.getItem("teamName")
            setEstimatedTotalCost(total)
            setteamMemberCost(total)
  
          }
  
          teamTypeChange( localStorage.getItem("typeType") )
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

  const clickTab =(value)=>{
    routerHistory.push(value);
  }

  const downLoadPdf = (e , employee) =>{

    let fileName = employee+".pdf"
    var available = document.getElementById('myModalLabel2').innerHTML
    available = available.substring(0, available.lastIndexOf('T') + 0);
    toPng( document.getElementById('modalBody'), { cacheBust: true, })
    .then((dataUrl) => {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        const pdf = new jsPDF();
        pdf.setTextColor(104, 153, 0);
        pdf.text(available, 17, 15);
        const imgProps= pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, 'PNG', 0, 0,pdfWidth, pdfHeight);
        pdf.save(fileName); 
    })
    .catch((err) => {
        console.log(err)
    })
  }


  const reviewYourTeam = (e) =>{ 
    let TeamMemberID = localStorage.getItem("TeamMemberID")
    let teamName = localStorage.getItem("teamName")

    if(TeamMemberID == null || TeamMemberID == ""){
        alert("Please select team member")
    }else if(teamName == "" || teamName == null ){
      alert("Team name is required.")
    }
    else{
        routerHistory.push("submit_requisition");
    }
  }

  useEffect(() => {
    fetchData()
    fetchDataSpacialist()
} , []);

  return (


    <div id="r_view_ur_team">
    <div className="right_content">
      <div className="progressbarDiv">
        <form id="progress_form">
          <ul id="progressbar">
            <li className="active done" id="step1" style={{cursor:"pointer"}} onClick={ ()=>clickTab("/") } >
              Add Talents
            </li>
            <li className="active" id="step2">
              Review Team
            </li>
            <li id="step3">Submit Requisition</li>
            <li id="step4">Schedule a Meeting</li>
          </ul>
          <div className="progress Review">
            <div className="progress-bar" style={{ width: "25%" }} />
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
      <div className="manageTeam">
        <div className="your-team-name">
          <div className="Cal_cost_overlay">
            <div className="row">
              <div className="col-lg-5">
                <div className="Cal_cost_overlay_text">
                  <h3>
                    Total monthly cost <span>${ EstimatedTotalCost } </span>
                  </h3>
                  <p>Your Offshore Dedicated Team</p>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="Cal_cost_overlay_text">
                  <h3>
                    SLA Support <span>${ Number( EstimatedTotalCost - teamMemberCost ).toFixed(5)   }</span>
                  </h3>
                  <p>+10% of the cost of dedicated team</p>
                </div>
              </div>
              <div className="col-lg-2 padding">
                <div className="Cal_cost_btn">
                  <a href="#" data-toggle="modal" data-target="#cost_cal">
                    Full Details
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="teamHire">
            <div className="teamHier_top">
              <h1>{ localStorage.getItem("editTeamID")  ? "Edit Team" : "Review Team" }</h1>
              <div className="btn_manage" id="submitRequisitionBtn" style={{display:"none"}} >
                <Link onClick={reviewYourTeam} to="#" >
                  Submit Requisition
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
            <div className="tablist" style={{ float: "left", width: "100%" }}>
              <div id="tabs">
                <div className="teamTypeSelect">
                  <ul>
                    <label>Select Your Team Type</label>
                    <li onClick={(e)=> teamType(e , "offshore") } id="Offshore" className=   "ui-state-active" >
                      <a className="Offshore">
                        <img src={OffshoreImg} alt="images" className="Offshore"  /> Offshore
                        <br /> Dedicated Team
                      </a>
                    </li>
                    <li onClick={(e)=> teamType(e , "sla") } id="SLA">
                      <a className="SLA">
                        <img src={slaImg} alt="images" className="SLA" /> SLA
                        <br /> Based Team
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="teamSupporting">
                  <h2>
                    Supporting Team
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 14C5.13023 14 3.37239 13.2719 2.05023 11.9498C0.728137 10.6276 0 8.86977 0 7C0 5.13023 0.728137 3.37239 2.05023 2.05023C3.37239 0.728137 5.13023 0 7 0C8.86977 0 10.6276 0.728137 11.9498 2.05023C13.2719 3.37239 14 5.13023 14 7C14 8.86977 13.2719 10.6276 11.9498 11.9498C10.6276 13.2719 8.86977 14 7 14Z"
                        fill="black"
                      />
                      <path
                        d="M8.23047 10.1445V6.04297H5.22266V6.86328H5.76953V10.1445H5.19531V10.9648H8.75V10.1445H8.23047Z"
                        fill="white"
                      />
                      <path
                        d="M7 5.22266C7.67848 5.22266 8.23047 4.67067 8.23047 3.99219C8.23047 3.31371 7.67848 2.76172 7 2.76172C6.32152 2.76172 5.76953 3.31371 5.76953 3.99219C5.76953 4.67067 6.32152 5.22266 7 5.22266Z"
                        fill="white"
                      />
                      <path
                        d="M7 5.22266C7.67848 5.22266 8.23047 4.67067 8.23047 3.99219C8.23047 3.31371 7.67848 2.76172 7 2.76172V5.22266Z"
                        fill="white"
                      />
                      <path
                        d="M8.23047 10.1445V6.04297H7V10.9648H8.75V10.1445H8.23047Z"
                        fill="white"
                      />
                    </svg>
                  </h2>
                  <div id="tabs-3" style={{ display: "none" }}>

                    {
                      slaTeam && 

                      <div className="teamSupporting_view row" >

                      {
                        SpacialistData.map((cell, i) => {
                          if ( cell.is_sla == 2 ) {
                            return (
                              <div className="teamSupporting_view_member col-4">
                                <img src={cell.emp_image ? S3KEY+ cell.emp_image : UserPic} alt="User Pic" />
                                <h3> {cell.emp_name } </h3>
                                <p> {cell.expert_developer} </p>
                                {/* <a onClick={ ()=> responsibleFor(cell.responsible_for) } className="responsibleFor" > What he is responsible for? </a> */}
                              </div>
                            );
                          }
                        })
                      }
                      </div>

                    }
                  </div>


                  <div id="tabs-2" >
                    {
                      offshoreTeam && 
                      <div className="teamSupporting_view row" >
                      {
                        SpacialistData.map((cell, i) => {

                          if ( cell.is_sla == 1 ) {
                            return (
                              <div className="teamSupporting_view_member col-4">
                                <img src={cell.emp_image ? S3KEY+ cell.emp_image : UserPic} alt="User Pic" />
                                <h3> {cell.emp_name } </h3>
                                <p> {cell.expert_developer} </p>
                                {/* <a onClick={ ()=> responsibleFor(cell.responsible_for) } className="responsibleFor" > What he is responsible for? </a> */}
                              </div>
                            );
                          }
                        })
                      }
                      </div>
                    }
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="hireTeam_list">
            <div className="hireTeam_list_top">
              <h2>
                <spna id="takeTeamName"> Your Team Name</spna>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" src={tic} id="saveBtnSvg" onClick={saveBtnSvg} style={{ display: "none" }}>
                    <rect width="24" height="24" rx="6" fill="#F48039" fill-opacity="0.1"/>
                    <g clip-path="url(#clip0)">
                    <path d="M9.75502 17.015L5.20502 12.465C4.93166 12.1916 4.93166 11.7484 5.20502 11.475L6.19494 10.485C6.4683 10.2117 6.91154 10.2117 7.1849 10.485L10.25 13.5501L16.8151 6.98505C17.0884 6.71169 17.5317 6.71169 17.805 6.98505L18.795 7.975C19.0683 8.24835 19.0683 8.69157 18.795 8.96495L10.745 17.015C10.4716 17.2883 10.0284 17.2883 9.75502 17.015V17.015Z" fill="#F48039"/>
                    </g>
                    <defs>
                    <clipPath id="clip0">
                    <rect width="14" height="14" fill="white" transform="translate(5 5)"/>
                    </clipPath>
                    </defs>
                </svg>
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={teamName}
                  id="iconAddTeam"
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
              </h2>
              <ul>
                <li className="right available members">
                  <a href="#">
                    <svg
                      width={17}
                      height={17}
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.2083 15.1582L13.3442 12.12C14.4624 10.7908 15.075 9.11841 15.075 7.37736C15.075 3.30955 11.7655 0 7.69767 0C3.62986 0 0.320312 3.30955 0.320312 7.37736C0.320312 11.4452 3.62986 14.7547 7.69767 14.7547C9.22478 14.7547 10.68 14.2941 11.9243 13.4197L14.8213 16.4922C15.0045 16.6825 15.2508 16.7873 15.5148 16.7873C15.7646 16.7873 16.0017 16.6921 16.1816 16.5189C16.564 16.151 16.5762 15.5409 16.2083 15.1582ZM7.69767 1.92453C10.7044 1.92453 13.1505 4.3706 13.1505 7.37736C13.1505 10.3841 10.7044 12.8302 7.69767 12.8302C4.69092 12.8302 2.24484 10.3841 2.24484 7.37736C2.24484 4.3706 4.69092 1.92453 7.69767 1.92453Z"
                        fill="#BBBBBB"
                      />
                    </svg>
                    { data.length } Members
                  </a>
                </li>
              </ul>
            </div>

            {
              data.map((post , key)=>
              
              <div className="r_departments padb" key={key} id={"resume-" + key}>
              <div className="department-profile">
                <div className="deprt-available">
                  <a href="#">Available</a>
                </div>
                <div className="profile-item p_width">
                  <div className="profile">
                      <img src={ post.emp_image ?  S3KEY + post.emp_image : UserPic } alt="User Pic" />
                  </div>
                  <div className="profile-text review_team">
                    <h3> { post.emp_name } </h3>
                    <p>Expert developer,  {post.expert_developer} </p>
                    <div className="text_team">
                      <p>
                        Department: <span> { post.depertment } </span>
                      </p>
                      <p>
                        Experience: <span>{ post.experence } Years</span>
                      </p>
                    </div>
                  </div>
                </div>
                <p className="details pad">
                { post.userAbout }
                </p>
                <p className="expartics">Expertise</p>
                
                {
                    ( post.expert_in !="" && post.expert_in !=null ) && 

                    <Slider {...settingsExpertise} dots={false}>
                    {
                        JSON.parse(post.expert_in).map((expert , key) => 
                        <div key={key}>
                            <div>{ expert }</div>
                        </div>
                        )
                    }
                    </Slider>

                }

                <div className="resume-part-flex" >
                  <div className="view-resume">
                    <a onClick={ (e)=> openModal(e , post.id )} style={{cursor: "pointer"}}  id={post.id}>
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0)">
                          <path
                            d="M10.6622 13.9822L6.01593 13.9844C6.01593 13.9844 6.01578 13.9844 6.01562 13.9844C5.58426 13.9844 5.23453 13.6349 5.23438 13.2036C5.23407 12.7721 5.5838 12.422 6.01517 12.4219L10.6615 12.4197H10.6618C11.0931 12.4197 11.4429 12.7692 11.443 13.2005C11.4433 13.632 11.0938 13.9819 10.6622 13.9822ZM9.60678 15.2713L6.01517 15.2734C5.58365 15.2737 5.23407 15.6238 5.23438 16.0551C5.23468 16.4865 5.58441 16.8359 6.01562 16.8359H6.01608L9.6077 16.8338C10.0392 16.8335 10.3888 16.4835 10.3885 16.0521C10.3882 15.6207 10.0385 15.2713 9.60724 15.2713C9.60709 15.2713 9.60693 15.2713 9.60678 15.2713ZM17.7367 15.126L13.0894 19.769C13.0893 19.769 13.0893 19.769 13.0893 19.7691L13.089 19.7693C13.0881 19.7704 13.0869 19.7713 13.0858 19.7723C13.0687 19.7891 13.051 19.8053 13.0325 19.8204C13.0278 19.8244 13.0228 19.8276 13.0179 19.8314C13.0026 19.8433 12.9872 19.8552 12.971 19.866C12.9668 19.8689 12.9622 19.8712 12.9578 19.8741C12.9407 19.8851 12.9234 19.8958 12.9054 19.9054C12.9024 19.9069 12.8993 19.9083 12.8964 19.9098C12.8767 19.9199 12.8568 19.9297 12.8362 19.9382C12.8345 19.939 12.8328 19.9394 12.8311 19.94C12.8093 19.9489 12.7872 19.957 12.7644 19.964C12.7626 19.9644 12.7608 19.9648 12.7591 19.9654C12.7365 19.9719 12.7138 19.9779 12.6906 19.9825C12.6854 19.9835 12.6801 19.984 12.6747 19.9849C12.655 19.9884 12.6352 19.9918 12.6149 19.9939C12.5891 19.9965 12.5632 19.9979 12.5371 19.9979L5.23468 20C3.5112 20 2.10938 18.5982 2.10938 16.875V3.125C2.10938 1.40182 3.5112 0 5.23438 0H14.8395C16.5625 0 17.9645 1.40182 17.9645 3.125L17.9654 10.6639C17.9654 11.0954 17.6157 11.4453 17.1841 11.4453C16.7526 11.4453 16.4029 11.0956 16.4029 10.6642L16.402 3.12515C16.402 2.26349 15.701 1.5625 14.8395 1.5625H5.23438C4.37286 1.5625 3.67188 2.26349 3.67188 3.125V16.875C3.67188 17.7365 4.37286 18.4375 5.23438 18.4375L11.7557 18.4355V16.5256C11.7557 15.0179 12.9823 13.7912 14.4901 13.7912H17.1849C17.2108 13.7912 17.2368 13.7926 17.2627 13.7952C17.2739 13.7962 17.2845 13.7984 17.2955 13.7999C17.3097 13.8019 17.3239 13.8036 17.3381 13.8065C17.3514 13.8091 17.3642 13.8127 17.3773 13.8161C17.3889 13.819 17.4007 13.8214 17.4121 13.8251C17.4252 13.829 17.4379 13.8339 17.4507 13.8385C17.4619 13.8425 17.4731 13.8461 17.4841 13.8507C17.4965 13.8559 17.5084 13.8618 17.5203 13.8676C17.5314 13.8728 17.5426 13.8777 17.5533 13.8834C17.5653 13.8899 17.5768 13.8972 17.5885 13.9043C17.5986 13.9104 17.6088 13.916 17.6187 13.9227C17.6326 13.9319 17.6459 13.9423 17.6591 13.9523C17.666 13.9577 17.6733 13.9624 17.6801 13.968C17.7203 14.001 17.7573 14.0379 17.7902 14.0782C17.7953 14.0845 17.7997 14.0912 17.8047 14.0976C17.8152 14.1115 17.8259 14.1252 17.8355 14.1397C17.8415 14.1486 17.8465 14.1579 17.8522 14.167C17.86 14.1797 17.8677 14.1922 17.8749 14.2053C17.8799 14.2149 17.8842 14.2247 17.8888 14.2343C17.8952 14.2477 17.9018 14.261 17.9076 14.2747C17.9114 14.2841 17.9144 14.2935 17.9178 14.3028C17.9233 14.3175 17.9288 14.332 17.9332 14.3469C17.9359 14.3559 17.9379 14.3651 17.9402 14.3741C17.9443 14.3898 17.9486 14.4052 17.9517 14.4211C17.9535 14.4307 17.9546 14.4405 17.9561 14.4501C17.9585 14.4655 17.9613 14.4809 17.9628 14.4966C17.9642 14.5103 17.9643 14.5239 17.9649 14.5377C17.9654 14.5493 17.9666 14.5607 17.9666 14.5726C17.9666 14.584 17.9654 14.5952 17.9649 14.6065C17.9643 14.6205 17.9642 14.6347 17.9628 14.6487C17.9613 14.6648 17.9584 14.6803 17.9559 14.696C17.9544 14.7055 17.9535 14.715 17.9517 14.7243C17.9485 14.7404 17.9442 14.756 17.9401 14.7717C17.9376 14.7806 17.9358 14.7896 17.9332 14.7984C17.9286 14.8135 17.923 14.8282 17.9176 14.8428C17.9143 14.8521 17.9112 14.8615 17.9074 14.8708C17.9018 14.8845 17.8951 14.8978 17.8886 14.9112C17.8841 14.9208 17.8798 14.9306 17.8748 14.94C17.8677 14.9533 17.8598 14.9658 17.852 14.9785C17.8465 14.9876 17.8413 14.9968 17.8355 15.0058C17.8256 15.0206 17.8146 15.0346 17.8038 15.0487C17.7991 15.0548 17.795 15.0612 17.7901 15.0673C17.7731 15.0876 17.7553 15.1073 17.7367 15.126ZM13.3182 16.5256V17.3317L15.2979 15.3537H14.4901C13.8438 15.3537 13.3182 15.8795 13.3182 16.5256ZM12.4927 10.9375H7.50732C7.11594 10.9375 6.74988 10.7634 6.50284 10.4597C6.25458 10.1547 6.15829 9.75876 6.2384 9.37317C6.46011 8.30551 7.12418 7.41577 8.0127 6.87897C7.7153 6.47217 7.53906 5.97122 7.53906 5.42969C7.53906 4.07272 8.64304 2.96875 10 2.96875C11.357 2.96875 12.4609 4.07272 12.4609 5.42969C12.4609 5.97122 12.2847 6.47217 11.9872 6.87897C12.8758 7.41577 13.5397 8.30551 13.7616 9.37317C13.8417 9.75876 13.7453 10.1547 13.4972 10.4597C13.2501 10.7634 12.8841 10.9375 12.4927 10.9375ZM9.10156 5.42969C9.10156 5.92514 9.50455 6.32812 10 6.32812C10.4955 6.32812 10.8984 5.92514 10.8984 5.42969C10.8984 4.93423 10.4955 4.53125 10 4.53125C9.50455 4.53125 9.10156 4.93423 9.10156 5.42969ZM12.1416 9.375C11.8199 8.49838 10.9743 7.89062 10.0204 7.89062H9.97955C9.02573 7.89062 8.18008 8.49838 7.85843 9.375H12.1416Z"
                            fill="#F48039"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width={20} height={20} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      View Resume
                    </a>
                  </div>
                  <div className="removeTeam" onClick={ (e)=> RemoveMember(e,post.id , key) } style={{ cursor:"pointer" }} >
                    <a href>- &nbsp; Remove From Your Team</a>
                  </div>
                </div>
              </div>
            </div>
            
              )
            }


            <div className="db_add_Member">
              <p className="add_member_p">Want to add more members?</p>
              <Link to="/db_v2_member" className="add_member_a" >
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.375 5.4375H7.4375V1.5C7.4375 1.03516 7.02734 0.625 6.5625 0.625H5.6875C5.19531 0.625 4.8125 1.03516 4.8125 1.5V5.4375H0.875C0.382812 5.4375 0 5.84766 0 6.3125V7.1875C0 7.67969 0.382812 8.0625 0.875 8.0625H4.8125V12C4.8125 12.4922 5.19531 12.875 5.6875 12.875H6.5625C7.02734 12.875 7.4375 12.4922 7.4375 12V8.0625H11.375C11.8398 8.0625 12.25 7.67969 12.25 7.1875V6.3125C12.25 5.84766 11.8398 5.4375 11.375 5.4375Z"
                    fill="#F48039"
                  />
                </svg>
                Add More Member
              </Link>
            </div>
          </div>
          {/* ========== DEPARTMENT PART ========== */}
        </div>
      </div>

      <div id="r_view_ur_team">
      <div className={status== true?"cost_calculetor manage_cost newclass-add":"cost_calculetor manage_cost"}>
        <div className={status== true? "fixedSidebar sidbar-noraml":"fixedSidebar"}>
          <h4>Cost Calculator</h4>
          <div className="cost_value">

            {
              data.map((post , key) =>
              
              <div className="cost-item" key={key}>
                <h3>
                  { post.emp_name } <span>$ { post.salary  } </span>
                </h3>
                <p> { post.depertment  } </p>
              </div>

              )
            }

          </div>
          <div className="monthly_cost">
            <div className="monthly_item">
              <h4>
                Total monthly cost <span >$ { EstimatedTotalCost  }</span>
              </h4>
              <p>Your Offshore Dedicated Team</p>
            </div>
            <div className="monthly_item" id="slaIteam">
              <h4>
                SLA Support <span>$ { Number( EstimatedTotalCost - teamMemberCost ).toFixed(5) } </span>
              </h4>
              <p className="fullwith">+20% of the cost of dedicated team</p>
            </div>
          </div>
        </div>
      </div>

      <div className="abul" ref={lastBookElementRef}>
      <AskTalent />
      </div>
      </div>
      {/* <div className={status== true?"cost_calculetor manage_cost newclass-add":"cost_calculetor manage_cost"}>
        <div className={status== true? "fixedSidebar sidbar-noraml":"fixedSidebar"}>
          <h4>Cost Calculator</h4>
          <div className="cost_value">

            {
              data.map((post , key) =>
              
              <div className="cost-item" key={key}>
                <h3>
                  { post.emp_name } <span>$ { post.salary  } </span>
                </h3>
                <p> { post.depertment  } </p>
              </div>

              )
            }

          </div>
          <div className="monthly_cost">
            <div className="monthly_item">
              <h4>
                Total monthly cost <span >$ { EstimatedTotalCost  }</span>
              </h4>
              <p>Your Offshore Dedicated Team</p>
            </div>
            <div className="monthly_item" id="slaIteam">
              <h4>
                SLA Support <span>$ { Number( EstimatedTotalCost - teamMemberCost ).toFixed(5) } </span>
              </h4>
              <p className="fullwith">+20% of the cost of dedicated team</p>
            </div>
          </div>
        </div>
      </div>

      <div className="abul" ref={lastBookElementRef}>
      <AskTalent />
      </div> */}



<Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" className="myProfile_modal View_Resume_Rasel">
            <div className="modal-header">
                <div className>
                    <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={close}
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
                </div>
                <h4 className="modal-title" id="myModalLabel2">
                Available from { Modaldata.available_from  ? Modaldata.available_from.substring(0, Modaldata.available_from.lastIndexOf('T') + 0)  : "" }
                </h4>
            </div>
            <div className="modal-body" id="modalBody" >
            <div className="row user_resume">
                <div className="col-md-12 resume_info_top">
                <div className="row">
                    <div className="col-md-4">
                    <div className="resume_userPic">
                        <img src={ emp_Image ? emp_Image : Images} alt="Resume Pic" id="imageid" />
                        <div className="overlay_resume_userPic"></div>
                    </div>
                    </div>
                    <div className="col-md-8 resume_info_view">
                    <h2 className="resume_userName"> {Modaldata.emp_name ? Modaldata.emp_name : "" } </h2>
                        <h3 className="resume_userExpert">Expert developer, { Modaldata.expert_developer ? Modaldata.expert_developer : "" }
                        </h3>
                        <div className="resume_userPosition">Position: { Modaldata.position ? Modaldata.position : "" } </div>
                        <p className="resume_userAbout"> {Modaldata.userAbout ? Modaldata.userAbout : ""} </p>
                        <button type="button" className="btn btn-downloadResume" onClick={(e)=> downLoadPdf(e, Modaldata.emp_name)} >
                          <svg width={16} height={20} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.66223 13.9822L4.01593 13.9844C4.01593 13.9844 4.01578 13.9844 4.01562 13.9844C3.58426 13.9844 3.23453 13.6349 3.23438 13.2036C3.23407 12.7721 3.5838 12.422 4.01517 12.4219L8.66147 12.4197H8.66177C9.09314 12.4197 9.44287 12.7692 9.44302 13.2005C9.44333 13.632 9.09375 13.9819 8.66223 13.9822ZM7.60678 15.2713L4.01517 15.2734C3.58365 15.2737 3.23407 15.6238 3.23438 16.0551C3.23468 16.4865 3.58441 16.8359 4.01562 16.8359H4.01608L7.6077 16.8338C8.03922 16.8335 8.38879 16.4835 8.38849 16.0521C8.38818 15.6207 8.03845 15.2713 7.60724 15.2713C7.60709 15.2713 7.60693 15.2713 7.60678 15.2713ZM15.7367 15.126L11.0894 19.769C11.0893 19.769 11.0893 19.769 11.0893 19.7691L11.089 19.7693C11.0881 19.7704 11.0869 19.7713 11.0858 19.7723C11.0687 19.7891 11.051 19.8053 11.0325 19.8204C11.0278 19.8244 11.0228 19.8276 11.0179 19.8314C11.0026 19.8433 10.9872 19.8552 10.971 19.866C10.9668 19.8689 10.9622 19.8712 10.9578 19.8741C10.9407 19.8851 10.9234 19.8958 10.9054 19.9054C10.9024 19.9069 10.8993 19.9083 10.8964 19.9098C10.8767 19.9199 10.8568 19.9297 10.8362 19.9382C10.8345 19.939 10.8328 19.9394 10.8311 19.94C10.8093 19.9489 10.7872 19.957 10.7644 19.964C10.7626 19.9644 10.7608 19.9648 10.7591 19.9654C10.7365 19.9719 10.7138 19.9779 10.6906 19.9825C10.6854 19.9835 10.6801 19.984 10.6747 19.9849C10.655 19.9884 10.6352 19.9918 10.6149 19.9939C10.5891 19.9965 10.5632 19.9979 10.5371 19.9979L3.23468 20C1.5112 20 0.109375 18.5982 0.109375 16.875V3.125C0.109375 1.40182 1.5112 0 3.23438 0H12.8395C14.5625 0 15.9645 1.40182 15.9645 3.125L15.9654 10.6639C15.9654 11.0954 15.6157 11.4453 15.1841 11.4453C14.7526 11.4453 14.4029 11.0956 14.4029 10.6642L14.402 3.12515C14.402 2.26349 13.701 1.5625 12.8395 1.5625H3.23438C2.37286 1.5625 1.67188 2.26349 1.67188 3.125V16.875C1.67188 17.7365 2.37286 18.4375 3.23438 18.4375L9.75568 18.4355V16.5256C9.75568 15.0179 10.9823 13.7912 12.4901 13.7912H15.1849C15.2108 13.7912 15.2368 13.7926 15.2627 13.7952C15.2739 13.7962 15.2845 13.7984 15.2955 13.7999C15.3097 13.8019 15.3239 13.8036 15.3381 13.8065C15.3514 13.8091 15.3642 13.8127 15.3773 13.8161C15.3889 13.819 15.4007 13.8214 15.4121 13.8251C15.4252 13.829 15.4379 13.8339 15.4507 13.8385C15.4619 13.8425 15.4731 13.8461 15.4841 13.8507C15.4965 13.8559 15.5084 13.8618 15.5203 13.8676C15.5314 13.8728 15.5426 13.8777 15.5533 13.8834C15.5653 13.8899 15.5768 13.8972 15.5885 13.9043C15.5986 13.9104 15.6088 13.916 15.6187 13.9227C15.6326 13.9319 15.6459 13.9423 15.6591 13.9523C15.666 13.9577 15.6733 13.9624 15.6801 13.968C15.7203 14.001 15.7573 14.0379 15.7902 14.0782C15.7953 14.0845 15.7997 14.0912 15.8047 14.0976C15.8152 14.1115 15.8259 14.1252 15.8355 14.1397C15.8415 14.1486 15.8465 14.1579 15.8522 14.167C15.86 14.1797 15.8677 14.1922 15.8749 14.2053C15.8799 14.2149 15.8842 14.2247 15.8888 14.2343C15.8952 14.2477 15.9018 14.261 15.9076 14.2747C15.9114 14.2841 15.9144 14.2935 15.9178 14.3028C15.9233 14.3175 15.9288 14.332 15.9332 14.3469C15.9359 14.3559 15.9379 14.3651 15.9402 14.3741C15.9443 14.3898 15.9486 14.4052 15.9517 14.4211C15.9535 14.4307 15.9546 14.4405 15.9561 14.4501C15.9585 14.4655 15.9613 14.4809 15.9628 14.4966C15.9642 14.5103 15.9643 14.5239 15.9649 14.5377C15.9654 14.5493 15.9666 14.5607 15.9666 14.5726C15.9666 14.584 15.9654 14.5952 15.9649 14.6065C15.9643 14.6205 15.9642 14.6347 15.9628 14.6487C15.9613 14.6648 15.9584 14.6803 15.9559 14.696C15.9544 14.7055 15.9535 14.715 15.9517 14.7243C15.9485 14.7404 15.9442 14.756 15.9401 14.7717C15.9376 14.7806 15.9358 14.7896 15.9332 14.7984C15.9286 14.8135 15.923 14.8282 15.9176 14.8428C15.9143 14.8521 15.9112 14.8615 15.9074 14.8708C15.9018 14.8845 15.8951 14.8978 15.8886 14.9112C15.8841 14.9208 15.8798 14.9306 15.8748 14.94C15.8677 14.9533 15.8598 14.9658 15.852 14.9785C15.8465 14.9876 15.8413 14.9968 15.8355 15.0058C15.8256 15.0206 15.8146 15.0346 15.8038 15.0487C15.7991 15.0548 15.795 15.0612 15.7901 15.0673C15.7731 15.0876 15.7553 15.1073 15.7367 15.126ZM11.3182 16.5256V17.3317L13.2979 15.3537H12.4901C11.8438 15.3537 11.3182 15.8795 11.3182 16.5256ZM10.4927 10.9375H5.50732C5.11594 10.9375 4.74988 10.7634 4.50284 10.4597C4.25458 10.1547 4.15829 9.75876 4.2384 9.37317C4.46011 8.30551 5.12418 7.41577 6.0127 6.87897C5.7153 6.47217 5.53906 5.97122 5.53906 5.42969C5.53906 4.07272 6.64304 2.96875 8 2.96875C9.35696 2.96875 10.4609 4.07272 10.4609 5.42969C10.4609 5.97122 10.2847 6.47217 9.98715 6.87897C10.8758 7.41577 11.5397 8.30551 11.7616 9.37317C11.8417 9.75876 11.7453 10.1547 11.4972 10.4597C11.2501 10.7634 10.8841 10.9375 10.4927 10.9375ZM7.10156 5.42969C7.10156 5.92514 7.50455 6.32812 8 6.32812C8.49545 6.32812 8.89844 5.92514 8.89844 5.42969C8.89844 4.93423 8.49545 4.53125 8 4.53125C7.50455 4.53125 7.10156 4.93423 7.10156 5.42969ZM10.1416 9.375C9.81992 8.49838 8.97427 7.89062 8.02045 7.89062H7.97955C7.02573 7.89062 6.18008 8.49838 5.85843 9.375H10.1416Z" fill="white" />
                        </svg>
                        Download Resume</button>
                    </div>
                </div>
                </div>
                <div className="col-md-6 resume_experience">
                    <h4>Experience</h4>
                    <ul>
                        <li> {Modaldata.experence ? Modaldata.experence : ""} + years’ working experience in development</li>
                    </ul>
                </div>
                <div className="col-md-6  resume_Education">
                    <h4>Education</h4>
                    {(() => {
                          if( Modaldata.education ){
                              let workedProject = JSON.parse(Modaldata.education)
                              return(
                                  <>
                                  {
                                      workedProject.map((collection , key)=> 
                                          <li>
                                              {collection.edu}
                                          </li>
                                      )
                                  }
                                  </>
                              )
                          }
                    })()}
                </div>
                <div className="col-md-6 resume_experience">
                    <div className="col-md-6 resume_experience">
                        <h4>Professional Certification</h4>
                        <ul>
                        {(() => {
                            if( Modaldata.professional_certification ){
                                let workedProject = JSON.parse(Modaldata.professional_certification)
                                return(
                                    <>
                                    {
                                        workedProject.map((collection , key)=> 
                                            <li>
                                                {collection}
                                            </li>
                                        )
                                    }
                                    </>
                                )
                            }
                        })()}
                        </ul>
                    </div>
                </div>
                <div className="col-md-6  resume_Education">
                    <h4>Professional Training</h4>
                    <ul>

                    {(() => {
                        if( Modaldata.professional_training ){
                            let workedProject = JSON.parse(Modaldata.professional_training)
                            return(
                                <>
                                {
                                    workedProject.map((collection , key)=> 
                                        <li>
                                            {collection}
                                        </li>
                                    )
                                }
                                </>
                            )
                        }
                    })()}

                    </ul>
                </div>
                <div className="col-md-12 resume_skillset">
                            <h4>Skillset</h4>
                            <div className="row">
                            <ul className="col-md-6">
                                    {(() => {
                                        if( Modaldata.skillset ){
                                            let workedProject = JSON.parse(Modaldata.skillset)

                                            return(
                                                <>

                                                {
                                                    workedProject.map((collection , key)=>
                                                    <li>  {collection.skill}

                                                    <ul>
                                                        {
                                                            collection.skill_item.map((data , key)=>
                                                            <ol>
                                                            <span> {data.technology} </span>
                                                            {(() => {

                                                                let element = [];
                                                                for (let index = 0; index < 10; index++) {
                                                                    if (index < data.rating ) {
                                                                        element.push(
                                                                            <svg width={14} height={13} viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M13.3875 4.65344L9.39104 4.04298L7.59975 0.227481C7.46596 -0.0574352 6.9985 -0.0574352 6.86471 0.227481L5.07396 4.04298L1.07754 4.65344C0.749294 4.70381 0.618211 5.10302 0.848419 5.33865L3.75175 8.31456L3.06546 12.5217C3.01075 12.8559 3.36771 13.1067 3.66292 12.9426L7.2325 10.9698L10.8021 12.9431C11.0946 13.1056 11.4548 12.8597 11.3995 12.5222L10.7133 8.31511L13.6166 5.33919C13.8468 5.10302 13.7152 4.70381 13.3875 4.65344Z" fill="#F48039" />
                                                                            </svg>
                                                                        )
                                                                    }else{
                                                                        element.push(
                                                                            <svg width={14} height={13} viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M13.0554 4.65344L9.05901 4.04298L7.26772 0.227481C7.13393 -0.0574352 6.66647 -0.0574352 6.53268 0.227481L4.74193 4.04298L0.745513 4.65344C0.417263 4.70381 0.28618 5.10302 0.516388 5.33865L3.41972 8.31456L2.73343 12.5217C2.67872 12.8559 3.03568 13.1067 3.33089 12.9426L6.90047 10.9698L10.4701 12.9431C10.7626 13.1056 11.1228 12.8597 11.0675 12.5222L10.3812 8.31511L13.2846 5.33919C13.5148 5.10302 13.3831 4.70381 13.0554 4.65344Z" fill="#EEEEEE" />
                                                                            </svg>
                                                                        )
                                                                    }
                                                                }

                                                                return element;
                                                            })()}

                                                            </ol>
                                                            ) 
                                                        }
                                                    </ul>
                                                    
                                                    </li>
                                                    )
                                                }
                                                
                                                </>
                                            )
                                            
                                        }
                                    })()}
                            </ul>

                            <ul className="col-md-6 padding">

                                {(() => {
                                    if (Modaldata.skillset_description) {

                                        let jsonData = JSON.parse(Modaldata.skillset_description)
                                        return(
                                            <>
                                            {
                                                jsonData.map((collection , key)=>
                                                <li>{ collection.skilldes }</li>
                                                )
                                            }
                                            </>
                                        )
                                    }
                                })()}

                            </ul>
                            </div>
                        </div>

                        <div className="col-md-12 resume_speciality">
                        <h4>Speciality</h4>
                        <div className="row">
                            <ul className="col-md-6">
                            {(() => {
                                if( Modaldata.spaciality ){
                                    let workedProject = JSON.parse(Modaldata.spaciality)
                                    return(
                                        <>
                                        {
                                            workedProject.map((collection , key)=> 
                                            {
                                                if (key < ( workedProject.length / 2 ) ) {
                                                    return (
                                                        <li>
                                                            {collection}
                                                        </li>
                                                    )
                                                } 
                                            }
                                            )
                                        }
                                        </>
                                    )
                                }
                            })()}

                            </ul>
                            <ul className="col-md-6 padding">

                            {(() => {
                                if( Modaldata.spaciality ){
                                    let workedProject = JSON.parse(Modaldata.spaciality)
                                    return(
                                        <>
                                        {
                                            workedProject.map((collection , key)=> 
                                            {
                                                if (key >= ( workedProject.length / 2 ) ) {
                                                    return (
                                                        <li>
                                                            {collection}
                                                        </li>
                                                    )
                                                } 
                                            }
                                            )
                                        }
                                        </>
                                    )
                                }
                            })()}
                            </ul>
                        </div>
                        </div>
                        {/* ========== Resume_Worked_Projects STRAT ========== */}
                        {/* <div className="col-md-12">
                        <div className="resume_Worked_Projects">
                            <h3>Worked in Projects</h3>
                                <div className="row">

                                {(() => {
                                    if( Modaldata.worked_in_project ){
                                        let workedProject = JSON.parse(Modaldata.worked_in_project)
                                        return(
                                            <>
                                            {
                                                workedProject.map((collection , key)=> 
                                                
                                                <div className="col-lg-4" key={key}>
                                                    <div className="resume_Worked_item">
                                                        <div className="resume_img">
                                                        <img src={collection.Image} alt="Images" className="img-fluid w-100" />
                                                        <div className="overlay_resume_project">
                                                            <a href={collection.URL} target="_blank">
                                                            <svg width={16} height={14} viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M15.4983 6.34616L9.81038 0.268705C9.64801 0.0952232 9.43161 0 9.20087 0C8.96987 0 8.7536 0.09536 8.59123 0.268705L8.07482 0.820616C7.91258 0.993824 7.8232 1.22518 7.8232 1.47186C7.8232 1.7184 7.91258 1.95755 8.07482 2.13076L11.393 5.68398H0.850878C0.375565 5.68398 0 6.08156 0 6.58956V7.36981C0 7.8778 0.375565 8.31548 0.850878 8.31548H11.4307L8.07495 11.8885C7.91271 12.062 7.82333 12.2871 7.82333 12.5338C7.82333 12.7802 7.91271 13.0085 8.07495 13.1818L8.59136 13.732C8.75373 13.9055 8.97 14 9.201 14C9.43174 14 9.64814 13.9042 9.8105 13.7307L15.4984 7.65343C15.6611 7.4794 15.7506 7.24709 15.75 7.00014C15.7505 6.75237 15.6611 6.51992 15.4983 6.34616Z" fill="white" />
                                                            </svg>
                                                            </a>
                                                        </div>
                                                        </div>
                                                        <p> {collection.name} </p>
                                                    </div>
                                                </div>

                                                )
                                            }
                                            </>
                                        )

                                    }
                                })()}

                                </div>
                            </div>
                        </div>
                     */}
                    {/* ========== Resume_Worked_Projects end ========== */}
                </div>
            {/* modal-content */}
            </div>

        </Modal>



    </div>
    </div> 

  );
}

export default ReviewYourTeam;