import { useHistory, useParams } from "react-router-dom"
import 'react-calendar/dist/Calendar.css';
import { InlineWidget } from "react-calendly";
import { useEffect, useState } from "react";
import moment from 'moment';

function ScheduleMetting() {

    const routerHistory = useHistory();

    const meeting_start_date = useParams("id");
    const [clandlyurl, setClandlyurl] =useState();
    // const [startMonth, setStartMonth] =useState()
    useEffect(()=>{

        let month = moment(meeting_start_date.id, "MM-DD-YYYY");
        console.log(month, '-------------------month', meeting_start_date)
        let urlClandly = `https://calendly.com/rakeshroyshuvo/15min?month=2021-09&date=${meeting_start_date.id}`;
        setClandlyurl(urlClandly)
       
    },[]);

    const clickTab =(value)=>{
        routerHistory.push(value);
    }



  return (
    
    <div className="right_content review_team_u">
        <div className="progressbarDiv">
            <form id="progress_form">
            <ul id="progressbar">
                <li className="active done" id="step1" style={{cursor:"pointer"}} onClick={ ()=>clickTab("/") } >
                Add Talents
                </li>
                <li className="active done" id="step2" style={{cursor:"pointer"}} onClick={ ()=>clickTab("/") } >Review Team</li>
                <li className="active done" id="step3" style={{cursor:"pointer"}} onClick={ ()=>clickTab("/") }>Submit Requisition</li>
                <li className="active" id="step4">Schedule a Meeting</li>
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
            <div className="name-text  name-text-clandly">
                <h1>Manage Schedule time and Date</h1>

                <div className="clanldy">
                    {clandlyurl&&<InlineWidget url={clandlyurl} />}
                
                </div>
            </div>
            {/* <div className="btn_manage">
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
            </div> */}
            </div>
            <div className="ScheduleMettingInfo">
            </div>
        </div>
    </div>

  );
}

export default ScheduleMetting;