import { useState, useEffect,useRef,useCallback } from "react";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom"; 
import OffshoreImg from "../assets/images/Offshore.png" 
import slaImg from "../assets/images/sla.png"
import UserPic from "../assets/images/user_icon.png"
import SearchImg from "../assets/images/search.png" 
import AskTalent from "./AskTalent";
import cogoToast from 'cogo-toast';
import axios from 'axios';
import { S3KEY } from "../Constant";

function CostCalculator() {
    const [status, setSendStatus] =useState()
    const [loader, setLoader] =useState(false)
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
    const [designationOptions, setdesignationOptions] = useState([]);
    const [departmentOptions, setdepartmentOptions] = useState([]);
    const [countMin, setCountMin] = useState(0);
    const [slaCountMin, setSlaCountMin] = useState(0);
    const [countMax, setCountMax] = useState(0);
    const [slaCountMax, setSlaCountMax] = useState(0);
    const [isSlA, setIsSlA] = useState(false);
    const [costCalculator, setcostCalculator] = useState([]);
    const [spacialListData, setSpacialListData] = useState([]);

    const [offshoreTeam, setoffshoreTeam] = useState(false);
    const [slaTeam, setslaTeam] = useState(false);

    const collapsTab = async(e)=>{
        let classNames = e.target.className 
        if( classNames.includes("active") ){ 
            let el = e.target.parentElement
            el.children[0].classList.remove("active")
            el.children[1].style.display = "none"
        }else{
            let el = e.target.parentElement
            el.children[0].classList.add("active")
            el.children[1].style.display = "block"
        }
    }

    const decrementCount = (id) => {
        let prev_value = document.getElementById('number_of_team_' + id).value;
        if (prev_value > 1) document.getElementById('number_of_team_' + id).value = Number(prev_value) - Number(1);
      };
    
      const incrementCount = (id) => {
            let prev_value = document.getElementById('number_of_team_' + id).value;
            document.getElementById('number_of_team_' + id).value = Number(prev_value) + Number(1);
      };

    function addToCart(id) {
        setLoader(true);
        let number_of_team = document.getElementById('number_of_team_' + id).value;
        axios.get("/get_designation/" + id).then(res => {
            let costCal = {};
            if(document.getElementById("cost_item_" + id)) {
                let team_sum = document.getElementById('team_sum_' + id).innerText;
                costCal.number_of_team = Number(number_of_team) + Number(team_sum);
                removeFromCart(id, res.data.min_salary, res.data.max_salary, team_sum);
            } else {
                costCal.number_of_team = number_of_team;
            }
            costCal.designation_data = res.data;
            let totalMax = countMax + (res.data.max_salary * number_of_team);
            let totalMin = countMin + (res.data.min_salary * number_of_team);
            calculatePercent(totalMax, totalMin, isSlA);
            setcostCalculator(oldArray => [...oldArray, costCal])
            setLoader(false);
        }).catch(function (error) {
            cogoToast.error(error.response.data.message , { position: 'top-right' } );
        });
    }

    function calculatePercent(max, min, sla) {
        if(sla) {
            let slaPercentMin = (min * 20) / 100;
            let slaPercentMax = (max * 20) / 100;
            let totalMin = min;
            let totalMax = max;
            setCountMin(totalMin);
            setCountMax(totalMax);
            setSlaCountMin(slaPercentMin);
            setSlaCountMax(slaPercentMax);
        } else {
            let slaPercentMin = 0;
            let slaPercentMax = 0;
            let totalMin = min;
            let totalMax = max;
            setCountMin(totalMin);
            setCountMax(totalMax);
            setSlaCountMin(slaPercentMin);
            setSlaCountMax(slaPercentMax);
        }


    }

    function removeFromCart(id, min, max, team_size) {
        document.getElementById("cost_item_" + id).remove();
        calculatePercent(countMax - (max * team_size), countMin - (min * team_size), isSlA);
    }

    function designationFetchData() {
            axios.get("/all_designations").then(res => {
            setdesignationOptions(res.data);
        }).catch(function (error) {
            cogoToast.error(error.response.data.message , { position: 'top-right' } );
        });
    }

    function departmentFetchData() {
            axios.get("/all_departments").then(res => {
            setdepartmentOptions(res.data);
        }).catch(function (error) {
            cogoToast.error(error.response.data.message , { position: 'top-right' } );
        });
    }

    function spacialListFetchData() {
        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        axios.get('reviewSpacialTeam')
            .then(function (response) {
            setSpacialListData(response.data)

            for (let index = 0; index < response.data.length; index++) {
                if (response.data[index].is_sla == 2) {
                  setslaTeam(true)
                }else{
                  setoffshoreTeam(true)
                }
            }

            }).catch(function (error) {
                if(error.response.data.loginStatus == false){
                    routerHistory.push("login");
                    localStorage.removeItem("AuthUserToken")
                }
                cogoToast.error(error.response.data.message , { position: 'top-right' } );
        });
  }

    useEffect(() => {
        departmentFetchData();
        designationFetchData();
        spacialListFetchData();
    } , []);

    const teamType = async(e)=>{
        let classname = e.target.className
        document.getElementById("Offshore").className = "ui-state-inactive";
        document.getElementById("SLA").className = "ui-state-inactive";
        document.getElementById(classname).className = "ui-state-active";
        document.getElementById("sla_part").style.display = "none";
    
        if(classname == "Offshore"){
          document.getElementById("tabs-2").style.display = "block";
          document.getElementById("tabs-3").style.display = "none";
          document.getElementById("sla_part").style.display = "none";
          setIsSlA(false);
          calculatePercent(countMax, countMin, false);
        }else{
          document.getElementById("tabs-2").style.display = "none";
          document.getElementById("tabs-3").style.display = "block";
          document.getElementById("sla_part").style.display = "block";
          setIsSlA(true);
          calculatePercent(countMax, countMin, true);
        }
    }
  return (
      
    <div className="right_content">
        <div className="manageCost_calculator">
            <div className="your-team-name">
            <div className="Cal_cost_overlay">
                <div className="row">
                <div className="col-lg-5">
                    <div className="Cal_cost_overlay_text">
                    <h3>
                        Total monthly cost <span>$890</span>
                    </h3>
                    <p>Your Offshore Dedicated Team</p>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="Cal_cost_overlay_text">
                    <h3>
                        SLA Support <span>$20,000</span>
                    </h3>
                    <p>+20% of the cost of dedicated team</p>
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
                <h1>Cost Calculator</h1>
                </div>
                <div className="tablist" style={{ float: "left", width: "100%" }}>
                <div id="tabs">
                    <div className="teamTypeSelect">
                    <ul>
                        <label>Select Your Team Type</label>
                        <li onClick={teamType} id="Offshore" className="ui-state-active">
                            <a className="Offshore">
                                <img src={OffshoreImg} alt="images" className="Offshore" /> Offshore
                                <br /> Dedicated Team
                            </a>
                        </li>
                        <li onClick={teamType} id="SLA">
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
                    <div id="tabs-3" style={{ display: "none" }} >

                        {
                            slaTeam && 
                            <div className="teamSupporting_view row">
                            {
                            spacialListData.map((cell, i) => {
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
                    <div id="tabs-2">

                        {
                            offshoreTeam && 

                            <div className="teamSupporting_view row" >

                                {
                                spacialListData.map((cell, i) => {
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
                <div className="row aDSearch">
                    <div className="col-md-6 selectItem">
                    <label htmlFor="Sort By">Sort By </label>
                    <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                    >
                        <a className="dropdown-item" href="#">
                        Action
                        </a>
                        <a className="dropdown-item" href="#">
                        Another action
                        </a>
                        <a className="dropdown-item" href="#">
                        Something else here
                        </a>
                    </div>
                    </div>
                    <div className="col-md-6 pr-0">
                    <div className="item_serch">
                        <input
                        type="text"
                        className="form-control membarSearch"
                        placeholder="Search..."
                        />
                        <img src={SearchImg} alt />
                    </div>
                    </div>
                </div>
                </div>
                <div className="row">
                <div className="col-md-12">
                    <div className="accordion">
                    {
                        (departmentOptions !="" && departmentOptions !=null) && 
                            departmentOptions.map((data , key)=>
                                <div className="accordion__item">
                                    <div className={key === 0 ? "accordion__item__header active" : "accordion__item__header"} onClick={collapsTab}>
                                        {data.name}
                                    </div>
                                    <div className="accordion__item__content" style={key === 0 ? { display: "block" } : { display: "none" }}>
                                        {
                                            designationOptions.map((designationData , designationKey) => 
                                            designationData.departments_id === data.id ? 
                                                <div className="costItem_Calculator">
                                                    <h3 className="user_posi">{designationData.name}</h3>
                                                    <h4 className="user_exp">Min. Experience {designationData.year_of_experience} Years</h4>
                                                    <div className="addItem_area">
                                                        <div className="inner-add_remove">
                                                            <a className="btn-number" onClick={ () => decrementCount(designationData.id) }>-</a>
                                                            <input
                                                            className="input-text-tvr"
                                                            onkeypress="return false"
                                                            id={ "number_of_team_" + designationData.id }
                                                            type="text"
                                                            defaultValue={1}
                                                            />
                                                            <a className="btn-number" onClick={ () => incrementCount(designationData.id) }>+</a>
                                                        </div>
                                                        {
                                                            loader == true ?
                                                            <button button className="btn btn-addTeam disabled">Add</button>
                                                            :
                                                            <button button className="btn btn-addTeam" onClick={ () => addToCart(designationData.id) }>Add</button>
                                                        }
                                                    </div>
                                                </div>
                                            :
                                                ""
                                            )
                                        }
                                    </div>
                                </div>
                            )
                    }
                    </div>
                </div>
                {/* id accordion end */}
                </div>
                {/* <div class="col-md-12">
                    <nav class="costCalculator_pagination" aria-label="Page navigation example">
                        <ul class="costCalculator pagination">
                        <li class="page-item"><a class=" active" href="#">1</a></li>
                        <li class="page-item"><a class="" href="#">2</a></li>
                        <li class="page-item"><a class="" href="#">3</a></li>
                        <li class="page-item"><a class="" href="#">4</a></li>
                        <li class="page-item"><a class="" href="#">5</a></li>
                        <li class="page-item"><a class="" href="#">3</a></li>
                        </ul>
                    </nav>
                    </div> */}
            </div>
            </div>
            {/* ========== DEPARTMENT PART ========== */}
        </div>
        <div className={status== true?"cost_calculetor manage_cost newclass-add":"cost_calculetor manage_cost"}>
            <div className={status== true? "fixedSidebar sidbar-noraml":"fixedSidebar"}>
            <h4>Cost Calculator</h4>
            <div className="cost_value">
                {
                    costCalculator.map((number_of_team, key) => 
                        <div className="cost-item" id={"cost_item_" + number_of_team.designation_data.id}>
                            <h3>
                            {number_of_team.designation_data.name}
                                <span onClick={ () => removeFromCart(number_of_team.designation_data.id, number_of_team.designation_data.min_salary, number_of_team.designation_data.max_salary, number_of_team.number_of_team) }>
                                <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx={10} cy={10} r={10} fill="#E20707" />
                                    <rect
                                    x="5.55566"
                                    y="8.88892"
                                    width="8.88889"
                                    height="2.22222"
                                    fill="white"
                                    />
                                </svg>
                                </span>
                            </h3>
                            <p><span id={"team_sum_" + number_of_team.designation_data.id}>{number_of_team.number_of_team}</span> x ${number_of_team.designation_data.min_salary} - ${number_of_team.designation_data.max_salary}</p>
                        </div>
                    )
                }

            </div>
            <div className="monthly_cost">
                <div className="monthly_item">
                <h4>
                    Total monthly cost <span>${countMin} - ${countMax}</span>
                </h4>
                <p>Your Offshore Dedicated Team</p>
                </div>
                <div className="monthly_item" id="sla_part" style={{display : "none"}}>
                <h4>
                    SLA Support <span>${countMin + slaCountMin} - ${countMax + slaCountMax}</span>
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


  );
}

export default CostCalculator;