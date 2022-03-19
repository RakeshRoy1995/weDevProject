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

const MyOrder  = ({BACKEND_URL}:any)  => {
  const [data, setData] = useState([])
    const cart = useSelector((state:any) => state.cart)

    const fetchData =async () => {

      let post :any={}
      post.token  = localStorage.getItem("smallShoptoken")
      await axios.post(BACKEND_URL+"/user-order", post).then((res) => {
        // localStorage.setItem("smallShoptoken", res.data.token)
        // Router.push('/')
        setData(res.data)
      }).catch( error => {

      });
    }

    useEffect(() => {
      fetchData()
    },[]);

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
          <div className="main">
            {(() => {
                if (data.length) {
                    return (
                      <div className="row">
                      

                      {
                                data.map((collection:any,key:any)=>
                                
                                <div key={key} className="column">
                                  {key+1}.

                                    {
                                      collection.map((info:any,key_:any)=>
                                      <ul key={key_}>
                                      {(() => {
                                        
                                        if (info) {
                                          return(
                                            <>
                                            <li>
                                             {info?.order?.status}
                                            </li>

                                            <li>
                                               {info?.under_order?.item}
                                            </li>

                                            <li>
                                               {info?.under_order?.description}
                                            </li>

                                            <li>
                                               {info?.under_order?.price} BDT
                                            </li>

                                            <li>
                                               {info?.under_order?.variant}
                                            </li>
                                            <hr />
                                            </>
                                          )
                                        }
                                      })()}

                                      
                                      </ul>
                                      
                                      
                                      )
                                    }
                                  </div>
                                
                                )
                              }
                      
                      
                      </div>  
                    )
                } 
            })()}
          </div>
        </div>
        
    </div>
  );
};

MyOrder.getLayout = function getLayout(page: typeof MyOrder) {
  return <UserLayout>{page}</UserLayout>;
};


export const getStaticProps: GetStaticProps = async (context) => {

  return {
    props: {
      BACKEND_URL: process.env.BACKEND_URL
    },
  };
};

export default MyOrder;