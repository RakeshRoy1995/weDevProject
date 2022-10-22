import axios from "axios";
import cogoToast from "cogo-toast";
import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useHistory } from 'react-router-dom';
import { Modal } from "reactstrap";
import srcImg from "../assets/images/search.png";
import team_listingImg from "../assets/images/team_listing.png";

function ManageMeeting() {
    const [data, setData] = useState([]);
    const routerHistory = useHistory();
    const [filterdata, setFilterData] = useState([]);
    const [filterStatus, setFilterStatus] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [dropdownName, setdropdownName] = useState("Status");

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    function close() {
        setShow(false);
    }

    function fetchData(){
        
        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        axios.post( "meeting_listing" ,
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

    function status(val, name) { 

        setdropdownName(name)
        if (val !== "") {
            const result = data.filter(word => word.meeting_status == val );
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

    const dateChange = async(requisitions_id, date)=>{
        setShow(true)
        console.log(requisitions_id)
        console.log(date)
        
    }

    useEffect(() => {
        fetchData()
    } , []);
  return (
    
    <div className="right_content">
        {/* ==================== ASK TALENT ============================ */}
        <div className="askTalent team_padding manage_metting">
            <h2 className="askTalent_title">Manage Your Meeting</h2>
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
                                         <Dropdown.Item onClick={ ()=> status(0 ,"Scheduled")}  style={{ cursor:"pointer" }}> Scheduled </Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(1, "Postpended")}  style={{ cursor:"pointer" }}> Postpended</Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(3 , "Pending")}  style={{ cursor:"pointer" }}> Pending  </Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(2 , "Canceled" )}  style={{ cursor:"pointer" }}> Cancelled  </Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(4 , "Re Schedule" )}  style={{ cursor:"pointer" }}> Re Schedule  </Dropdown.Item>
                                         <Dropdown.Item onClick={ ()=> status(5 , "Completed" )}  style={{ cursor:"pointer" }}> Completed  </Dropdown.Item>
                                        
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
                                                    {/* <p>  { collection.team_type == 2 ? "Dedicated SLA Team" : "Dedicated Offshore Team" } </p> */}
                                                    <p className="view_team">View team details</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                        <div className="t_listing_l">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <div className="l_text">
                                                    <h3>Meeting Date</h3>
                                                    <p> {collection.starting_date} </p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="l_text">
                                                    <h3>Cost Detail</h3>
                                                    <p>${collection.estimated_monthly_cost}/month</p>
                                                    {/* <p>12:30 PM</p> */}
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="l_text">
                                                    <h3>Status</h3>
                                                    <p> { collection.meeting_status == 0 ? "Meeting Scheduled" : <> { collection.meeting_status == 1 ? "Meeting Postpended" : <> { collection.meeting_status == 2 ? "Cancelled" : <> { collection.meeting_status == 3 ? "Pending" : <>{ collection.meeting_status == 4 ? "Re Schedule" : "Completed" }</>  } </> } </>  } </> } </p>
                                                    
                                                    </div>
                                                </div>
                                                <div className="col-lg-2 d-flex">
                                                    <div className="l_text logos">
                                                        <Link to="#" onClick={(e)=>dateChange(collection.requisitions_id , collection.starting_date )} className="l-logo bg-white">
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M0.0767462 13.626C-0.0788313 13.997 0.00537403 14.4252 0.289876 14.7097C0.574377 14.9942 1.00261 15.0784 1.37364 14.9228L4.99985 13.4023L1.59723 9.99976L0.0767462 13.626Z" fill="#F48039"/>
                                                                <path d="M14.7094 2.74223L12.2572 0.290106C11.8703 -0.096814 11.243 -0.096814 10.856 0.290106L2.50567 8.6406C2.50354 8.64267 2.50177 8.64499 2.49969 8.64712L6.35246 12.4999C6.35458 12.4978 6.3569 12.496 6.35897 12.494L14.7094 4.14351C15.0963 3.75654 15.0963 3.1292 14.7094 2.74223Z" fill="#F48039"/>
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            {/* <div className="col-lg-2">
                                                <div className="l_text logos">
                                                <Link to={ "/db_manage_team/"+ collection.id + "?status=" + collection.meeting_status }  className="l-logo">
                                                    <svg
                                                    width={17}
                                                    height={15}
                                                    viewBox="0 0 17 15"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                    <path
                                                        d="M16.7283 6.79946L10.589 0.287898C10.4137 0.102025 10.1802 0 9.9311 0C9.68177 0 9.44833 0.102171 9.27308 0.287898L8.71568 0.879231C8.54056 1.06481 8.44409 1.31269 8.44409 1.57699C8.44409 1.84114 8.54056 2.09737 8.71568 2.28295L12.2973 6.08998H0.918408C0.405372 6.08998 0 6.51596 0 7.06024V7.89623C0 8.4405 0.405372 8.90944 0.918408 8.90944H12.3379L8.71581 12.7377C8.5407 12.9236 8.44423 13.1647 8.44423 13.429C8.44423 13.693 8.5407 13.9377 8.71581 14.1234L9.27322 14.7128C9.44847 14.8987 9.6819 15 9.93124 15C10.1803 15 10.4139 14.8974 10.5891 14.7115L16.7284 8.2001C16.9041 8.01364 17.0007 7.76474 17 7.50015C17.0005 7.23468 16.9041 6.98563 16.7283 6.79946Z"
                                                        fill="white"
                                                    />
                                                    </svg>
                                                </Link>
                                                </div>
                                            </div> */}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>

                            )
                            }
                          
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
                                                {/* <p>  { collection.team_type == 2 ? "Dedicated SLA Team" : "Dedicated Offshore Team" } </p> */}
                                                <p className="view_team">View team details</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                    <div className="t_listing_l">
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <div className="l_text">
                                                <h3>Meeting Date</h3>
                                                <p> {collection.starting_date} </p>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="l_text">
                                                <h3>Cost Detail</h3>
                                                <p>${collection.estimated_monthly_cost}/month</p>
                                                {/* <p>12:30 PM</p> */}
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="l_text">
                                                <h3>Status</h3>
                                                <p> { collection.meeting_status == 0 ? "Meeting Scheduled" : <> { collection.meeting_status == 1 ? "Meeting Postpended" : <> { collection.meeting_status == 2 ? "Cancelled" : <> { collection.meeting_status == 3 ? "Pending" : "Re Schedule" } </> } </>  } </> } </p>
                                                
                                                </div>
                                            </div>
                                            <div className="col-lg-2 d-flex">
                                                <div className="l_text logos" onClick={(e)=>dateChange(collection.requisitions_id , collection.starting_date )}>
                                                    <Link to="#" className="l-logo bg-white">
                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0.0767462 13.626C-0.0788313 13.997 0.00537403 14.4252 0.289876 14.7097C0.574377 14.9942 1.00261 15.0784 1.37364 14.9228L4.99985 13.4023L1.59723 9.99976L0.0767462 13.626Z" fill="#F48039"/>
                                                            <path d="M14.7094 2.74223L12.2572 0.290106C11.8703 -0.096814 11.243 -0.096814 10.856 0.290106L2.50567 8.6406C2.50354 8.64267 2.50177 8.64499 2.49969 8.64712L6.35246 12.4999C6.35458 12.4978 6.3569 12.496 6.35897 12.494L14.7094 4.14351C15.0963 3.75654 15.0963 3.1292 14.7094 2.74223Z" fill="#F48039"/>
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        {/* <div className="col-lg-2">
                                            <div className="l_text logos">
                                            <Link to={ "/db_manage_team/"+ collection.id + "?status=" + collection.meeting_status }  className="l-logo">
                                                <svg
                                                width={17}
                                                height={15}
                                                viewBox="0 0 17 15"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                >
                                                <path
                                                    d="M16.7283 6.79946L10.589 0.287898C10.4137 0.102025 10.1802 0 9.9311 0C9.68177 0 9.44833 0.102171 9.27308 0.287898L8.71568 0.879231C8.54056 1.06481 8.44409 1.31269 8.44409 1.57699C8.44409 1.84114 8.54056 2.09737 8.71568 2.28295L12.2973 6.08998H0.918408C0.405372 6.08998 0 6.51596 0 7.06024V7.89623C0 8.4405 0.405372 8.90944 0.918408 8.90944H12.3379L8.71581 12.7377C8.5407 12.9236 8.44423 13.1647 8.44423 13.429C8.44423 13.693 8.5407 13.9377 8.71581 14.1234L9.27322 14.7128C9.44847 14.8987 9.6819 15 9.93124 15C10.1803 15 10.4139 14.8974 10.5891 14.7115L16.7284 8.2001C16.9041 8.01364 17.0007 7.76474 17 7.50015C17.0005 7.23468 16.9041 6.98563 16.7283 6.79946Z"
                                                    fill="white"
                                                />
                                                </svg>
                                            </Link>
                                            </div>
                                        </div> */}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>

                        )
                        }
                        
                        </>
                    )
                }
            })()}


            <Modal show={true} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" className="myProfile_modal">
                <div className="modal-header">
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
                        d="M0.283203 1.66898C-0.0917969 1.29398 -0.0917969 0.66985 0.283203 0.281738C0.671315 -0.0932617 1.28233 -0.0932617 1.67044 0.281738L9.99474 8.62003L18.333 0.281738C18.708 -0.0932617 19.3322 -0.0932617 19.7063 0.281738C20.0944 0.66985 20.0944 1.29485 19.7063 1.66898L11.382 9.99415L19.7063 18.3324C20.0944 18.7074 20.0944 19.3316 19.7063 19.7197C19.3313 20.0947 18.7072 20.0947 18.333 19.7197L9.99474 11.3814L1.67044 19.7197C1.28233 20.0947 0.671315 20.0947 0.283203 19.7197C-0.0917969 19.3316 -0.0917969 18.7066 0.283203 18.3324L8.6075 9.99415L0.283203 1.66898Z"
                        fill="black"
                        />
                    </svg>
                    </button>
                    <button type="button"  className="btn btn-update">
                    Update
                    </button>
                </div>






                <div className="modal-body">
                    <div className="row user_profile">
                        <div className="viewUserDiv">
                        <h1>My Profile</h1>
                        <div className="Userdeatals">
                            
                        </div>
                        </div>
                        <div className="companyProfile">
                        <h2>Company Information</h2>
                        
                        </div>
                    </div>
                </div>


            </Modal>

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
        </div>
    </div>

  );
}

export default ManageMeeting;