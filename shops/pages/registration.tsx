import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import UserLayout from "../components/UserLayout";
import axios from "axios";
import React, { useEffect , useState } from 'react';
import { useDispatch } from 'react-redux'
import { userInfo } from '../store/actions'
import cogoToast from "cogo-toast";
import Router from 'next/router'

const Cart  = ({BACKEND_URL}:any)  => {
    const [msg, setMsg] = useState('');
    const handleContactInfoSubmit = async(event:any)=>{
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }
    
        if (form.checkValidity() === true) {
          const data = new FormData(event.target);
    
          await axios.post(BACKEND_URL+"/registration", data).then((res) => {
            localStorage.setItem("smallShoptoken", res.data.token)
            Router.push('/')
            
          })
          .catch(function (error) {
            if (error?.response?.data?.message) {
              setMsg(error.response.data.message)
            } 
          });
        }
    
      }

      const fetch = async()=>{
        if (localStorage.getItem("smallShoptoken")) {
          let post :any={}
          post.token  = localStorage.getItem("smallShoptoken")
          await axios.post(BACKEND_URL+"/check-auth", post).then((res) => {
            Router.push('/login')
          }).catch(function (error) {
            if (error.response.data.message == "Login Failed") {
              localStorage.removeItem("smallShoptoken")
            } 
          });
        }
      }

      useEffect(() => {
        fetch()
      }); 

  return (
    <div className={styles.container}>
      <Head>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com"  />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      <title>LA SHOOPA</title>
      <link rel="icon" href="/favicon.ico" />
      </Head>

        <div className="latest-product product section">
          <h3 style={{ textAlign: "center" }}> Registration </h3>
          <div className="main">
            
            <div className="add-product">
                <p id="registration_msg" style={{color:"red"}}>{msg}</p>
                <form onSubmit={handleContactInfoSubmit} >
                <label >Username</label>
                <input type="text"  name="username" placeholder="Your name.." required />

                <label >Email</label>
                <input type="email" name="email" placeholder="Email" required />

                <label >Password</label>
                <input type="password" name="password" placeholder="Password" required />

                <label >Your Address</label>
                <textarea name="address" placeholder="Address" required>
                </textarea>

                <label >Image</label>
                <input type="file" name="image"  required/>
                
                <input type="submit" value="Submit" />
                </form>
                <Link href="/login">
                  <a> Login </a>
                </Link>
            </div>

          </div>
        </div>
        
    </div>
  );
};

Cart.getLayout = function getLayout(page: typeof Cart) {

  return <UserLayout>{page}</UserLayout>;
};


export const getStaticProps: GetStaticProps = async (context) => {
  
  return {
    props: {
      BACKEND_URL: process.env.BACKEND_URL
    },
  };
};

export default Cart;