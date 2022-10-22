import axios from "axios";
import cogoToast from "cogo-toast";
import { useEffect, useState } from "react";
import { Dropdown, Modal } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import Slider from "react-slick";
import { default as resume_userPic, default as sprtImg } from '../assets/images/cv_images.png';
import offshore from "../assets/images/Offshore.png";
import srcImg from "../assets/images/search.png";
import team_listingImg from "../assets/images/team_listing.png";
import { TeamNextArrow, TeamPrevArrow } from "../common/CustomSetting";

const Images = 'data:image/jpeg;base64,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'

const settingsExpertise = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <TeamNextArrow />,
    prevArrow: <TeamPrevArrow />
  };


function TeamListing() {
    const [data, setData] = useState([]);
    const routerHistory = useHistory();
    const [Modaldata, setModalData] = useState([]); 
    const [filterdata, setFilterData] = useState([]);
    const [filterStatus, setFilterStatus] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [dropdownName, setdropdownName] = useState("Status");
    const [emp_Image, setemp_Image] = useState('');

   



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



    function fetchData(){
        
        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        axios.post( "team_listing" ,
        {
            AuthUserToken : localStorage.getItem("AuthUserToken")
        })
        .then(res => {
            setData(res.data)

        }).catch(function (error) {
            if(error.response.data.loginStatus == false){
                routerHistory.push("login");
                localStorage.removeItem("AuthUserToken")
            }
            cogoToast.error(error.response.data.message , { position: 'top-right' } );
        });
    }

    const viewDetails = async(id) =>{
        console.log(id)
        setShow(true)
    }

    function status(val, name) { 
        setdropdownName(name)
        if (val !== "") {
            const result = data.filter(word => word.status == val );
            setFilterData(result)
            setFilterStatus(true)
        } else{
            setFilterStatus(false)
        }
        setRefresh(!refresh)
    }

    function serach(e) {
        let val = e.target.value.toLowerCase()
        if (val) {
            const result = data.filter(word => (word.name.toLowerCase().includes(val) || word.starting_date.toLowerCase().includes(val) || word.total_team_member.toString().includes(val)   ) );
            
            setFilterData(result)
            setFilterStatus(true)
        } else{
            setFilterStatus(false)
        }
        setRefresh(!refresh)

    }

    useEffect(() => {
        fetchData()
    } , []);
  return (
    
    <div className="right_content">
        {/* ==================== ASK TALENT ============================ */}
        <div className="askTalent team_padding">
            <h2 className="askTalent_title">Manage Your Team</h2>
            <div className="team_listing_header">
            <p className="askTalent_tagLine">
                Our talent pool isn't enough to meet your demand! We can still hire
                <br /> for you. let us know your requirement.
            </p>
            </div>


            <div className="r_departments team_listing">
                <div className="col-lg-12">
                    <div className="r-department-part">
                    <div className="depart-ul">

                        <div className="depart-ul_flex">
                        

                            <ul className="Sort_by_flex">
                                <li>
                                    <span href="#">Filter by</span>
                                </li>


                                    <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                     {dropdownName} 
                                    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.66016 7.19531C5.90625 7.44141 6.31641 7.44141 6.5625 7.19531L11.8945 1.89062C12.1406 1.61719 12.1406 1.20703 11.8945 0.960938L11.2656 0.332031C11.0195 0.0859375 10.6094 0.0859375 10.3359 0.332031L6.125 4.54297L1.88672 0.332031C1.61328 0.0859375 1.20312 0.0859375 0.957031 0.332031L0.328125 0.960938C0.0820312 1.20703 0.0820312 1.61719 0.328125 1.89062L5.66016 7.19531Z" fill="#BBBBBB"></path>
                                    </svg>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                         <Dropdown.Item onClick={ ()=> status("", "all")}  style={{ cursor:"pointer" }}> All Status </Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(0 ,"In Review ")}  style={{ cursor:"pointer" }}> In Review </Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(1, "Contract Signup")}  style={{ cursor:"pointer" }}> Contract Signup </Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(3 , "On-boarded")}  style={{ cursor:"pointer" }}> On-boarded </Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(2 , "Canceled" )}  style={{ cursor:"pointer" }}> Canceled </Dropdown.Item>
                                        
                                    </Dropdown.Menu>
                                    </Dropdown>
                                    <div className="team_serch">
                                        <input
                                            type="text"
                                            className="form-control membarSearch"
                                            placeholder="Search..."
                                            id="search_box"
                                            onChange={serach}
                                        />
                                        <img  src={srcImg}  alt="" />
                                    </div>
                            </ul>

                        </div>

                        
                    </div>
                    </div>
                </div>
            </div>
            {/* =================== TEAM LISTING START ===================  */}
            {/* part-1 */}



            {(() => {
                if (filterStatus) {
                      return (
                          <>

                            {
                                filterdata.map((collection , key)=>
                                


                                <div className= {key == 0 ? "Team_Listing padding" : "Team_Listing " } >
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="t_listing_r">
                                                <div className="logo">
                                                <img src={team_listingImg} alt="images" />
                                                </div>
                                                <div className="listing_text">
                                                <h4> { collection.name } </h4>
                                                <p>  { collection.team_type == 2 ? "Dedicated SLA Team" : "Dedicated Offshore Team" } </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="t_listing_l">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <div className="l_text">
                                                        <h3>Number of members</h3>
                                                        <p> {collection.total_team_member} Member</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="l_text">
                                                        <h3>Estimated Cost</h3>
                                                        <p>${collection.estimated_monthly_cost}/month</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="l_text">
                                                        <h3>Status</h3>
                                                        <p> { collection.status == 0 ? "In Review" : <> { collection.status == 1 ? "Contract Signup" : <> { collection.status == 2 ? "Canceled" : <> { collection.status == 3 ? "On-boarded" : "" } </> } </>  } </> } </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 d-flex pl-0">
                                                        <div className="l_text logos">
                                                            <Link to={ "/db_manage_team/"+ collection.id + "?status=" + collection.status }  className="l-logo bg-white">
                                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M0.0767462 13.626C-0.0788313 13.997 0.00537403 14.4252 0.289876 14.7097C0.574377 14.9942 1.00261 15.0784 1.37364 14.9228L4.99985 13.4023L1.59723 9.99976L0.0767462 13.626Z" fill="#F48039"/>
                                                                    <path d="M14.7094 2.74223L12.2572 0.290106C11.8703 -0.096814 11.243 -0.096814 10.856 0.290106L2.50567 8.6406C2.50354 8.64267 2.50177 8.64499 2.49969 8.64712L6.35246 12.4999C6.35458 12.4978 6.3569 12.496 6.35897 12.494L14.7094 4.14351C15.0963 3.75654 15.0963 3.1292 14.7094 2.74223Z" fill="#F48039"/>
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                        <div className="l_text logos">
                                                            <Link to="#" className="l-logo" onClick={()=> {viewDetails(collection.id);} } >
                                                                <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M14.7699 4.86161C12.9948 2.71658 10.3078 0.651802 7.50003 0.651802C4.69166 0.651802 2.00403 2.71803 0.230134 4.86161C-0.0767113 5.23225 -0.0767113 5.77031 0.230134 6.14095C0.676113 6.67988 1.61108 7.72021 2.85982 8.6292C6.00474 10.9186 8.98839 10.9237 12.1402 8.6292C13.389 7.72021 14.3239 6.67988 14.7699 6.14095C15.0759 5.77104 15.0775 5.23346 14.7699 4.86161ZM7.50003 2.2683C9.28279 2.2683 10.733 3.71852 10.733 5.50128C10.733 7.28404 9.28279 8.73427 7.50003 8.73427C5.71727 8.73427 4.26704 7.28404 4.26704 5.50128C4.26704 3.71852 5.71727 2.2683 7.50003 2.2683Z" fill="white"/>
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}
                          
                          </>
                      )
                }else{
                    return (
                        <>
                        
                        {
                            data.map((collection , key)=>
                            


                            <div className= {key == 0 ? "Team_Listing padding" : "Team_Listing " } >
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="t_listing_r">
                                            <div className="logo">
                                            <img src={team_listingImg} alt="images" />
                                            </div>
                                            <div className="listing_text">
                                            <h4> { collection.name } </h4>
                                            <p>  { collection.team_type == 2 ? "Dedicated SLA Team" : "Dedicated Offshore Team" } </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="t_listing_l">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <div className="l_text">
                                                    <h3>Number of members</h3>
                                                    <p> {collection.total_team_member} Member</p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="l_text">
                                                    <h3>Estimated Cost</h3>
                                                    <p>${collection.estimated_monthly_cost}/month</p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="l_text">
                                                    <h3>Status</h3>
                                                    <p> { collection.status == 0 ? "In Review" : <> { collection.status == 1 ? "Contract Signup" : <> { collection.status == 2 ? "Canceled" : <> { collection.status == 3 ? "On-boarded" : "" } </> } </>  } </> } </p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2 d-flex pl-0">
                                                    <div className="l_text logos">
                                                        <Link to={ "/db_manage_team/"+ collection.id + "?status=" + collection.status }  className="l-logo bg-white">
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M0.0767462 13.626C-0.0788313 13.997 0.00537403 14.4252 0.289876 14.7097C0.574377 14.9942 1.00261 15.0784 1.37364 14.9228L4.99985 13.4023L1.59723 9.99976L0.0767462 13.626Z" fill="#F48039"/>
                                                                <path d="M14.7094 2.74223L12.2572 0.290106C11.8703 -0.096814 11.243 -0.096814 10.856 0.290106L2.50567 8.6406C2.50354 8.64267 2.50177 8.64499 2.49969 8.64712L6.35246 12.4999C6.35458 12.4978 6.3569 12.496 6.35897 12.494L14.7094 4.14351C15.0963 3.75654 15.0963 3.1292 14.7094 2.74223Z" fill="#F48039"/>
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                    <div className="l_text logos">
                                                        <Link to="#" className="l-logo" onClick={()=> {viewDetails(collection.id);} } >
                                                            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M14.7699 4.86161C12.9948 2.71658 10.3078 0.651802 7.50003 0.651802C4.69166 0.651802 2.00403 2.71803 0.230134 4.86161C-0.0767113 5.23225 -0.0767113 5.77031 0.230134 6.14095C0.676113 6.67988 1.61108 7.72021 2.85982 8.6292C6.00474 10.9186 8.98839 10.9237 12.1402 8.6292C13.389 7.72021 14.3239 6.67988 14.7699 6.14095C15.0759 5.77104 15.0775 5.23346 14.7699 4.86161ZM7.50003 2.2683C9.28279 2.2683 10.733 3.71852 10.733 5.50128C10.733 7.28404 9.28279 8.73427 7.50003 8.73427C5.71727 8.73427 4.26704 7.28404 4.26704 5.50128C4.26704 3.71852 5.71727 2.2683 7.50003 2.2683Z" fill="white"/>
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )}
                        
                        </>
                    )
                }
            })()}

            

            
            {/* Create New Team */}
            <div className="Team_L_creat_team">
            <Link to="/">
                <svg
                width={62}
                height={62}
                viewBox="0 0 62 62"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <circle cx={31} cy={31} r={31} fill="#F48039" />
                <path
                    d="M37.8571 29.2857H32.7143V24.1429C32.7143 23.5357 32.1786 23 31.5714 23H30.4286C29.7857 23 29.2857 23.5357 29.2857 24.1429V29.2857H24.1429C23.5 29.2857 23 29.8214 23 30.4286V31.5714C23 32.2143 23.5 32.7143 24.1429 32.7143H29.2857V37.8571C29.2857 38.5 29.7857 39 30.4286 39H31.5714C32.1786 39 32.7143 38.5 32.7143 37.8571V32.7143H37.8571C38.4643 32.7143 39 32.2143 39 31.5714V30.4286C39 29.8214 38.4643 29.2857 37.8571 29.2857Z"
                    fill="white"
                />
                </svg>
                Create New Team
            </Link>
            </div>
            {/* =================== TEAM LISTING END ===================  */}

            <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" className="myProfile_modal manage_team_modal">
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
                    Edit
                    </h4>
                </div>
                <div className="modal-body" id="modalBody" >
                    <div className="row user_resume">
                        <div className="col-md-6">
                            <h2>My Designing Team</h2>
                        </div>
                        <div className="col-md-6">
                            <span>Meeting Scheduled</span>
                        </div>
                    </div>
                    <div className="row team_type">
                        <div className="col-md-6">
                            <h3>Your Team Type</h3>
                            <div className="team_name">
                                <img src={offshore} alt="" />
                                <p>Dedicated <br /> Offshore Team</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="monthly_coast">
                                <div className="cost_price">
                                    <h4>Total monthly cost</h4>
                                    <p>$890</p>
                                </div>
                                <p>Your Offshore Dedicated Team</p>
                            </div>
                            <div className="monthly_coast">
                                <div className="cost_price">
                                    <h4>SLA Support</h4>
                                    <p>$20,000</p>
                                </div>
                                <p>+10% of the cost of dedicated team</p>
                            </div>
                        </div>
                    </div>
                    <div className="row support_team">
                        <div className="col-md-12">
                            <h5>Your Supporting Team</h5>
                        </div>
                        <div className="col-md-6">
                            <div className="support_member">
                                <div className="support_img">
                                    <img src={sprtImg} alt="" />
                                </div>
                                <div className="support_title">
                                    <h3>Mahmud Himu</h3>
                                    <p>Business Analyst</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="support_member">
                                <div className="support_img">
                                    <img src={sprtImg} alt="" />
                                </div>
                                <div className="support_title">
                                    <h3>Mahmud Himu</h3>
                                    <p>Business Analyst</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my_team">
                        <div className="col-md-12 d-flex">
                            <h3>Your My Team</h3>
                            <p>10 Members</p>
                        </div>
                        <div className="col-md-12">
                            <div className="team_member">
                               <div className="team_member_flex d-flex">
                                    <div className="member_img">
                                        <img src={sprtImg} alt="" />
                                    </div>
                                    <div className="member_title">
                                        <h4>Fahim Bashar Faisal</h4>
                                        <h3>Expert developer, AWS certified Architect &amp; DevOps</h3>
                                        <div className="dept_ex d-flex">
                                            <p> <strong>Department:</strong> UIUX Designer</p>
                                            <p> <strong>Experience:</strong> 5 Years</p>
                                        </div>
                                    </div>
                               </div>
                               <p>Accumsan, dictumst dui aliquet lobortis massa. Cursus massa aliquam amet quis non consectetur tempor. Purus nibh est cras sed. Lobortis amet turpis mauris arcu odio mi commodo tincidunt porttitor.</p>
                               
                                <Slider {...settingsExpertise} dots={false}>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                </Slider>
                            </div>
                            <div className="team_member">
                               <div className="team_member_flex d-flex">
                                    <div className="member_img">
                                        <img src={sprtImg} alt="" />
                                    </div>
                                    <div className="member_title">
                                        <h4>Fahim Bashar Faisal</h4>
                                        <h3>Expert developer, AWS certified Architect &amp; DevOps</h3>
                                        <div className="dept_ex d-flex">
                                            <p> <strong>Department:</strong> UIUX Designer</p>
                                            <p> <strong>Experience:</strong> 5 Years</p>
                                        </div>
                                    </div>
                               </div>
                               <p>Accumsan, dictumst dui aliquet lobortis massa. Cursus massa aliquam amet quis non consectetur tempor. Purus nibh est cras sed. Lobortis amet turpis mauris arcu odio mi commodo tincidunt porttitor.</p>
                               
                                <Slider {...settingsExpertise} dots={false}>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                </Slider>
                            </div>
                            <div className="team_member">
                               <div className="team_member_flex d-flex">
                                    <div className="member_img">
                                        <img src={sprtImg} alt="" />
                                    </div>
                                    <div className="member_title">
                                        <h4>Fahim Bashar Faisal</h4>
                                        <h3>Expert developer, AWS certified Architect &amp; DevOps</h3>
                                        <div className="dept_ex d-flex">
                                            <p> <strong>Department:</strong> UIUX Designer</p>
                                            <p> <strong>Experience:</strong> 5 Years</p>
                                        </div>
                                    </div>
                               </div>
                               <p>Accumsan, dictumst dui aliquet lobortis massa. Cursus massa aliquam amet quis non consectetur tempor. Purus nibh est cras sed. Lobortis amet turpis mauris arcu odio mi commodo tincidunt porttitor.</p>
                               
                                <Slider {...settingsExpertise} dots={false}>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                </Slider>
                            </div>
                            <div className="team_member">
                               <div className="team_member_flex d-flex">
                                    <div className="member_img">
                                        <img src={sprtImg} alt="" />
                                    </div>
                                    <div className="member_title">
                                        <h4>Fahim Bashar Faisal</h4>
                                        <h3>Expert developer, AWS certified Architect &amp; DevOps</h3>
                                        <div className="dept_ex d-flex">
                                            <p> <strong>Department:</strong> UIUX Designer</p>
                                            <p> <strong>Experience:</strong> 5 Years</p>
                                        </div>
                                    </div>
                               </div>
                               <p>Accumsan, dictumst dui aliquet lobortis massa. Cursus massa aliquam amet quis non consectetur tempor. Purus nibh est cras sed. Lobortis amet turpis mauris arcu odio mi commodo tincidunt porttitor.</p>
                               
                                <Slider {...settingsExpertise} dots={false}>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                </Slider>
                            </div>
                            <div className="team_member">
                               <div className="team_member_flex d-flex">
                                    <div className="member_img">
                                        <img src={sprtImg} alt="" />
                                    </div>
                                    <div className="member_title">
                                        <h4>Fahim Bashar Faisal</h4>
                                        <h3>Expert developer, AWS certified Architect &amp; DevOps</h3>
                                        <div className="dept_ex d-flex">
                                            <p> <strong>Department:</strong> UIUX Designer</p>
                                            <p> <strong>Experience:</strong> 5 Years</p>
                                        </div>
                                    </div>
                               </div>
                               <p>Accumsan, dictumst dui aliquet lobortis massa. Cursus massa aliquam amet quis non consectetur tempor. Purus nibh est cras sed. Lobortis amet turpis mauris arcu odio mi commodo tincidunt porttitor.</p>
                               
                                <Slider {...settingsExpertise} dots={false}>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                </Slider>
                            </div>
                            <div className="team_member">
                               <div className="team_member_flex d-flex">
                                    <div className="member_img">
                                        <img src={sprtImg} alt="" />
                                    </div>
                                    <div className="member_title">
                                        <h4>Fahim Bashar Faisal</h4>
                                        <h3>Expert developer, AWS certified Architect &amp; DevOps</h3>
                                        <div className="dept_ex d-flex">
                                            <p> <strong>Department:</strong> UIUX Designer</p>
                                            <p> <strong>Experience:</strong> 5 Years</p>
                                        </div>
                                    </div>
                               </div>
                               <p>Accumsan, dictumst dui aliquet lobortis massa. Cursus massa aliquam amet quis non consectetur tempor. Purus nibh est cras sed. Lobortis amet turpis mauris arcu odio mi commodo tincidunt porttitor.</p>
                               
                                <Slider {...settingsExpertise} dots={false}>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                </Slider>
                            </div>
                            <div className="team_member">
                               <div className="team_member_flex d-flex">
                                    <div className="member_img">
                                        <img src={sprtImg} alt="" />
                                    </div>
                                    <div className="member_title">
                                        <h4>Fahim Bashar Faisal</h4>
                                        <h3>Expert developer, AWS certified Architect &amp; DevOps</h3>
                                        <div className="dept_ex d-flex">
                                            <p> <strong>Department:</strong> UIUX Designer</p>
                                            <p> <strong>Experience:</strong> 5 Years</p>
                                        </div>
                                    </div>
                               </div>
                               <p>Accumsan, dictumst dui aliquet lobortis massa. Cursus massa aliquam amet quis non consectetur tempor. Purus nibh est cras sed. Lobortis amet turpis mauris arcu odio mi commodo tincidunt porttitor.</p>
                               
                                <Slider {...settingsExpertise} dots={false}>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">ReactJs</div>
                                    <div className="slider-item">NodeJs</div>
                                    <div className="slider-item">GraphQL</div>
                                    <div className="slider-item">HTML</div>
                                    <div className="slider-item">NodeJs</div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
                
        
    </div>

    

  )};


export default TeamListing;