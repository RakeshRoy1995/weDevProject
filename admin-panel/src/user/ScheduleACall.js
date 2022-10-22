
import 'react-calendar/dist/Calendar.css';
import { InlineWidget } from "react-calendly";

function ScheduleACall() {
    


  return (
    
    <div className="right_content review_team_u">
        <div className="your-team-name">
            <div className="team_name">
              <div className="name-text  name-text-clandly">
                  <h1>Manage Schedule time and Date</h1>

                  <div className="clanldy">
                      <InlineWidget url='https://calendly.com/rakeshroyshuvo' />
                  </div>
              </div>
            </div>
            <div className="ScheduleMettingInfo">
            </div>
        </div>
    </div>


  );
}

export default ScheduleACall;