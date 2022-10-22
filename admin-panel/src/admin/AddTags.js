import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'reactstrap';

function AddTags() {

    const [data, setData] = useState({});
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        
        //save after validation success
        if (form.checkValidity() === true) {

            axios.post('tags-create', {
                ...data
                })
                .then(function (response) {

                    cogoToast.success("Successfully Added" , {position: 'top-right' });
                })
                .catch(function (error) {
                    cogoToast.error(error.response.data.message , {position: 'top-right' });
            });
        }
      }
    

  return (
    <>
    

    <div className="companyProfile">
        <h2> Tags </h2>
        <form onSubmit={ handleSubmit } > 
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label> Name</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Tag"
                        required
                        name="tag"
                        onChange={(e)=> setData( {[e.target.name]: e.target.value , ['id'] : String( Math.random() )  } )}
                        />
                    </div>

                    <button>Submit</button>
                </div>

            </div>
        </form>
    </div>


    </>
  );
}

export default AddTags;