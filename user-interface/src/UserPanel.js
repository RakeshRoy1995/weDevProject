import React, { useEffect, useState } from 'react';

import './assets/assets/vendor/bootstrap/css/bootstrap.min.css';
import './assets/assets/vendor/bootstrap-icons/bootstrap-icons.css';  
import './assets/assets/css/style.css';
import './assets/css/progressbar.css';
import Navbar from './common/Navbar';
import axios from 'axios';
import { AppURL } from './Constant';
import cogoToast from 'cogo-toast';

function UserPanel() {
  const [data, setdata] = useState([]);
  const [dataTag, setdataTag] = useState([]);
  
  console.log("data" , data);
  console.log("dataTag" , dataTag);
  
  const serach = (v)=>{
    console.log("e", v);
  }

  const fetchData = async()=>{
      axios.get('get-all-shop')
          .then(function (response) {

              console.log("response" , response);
              setdata(response.data)
              fetchData_2()
          })
          .catch(function (error) {

      });
  }

  const fetchData_2 = async()=>{
    axios.get('all-tags')
        .then(function (response) {
          setdataTag(response.data)

          let data = []


          for (let index = 0; index < response.data.length; index++) {
            const element = {};
            element.value = response.data[index].tag
            element.label = response.data[index].tag

            data.push(element)
            
          }

          console.log("data" , data);


        })
        .catch(function (error) {
            cogoToast.error(error.response.data.message , {position: 'top-right' });
    });
}


  useEffect(() => {
    fetchData()
}, []);
  return (
    <>
    <Navbar />
    
    



    <>
      <section className="more-services section-bg">
        <div className="container">

        <Select
          defaultValue={[colourOptions[2], colourOptions[3]]}
          isMulti
          name="colors"
          options={colourOptions}
          className="basic-multi-select"
          classNamePrefix="select"
        />

        <input onChange={(e)=> serach(e.target.value) } className='form-control' style={{width: "200px"}} />
        <br />
          <div className="row">

            {
              data.map((d,k)=>
              
              
              
          <>
            <div className="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
              <div className="card">
              <img
                    src={AppURL + 'static/' + d.image } 
                    className="card-img-top"
                    width="100%"
                  />
                <div className="card-body">
                  <h5 className="card-title">
                    <a href={d.url}>{d.name}</a>
                  </h5>
                </div>
              </div>
            </div>

            <br />
            </>

             )
            }
          </div>
        </div>
      </section>
      {/* End More Services Section */}
    </>





    <>
    <footer id="footer">
      <div className="footer-top">
        <div className="container">
        </div>
      </div>
      <div className="container">
        <div className="copyright">
          © Copyright{" "}
          <strong>
            <span>Shop</span>
          </strong>
          . All Rights Reserved
        </div>
      </div>
    </footer>
    {/* End Footer */}
  </>




    </>
  );


  
}

export default UserPanel;