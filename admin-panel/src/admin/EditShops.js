import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Form } from 'reactstrap';
import { AppURL } from '../Constant';
function EditShops() {
    const { id } = useParams();
    const [dataTag, setdataTag] = useState([]);
    const [tags, setTag] = useState([]);


    const fetchData = async(id)=>{
        axios.get( 'product/'+id+'?type=products' )
            .then(function (response) {
                setdataTag(response.data[0])
                fetchData_2()
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message , {position: 'top-right' });
        });
    }

    const fetchData_2 = async()=>{
        axios.get('all-tags')
            .then(function (response) {
                setTag(response.data)
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message , {position: 'top-right' });
        });
    }

    console.log("dataTag" , dataTag);

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
                method: 'PUT',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data,
                url: 'product/'+id+'?type=products',
              };
              
              const response = await axios(options).then(function (response) {

                cogoToast.success("Successfully Added" , {position: 'top-right' });
            })
            .catch(function (error) {
                cogoToast.error("Something Went Wrong" , {position: 'top-right' });
            });
        }
      }

    useEffect(() => {
        fetchData(id)
    }, []);

    const selectPart = (data, value)=>{
        let x = []
        x = [...data , value]
        setdataTag({ ...dataTag , ['tags'] : x })
    }
    

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
                    defaultValue={dataTag.name}
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
                    defaultValue={dataTag.email}
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
                    defaultValue={dataTag.url}
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
                    defaultValue={dataTag.address}
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
                    defaultValue={dataTag.name}
                    name='image'
                    />
                </div>

                <img src={AppURL + 'static/' + dataTag.image } width="100px" height="80px" />
            </div>

            <div className="col-md-6">
                <div className="form-group">
                    <label> Tags</label>
                    <select name="tags" multiple onChange={(e)=> selectPart(dataTag.tags , e.target.value) } className='form-control' value={dataTag.tags} >
                        {
                            tags.map((d,k)=>
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

export default EditShops;