import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'reactstrap';
import { FrontURL } from '../Constant';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(false);

    function HandleSubmit(e) {
        e.preventDefault();
        
        if(password != "" && email !="" ) {
            axios.post('login', {
                email: email,
                password: password
                })
                .then(function (response) {

                    localStorage.clear()

                    localStorage.setItem('AuthUserToken', response.data.authToken );
                    window.location.href = process.env.PORT

                })
                .catch(function (error) {
                    cogoToast.error(error.response.data.message , {position: 'top-right' });
            });
        }else{
            setErrorMsg(true)
        }
    }

    useEffect(() => {
        
        
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
        axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token';
        axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
        axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'OPTIONS,POST,GET';

        axios.post('test' )
            .then(function (response) {

                console.log("response " , response)

            })
            .catch(function (error) {

                console.log("error " , error)
        });


    } , []);

  return (

    <section id="login">

       
        <div className="container">
            <div className="row">
            <div className="col-lg-4 col-10 col-sm col-md-9 m-auto">
                <div className="login">
                <div className="login-text">
                    <p style={{ color: "red" }}> {errorMsg == true ? "All Fields are mendatory" : ""} </p>
                    <Form>
                        <div className="form-group">
                            <label htmlFor="Email">Email</label>
                            <input
                            type="text"
                            className="form-control"
                            name="email"
                            onChange = { (e) => setEmail(e.target.value) }
                            placeholder="Email Address"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange = { (e) => setPassword(e.target.value) }
                            placeholder="Password"
                            />
                        </div>
                        <button onClick={HandleSubmit} type="submit" className="btn form-control">
                            Login
                        </button>
                        <Link to="/sign-up" > Sign Up  </Link>
                    </Form>
                    <p>login using the information provided in your email. </p>
                </div>
                </div>
                <div className="login-footer">
                <div className="f-logo">
                    <svg
                    width={21}
                    height={25}
                    viewBox="0 0 21 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M10.001 9.99988H5.00098V14.9999H10.001V9.99988Z"
                        fill="#F48039"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.99999 20.0001V15.0001H0V25.0001H4.99999H15.7971V20.0001H4.99999Z"
                        fill="#F48039"
                    />
                    <path d="M15.7971 0H0V4.99999H15.7971V0Z" fill="#F48039" />
                    <path
                        d="M20.7974 5.00012H15.7974V20.0001H20.7974V5.00012Z"
                        fill="#F48039"
                    />
                    </svg>
                </div>
                <span>© Copyright 2021 Doodle Inc.</span>
                </div>
            </div>
            </div>
            {/*ROW*/}
        </div>
        {/*Container*/}
    </section>

  );
}

export default Login;