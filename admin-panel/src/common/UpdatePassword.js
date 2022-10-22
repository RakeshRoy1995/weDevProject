import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cogoToast from 'cogo-toast';

function UpdatePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [typePassword, settypePassword] = useState('');
    const [RetypePassword, setRetypePassword] = useState(''); 
    const [RetypeOldPassword, setRetypeOldPassword] = useState('');
    const [id, setUserID] = useState('');

    function HandleSubmit() {
        if(typePassword && RetypePassword ) {
            if (typePassword == RetypePassword ) {
                if (oldPassword == RetypeOldPassword ) {
                    var AuthUserToken = localStorage.getItem("AuthUserToken")
                    axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

                    axios.post('update_New_password', {
                        password : typePassword,
                        id
                        })
                        .then(function (response) {

                            cogoToast.success("Password Updated Successfully" , {position: 'top-right' });

                        })
                        .catch(function (error) {
                            cogoToast.error(error.response?.data.message , {position: 'top-right' });
                    });

                } else {
                    cogoToast.error("Old password does not matched", {position: 'top-right' });
                }

            } else {
                cogoToast.error("Password does not matched", {position: 'top-right' });
            }
        }else{
            cogoToast.error("Enter New Password", {position: 'top-right' });
        }
    }
    

    function fetchData() {

        var AuthUserToken = localStorage.getItem("AuthUserToken")
        axios.defaults.headers.common['AuthUserToken'] = AuthUserToken;

        axios.post('getAuth')
            .then(function (response) {

                setOldPassword(response.data[0].password)
                setUserID(response.data[0].id)

            })
            .catch(function (error) {
                cogoToast.error(error.response?.data.message , {position: 'top-right' });
        });
    }

    useEffect(() => {
        fetchData()
    } , []);

  return (
    <div class="right_content">
        <div className="askTalent">
        <h2 className="askTalent_title">Update Password</h2>
        <form className="askTalentForm">
            
            <div className="col-md-4">
                <div className="form-group">
                    <label>Enter Old Password</label>
                    <input
                    type="text"
                    onChange = { (e) => setRetypeOldPassword(e.target.value)}
                    className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Enter New Password</label>
                    <input
                    type="password"
                    onChange = { (e) => settypePassword(e.target.value)}
                    className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Retype Password</label>
                    <input
                    type="password"
                    onChange = { (e) => setRetypePassword(e.target.value)}
                    className="form-control"
                    />
                </div>
            </div>

            <div className="col-md-12 text-right">
                <button type="button" onClick={HandleSubmit} className="btn btn-submit">
                    Submit
                </button>
            </div>
        </form>
        </div>
    </div>
  );
}

export default UpdatePassword;