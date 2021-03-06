import type { GetStaticProps} from "next";
import Head from "next/head";
import Link from "next/link";
import axios from 'axios';
import React, { useEffect } from 'react';
import Layout from "../../components/Layout";


const Home  = (props:(any)  ) => {
  let menuItems = [];
  for (var i = 0; i < props.totalPaginateButton; i++) {
      menuItems.push( 
      <button className= { i == 0 ? "active page_id_" + (i+1) : "page_id_" + (i+1) } type="button" onClick={(e)=>customPagination(e,1)} >
          {
            i + 1 
          }
      </button> 
      );
  }

  function customPagination(e:any,_page_no:number) {

    let page = 1
    if(e.target !=undefined){ 
      document.getElementsByClassName('active')[0].classList.remove("active")
      e.target.classList.add("active")
      page = parseInt(e.target.innerHTML)  
    }
    let words:any = document.getElementsByClassName('trClass')

    const start = page * 10 - 10
    const end = page * 10 

    for (var i = 0; i < words.length; i++){
      if (i >= start && end >i ) {
        words[i].style.display= "table-row"
      } else {
        words[i].style.display= "none"
      }
    }
  }

  const searchData = (e: any)=>{
    let words:any = document.getElementsByClassName('trClass')
    let j = 0;

    for (var i = 0; i < words.length; i++){

      if(words[i].children[0].innerText.toLowerCase().includes(e.target.value.toLowerCase())){
        console.log(j)
        if (j >= 0 && 10 >j ) {
          words[i].style.display= "table-row"
        } 
        j++
      }else {
        words[i].style.display= "none"
      }
    }
  }

  const DeleteData =async(e: any,id:any,key:any)=>{
    let text = "Press a button!\nEither OK or Cancel.";
    if (confirm(text) == true) {
      

      await axios.delete(props.BACKEND_URL + '/admin/product/'+id).then((res) => {
        alert("Delete Successfully")
        e.target.parentElement.parentElement.remove()
        // cogoToast.success("Data Successfully inserted!");
      }).catch( error => {
        alert("Something went wrong")
        // cogoToast.error("Failed!"); 
      });

    } else {
      console.log(id)
    }
  }

  useEffect(() => {
    customPagination("" , 1)
  });

  return (
    <div className="admin">
      <Head>
        <title>LA SHOOPA</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h3>Product List</h3>

      <Link href="/admin/add-product" >
        <a>
          <button>Add Product</button>
        </a>
      </Link>

      <div>
        <input type="text" onChange={searchData} placeholder="Search Item..." style={{width: "18%"}} />
      </div>

        <table id="customers">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Variant</th>
                    <th>Quantity</th>
                    <th>Image</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
              {
                props?.data?.map((collection:any, key:number)=>

                <tr className={"trClass tr-no-" + key} key={key} >
                    <td>{collection.item}</td>
                    <td>{collection.price}</td>
                    <td>{collection.description}</td>
                    <td>{collection.variant}</td>
                    <td>{collection.qty}</td>
                    <td> <img src={props.BACKEND_URL + '/static/' + collection.image } width="150px" height="100px" /> </td>
                    
                    <td>
                      <Link href={"/admin/edit-product/" + collection._id} ><a><button>EDIT</button></a></Link>
                      <button onClick={(e)=>DeleteData(e,collection._id,key)} > DELETE </button>
                    </td>
                </tr>
                    
                )
              }
            </tbody>
        </table>

        {menuItems}


    </div>
  );
};

Home.getLayout = function getLayout(page: typeof Home) {
  return <Layout>{page}</Layout>;
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
