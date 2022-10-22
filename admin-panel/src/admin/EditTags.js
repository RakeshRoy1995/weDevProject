import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Link , useParams } from 'react-router-dom';
import { Form } from 'reactstrap';

function EditTags() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [editData, seteditData] = useState({});


    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        
        //save after validation success
        if (form.checkValidity() === true) {

            axios.put('tags/'+id, {
                ...data
                })
                .then(function (response) {

                    cogoToast.success("Successfully Updated" , {position: 'top-right' });
                })
                .catch(function (error) {
                    cogoToast.error(error.response.data.message , {position: 'top-right' });
            });
        }
      }

      const fetchData = async(id)=>{
        axios.get('tags/'+id)
            .then(function (response) {

                console.log("response" , response.data);
                setData(response?.data[0])
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message , {position: 'top-right' });
        });
    }


    useEffect(() => {
        fetchData(id)
    }, []);
    

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
                        value={data?.tag}
                        onChange={(e)=> setData( {[e.target.name]: e.target.value } )}
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

export default EditTags;