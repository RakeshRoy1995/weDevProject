import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'reactstrap';
function AddShops() {
    const [dataTag, setdataTag] = useState([]);


    const fetchData = async()=>{
        axios.get('all-tags')
            .then(function (response) {

                console.log("response" , response);
                setdataTag(response.data)
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message , {position: 'top-right' });
        });
    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        
        //save after validation success
        if (form.checkValidity() === true) {
            const data = new FormData(event.target);


            const options = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data,
                url: 'shop-create?type=products',
              };
              
              const response = await axios(options).then(function (response) {

                cogoToast.success("Successfully Added" , {position: 'top-right' });
            })
            .catch(function (error) {
                cogoToast.error("Something Went Wrong" , {position: 'top-right' });
            });



            // axios.post('shop-create?type=products',
            // headers: { 
            //     "Content-Type": "application/x-www-form-urlencoded"
            // },
            //     {
            //     data ,
                
            //     },
                
            //     )
            //     .then(function (response) {

            //         cogoToast.success("Successfully Added" , {position: 'top-right' });
            //     })
            //     .catch(function (error) {
            //         // cogoToast.error(error.response.data.message , {position: 'top-right' });
            //     });
        }
      }

    useEffect(() => {
        fetchData()
    }, []);
    

  return (
    <>
    

    <div className="companyProfile">
        <h2> Add Shop</h2>
        <form onSubmit={ handleSubmit }>
        <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <label> Name</label>
                    <input
                    type="text"
                    className="form-control"
                    name='name'
                    />
                </div>
            </div>

            <div className="col-md-6">
                <div className="form-group">
                    <label> Email</label>
                    <input
                    type="text"
                    className="form-control"
                    name='email'
                    />
                </div>
            </div>

            <div className="col-md-6">
                <div className="form-group">
                    <label> Url</label>
                    <input
                    type="text"
                    className="form-control"
                    name='url'
                    />
                </div>
            </div>

            <div className="col-md-6">
                <div className="form-group">
                    <label> Address</label>
                    <input
                    type="text"
                    className="form-control"
                    name='address'
                    />
                </div>
            </div>

            <div className="col-md-6">
                <div className="form-group">
                    <label> Image</label>
                    <input
                    type="file"
                    className="form-control"
                    name='image'
                    />
                </div>
            </div>

            <div className="col-md-6">
                <div className="form-group">
                    <label> Tags</label>
                    <select name="tags" multiple className='form-control'>
                        {
                            dataTag.map((d,k)=>
                               <option key={k} value={d.tag}>{d.tag}</option>
                            )
                        }
                    </select>
                </div>
            </div>

            <button>Submit</button>

        </div>
        </form>
    </div>


    </>
  );
}

export default AddShops;