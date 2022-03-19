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


let addToCart: any = []
const Home  = ({data ,BACKEND_URL , totalPaginateButton}:any)  => {
  const dispatch = useDispatch()
  
  const AddCart =async (params:any) => {
    addToCart.push(params) 
    dispatch(cartInfo(addToCart))
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
          <h3 style={{ textAlign: "center" }}> PRODUCTS</h3>
          <div className="main">
            <div className="inner-content">
              {
                data.map((collection:any,key:number)=>
                
                <div className="column" key={key}>
                  <img src={BACKEND_URL + '/static/' + collection.image } width="150px" height="100px" />
                  <p>{collection.item }</p>
                  <p>{collection.description }</p>
                  <p>{collection.variant }</p>
                  <p>
                    <strong>
                      { collection.price } BDT
                    </strong>
                  </p>
                  {
                    collection.qty == "0" ? "Stock Out" : <button onClick={()=>AddCart(collection)}>Add to cart</button>
                  }
                  
                </div>
                )
              }
            </div>
          </div>
        </div>
        
    </div>
  );
};

Home.getLayout = function getLayout(page: typeof Home) {

  return <UserLayout>{page}</UserLayout>;
};


export const getStaticProps: GetStaticProps = async (context) => {
  const results  = await axios.get(process.env.BACKEND_URL + '/admin/get-all-product');
  const totalPaginateButton =  Math.trunc( parseInt(results.data.length) /10) + 1

  return {
    props: {
      data:  results.data,
      BACKEND_URL: process.env.BACKEND_URL,
      totalPaginateButton
    },
  };
};

export default Home;