import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import UserLayout from "../components/UserLayout";
import axios from "axios";
import React, { useEffect , useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { cartInfo } from '../store/actions'
import Router from 'next/router'

const Cart  = ({BACKEND_URL}:any)  => {
    const [msg, setMsg] = useState('');
    const cart = useSelector((state:any) => state.cart)
    const dispatch = useDispatch()
    let total =0
    
    const DeleteData = async(key:number)=>{
      let data = cart.map((collection:any,key_:any)=>{
          if(key_ != key){
              return collection
          }
      })
      dispatch(cartInfo(data))
    }

    const BuyNow =async () => {
      if (localStorage.getItem("smallShoptoken")) {
        let post:any = {}
        post.p_key = localStorage.getItem("smallShoptoken")
        post.data = JSON.stringify(cart)
        await axios.post(BACKEND_URL+"/order_product", post).then((res) => {
          Router.push('/my-order')
        }).catch(function (error) {
          if (error.response) {
            setMsg(`Sorry! This Product (${error.response.data.item})  is out of stock now  `)
          } 
        });
        
      } else {
        Router.push('/registration')
      }
    }

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
          <h3 style={{ textAlign: "center" }}> Cart </h3>
          <p style={{color:"red"}}>{msg}</p>
          <div className="main">
            {(() => {
                if (cart.length) {
                    return (
                        <>

                        <table id="customers" width="100%" style={{border : "1px solid black"}}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Variant</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                cart?.map((collection:any, key:number)=>

                                <>
                                {(() => {
                                    if (collection) {
                                        total += parseInt(collection.price) 
                                    return(
                                        <tr>
                                            <td>{collection.item}</td>
                                            <td>{collection.price}</td>
                                            <td>{collection.description}</td>
                                            <td>{collection.variant}</td>
                                            <td> <img src={BACKEND_URL + '/static/' + collection.image } width="150px" height="100px" /> </td>
                                            
                                            <td>
                                            <button onClick={(e)=>DeleteData(key)} > Remove </button>
                                            </td>
                                        </tr>
                                    )
                                    }
                                })()}
                                </>
                                )
                            }

                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Total Iteam : {cart.length}</td>
                                <td>Total cost : {total}</td>
                                <td> <button onClick={BuyNow}>Buy Now</button> </td>
                              </tr>
                            </tbody>
                        </table>
                        
                        
                        </>
                    )
                } 
            })()}
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