import React, { useState, useEffect } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'; 
import cellPhoneImg from '../assets/images/cellPhone.png'; 
import userImg from '../assets/images/user.png'; 
import {UploadToS3} from './UploadS3';
import logImg from '../assets/images/log.png';
import { Link, useHistory } from 'react-router-dom';
import { FrontURL, S3KEY } from '../Constant';
import axios from "axios";
import cogoToast from "cogo-toast";
import { Modal  } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { userInfo } from '../actions/index'


function Navbar() {
  const dispatch = useDispatch()
  const [data, setData] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAdress] = useState('');
  // const [InHouseEmployees, setInhouse_employee] = useState(1);
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [company_email, setCompanyEmail] = useState('');
  const [company_address, setCompanyAddress] = useState('');
  const [company_website, setCompanyWebsite] = useState('');
  const [company_number, setCompanyPhone] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const routerHistory = useHistory();
  
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  const [emp_Image, setemp_Image] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    function handleForm() {
        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        axios.put("/userUpdate/" + id, {
          company_name: company_name,
          company_email: company_email,
          company_phone: company_number,
          company_address: company_address,
          company_website: company_website,
          name: name,
          email: email,
          phone: phone,
          address: address,
          website: website,
          newPassword: newPassword,
          password: password
          }).then(response => {
            fetchData();
            cogoToast.success("Profile Updated!" , { position: 'top-right' } );
            setPassword('');
        }).catch(function (error) {
            if(error.response.data.loginStatus == false){
                routerHistory.push("login");
                localStorage.removeItem("AuthUserToken")
            }
            cogoToast.error(error.response.data.message , { position: 'top-right' } );
        });
    }

    const handleProfilePictureForm =async(e)=> {

        await UploadToS3(e.target.files[0], (response) => {
          console.log("response-----" , response)

          if(response.key)
          {
            var AuthUserToken = localStorage.getItem("AuthUserToken")
            axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;
            axios.put("/userProfilePictureUpdate/" + id, {
              profile_image: 'public/'+ response.key
              }).then(response => {
                fetchData();
                cogoToast.success("Profile Picture Updated!" , { position: 'top-right' } );
            }).catch(function (error) {
                if(error.response.data.loginStatus == false){
                    routerHistory.push("login");
                    localStorage.removeItem("AuthUserToken")
                }
                cogoToast.error(error.response.data.message , { position: 'top-right' } );
            });
          }
      
        });
    }
    
    function fetchImg(params) {
      axios.post( "get-s3-image-link", {
          image_key: params
      })
      .then(res => {
          setemp_Image(res.data.imageUrl)
      }).catch(function (error) {
          // cogoToast.error(error.response.data.message , { position: 'top-right' } );
      });

    }

    function fetchData(){
      var AuthUserToken = localStorage.getItem("AuthUserToken")
      axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

      axios.get( "user" )
      .then(response => {
          dispatch(userInfo(response.data))
          setData(response.data)
          setId(response.data.id)
          setName(response.data.contact_person_name)
          setEmail(response.data.contact_person_email)
          setAdress(response.data.contact_person_address)
          setWebsite(response.data.contact_person_website)
          setPhone(response.data.contact_person_phone)
          setPassword(response.data.password)
          setCompanyName(response.data.name)
          setCompanyEmail(response.data.email)
          setCompanyAddress(response.data.address)
          setCompanyPhone(response.data.phone)
          setCompanyWebsite(response.data.website)
          fetchImg(response.data.profile_image)
          setProfilePicture(response.data.profile_image)
      }).catch(function (error) {
          if(error?.response?.data?.loginStatus == false){
              routerHistory.push("login");
              localStorage.removeItem("AuthUserToken")
          }
          cogoToast.error(error?.response?.data?.message , { position: 'top-right' } );
      });
  }

    function openModal() {
      setShow(true);
    }

    function close() {
      setShow(false);
    }

    function logout() {
      localStorage.removeItem('AuthUserToken');
      window.location.href = FrontURL;
    }

    useEffect(() => {
        fetchData()
    } , []);

    


  return (
    <>
      <nav className="navbar navbar-light ">
        <div className="container-fluid fixed_width dboard_widthHeader">
        <Link to="/"  > Home </Link>
        <Link to="/" className="navbar-brand">  </Link>
          <div className="user_infos pull-left">
            <ul className="notification">
            </ul>
            <ul className="userNav">

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle caret>
                            <a href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="dropdown-toggle">
                                <div className="abc">
                                  
                                  <img src={ data.profile_image ? S3KEY+data.profile_image : userImg } /> Hi, <span>{company_name}</span>
                                  <svg width={13} height={8} viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M5.66016 7.19531C5.90625 7.44141 6.31641 7.44141 6.5625 7.19531L11.8945 1.89062C12.1406 1.61719 12.1406 1.20703 11.8945 0.960938L11.2656 0.332031C11.0195 0.0859375 10.6094 0.0859375 10.3359 0.332031L6.125 4.54297L1.88672 0.332031C1.61328 0.0859375 1.20312 0.0859375 0.957031 0.332031L0.328125 0.960938C0.0820312 1.20703 0.0820312 1.61719 0.328125 1.89062L5.66016 7.19531Z" fill="#BBBBBB" />
                                  </svg>
                                </div>
                            </a>
                        </DropdownToggle>
                    <DropdownMenu>
                        
                    <li onClick={openModal}> <Link to="/" className="dropdown-item">My Profile</Link> </li>
                    
                    {/* <li> <Link to="/update_password" className="dropdown-item"> Update Password </Link>  </li> */}
                    <li> <Link to="/" className="dropdown-item logOut" onClick={logout} > Logout </Link>  </li>

                    </DropdownMenu>
                </ButtonDropdown>

            </ul>
          </div>
          {/* <form class="form-inline">
          <button class="btn btn-sm btn-danger" type="button">Logout</button>
        </form> */}
        </div>
      </nav>




      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" className="myProfile_modal">
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
      <button type="button" onClick={handleForm} className="btn btn-update">
        Update
      </button>
    </div>
    <div className="modal-body">
      <div className="row user_profile">
        <div className="viewUserDiv">
          <h1>My Profile</h1>
          <div className="Userdeatals">
            <input type="file" name="file" onChange={ handleProfilePictureForm } id="my-file" accept="image/png, image/gif, image/jpeg" />
            <label for="my-file">
            <img src= {S3KEY + data.profile_image}/>
            </label>
            {/* <button name="Update Profile Picture" type="button" onClick={handleProfilePictureForm} className="btn btn-update">
              Update
            </button> */}
            {/* <button name="Delete User" type="button" className="btn btn-delete">
              Delete
            </button> */}
          </div>
        </div>
        {/* <div className="companyProfile">
          <h2> Information</h2>
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label> Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company Name"
                    onChange = { (e) => setCompanyName(e.target.value) }
                    defaultValue={company_name}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Type Email"
                    onChange = { (e) => setCompanyEmail(e.target.value) }
                    defaultValue={company_email}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label> Address</label>
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Company Address"
                    onChange = { (e) => setCompanyAddress(e.target.value) }
                    defaultValue={company_address}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label> Website</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Company Website"
                    onChange = { (e) => setCompanyWebsite(e.target.value) }
                    defaultValue={company_website}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>phone</label>
                  <div className="input-group">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter company number"
                      onChange = { (e) => setCompanyPhone(e.target.value) }
                      defaultValue={company_number}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div> */}
        {/* <div className="companyProfileInfo">
          <h2>Contact Person Information</h2>
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    onChange = { (e) => setName(e.target.value) }
                    defaultValue={name}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onChange = { (e) => setEmail(e.target.value) }
                    defaultValue={email}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    onChange = { (e) => setAdress(e.target.value) }
                    defaultValue={address}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Website"
                    onChange = { (e) => setWebsite(e.target.value) }
                    defaultValue={website}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>phone</label>
                  <div className="input-group">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter your number"
                      onChange = { (e) => setPhone(e.target.value) }
                      defaultValue={phone}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div> */}
        {/* <div className="companyProfilepassChange">
          <h2>Change Pasword</h2>
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Current Password"
                    onChange = { (e) => setPassword(e.target.value) }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    onChange = { (e) => setNewPassword(e.target.value) }
                  />
                </div>
              </div>
            </div>
          </form>
        </div> */}
      </div>
    {/* modal-content */}
  </div>









      </Modal>

    </>
  );
}

export default Navbar;
