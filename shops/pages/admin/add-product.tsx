import Head from "next/head";
import React from 'react';
import type { GetStaticProps} from "next";
import axios from 'axios';
import Layout from "../../components/Layout";
import cogoToast from "cogo-toast";

const AddProduct  = ({variants ,BACKEND_URL}:any)  => {

  const handleContactInfoSubmit = async(event:any)=>{
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    if (form.checkValidity() === true) {
      const data = new FormData(event.target);

      await axios.post(BACKEND_URL+"/admin/product-create", data).then((res) => {
        
        cogoToast.success("Data Successfully inserted!");
      }).catch( error => {
        
        cogoToast.error("Failed!"); 
      });
    }

  }

  return (
    <div className="admin">
      <Head>
        <title>LA SHOOPA</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      

      <p>Add Product</p>

      <div className="add-product">
        <form onSubmit={handleContactInfoSubmit} >
          <label >Item</label>
          <input type="text"  name="item" placeholder="Your name.." required />

          <label >Price</label>
          <input type="number" name="price" placeholder="Price" required />

          <label >Description</label>
          <textarea name="description" placeholder="Description" required>
          </textarea>

          <label >Variant</label>
          <select name="variant">
            {
              variants.map((collection:any,key:any)=>
                  <option key={key} value={collection.name}>{collection.name}</option>
              )
            }
            
          </select>

          <label >Quantity</label>
          <input type="number" name="qty" placeholder="Quantity" required />
          

          <label >Image</label>
          <input type="file" name="image"  required/>
        
          <input type="submit" value="Submit" />
        </form>
      </div>
      
    </div>
  );
};

AddProduct.getLayout = function getLayout(page: typeof AddProduct) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const res  = await axios.get(process.env.BACKEND_URL + '/admin/get-all-product?type=variant');
  const variants =  res.data;
  return {
    props: {
      variants,
      BACKEND_URL:  process.env.BACKEND_URL,
    },
  };
};


export default AddProduct;