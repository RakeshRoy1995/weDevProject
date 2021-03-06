import Head from "next/head";
import Link from "next/link";
import axios from 'axios';
import Layout from "../../../components/Layout";

const EditProduct  = (props:any) => {

    const handleContactInfoSubmit = async(event:any)=>{
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }

        if (form.checkValidity() === true) {
          const data = new FormData(event.target);
    
          await axios.put(props.BACKEND_URL+"/admin/"+props.data[0]._id, data).then((res) => {
            alert("Update Successfully")
            // cogoToast.success("Data Successfully inserted!");
          }).catch( error => {
            alert("Something went wrong")
            // cogoToast.error("Failed!"); 
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

      <Link href="/admin/" >
        <a>
          <button>Home</button>
        </a>
      </Link>


      <div className="add-product">
        <form onSubmit={handleContactInfoSubmit} >
          <label >Item</label>
          <input type="text"  name="item" defaultValue={props.data[0].item} placeholder="Your name.." required />

          <label >Price</label>
          <input type="number" name="price" defaultValue={props.data[0].price} placeholder="Price" required />

          <label >Description</label>
          <textarea name="description" defaultValue={props.data[0].description} placeholder="Description" required>
          </textarea>

          <label >Variant</label>
          <select name="variant" defaultValue={props.data[0].variant}>
            {
              props.variants.map((collection:any,key:any)=>
                  <option key={key} value={collection.name}>{collection.name}</option>
              )
            }
            
          </select>
          
          <label >Quantity</label>
          <input type="number" defaultValue={props.data[0].qty} name="qty" placeholder="Your name.." required />

          <label >Image</label>
          <input type="file" name="image" />
        
          <input type="submit" value="Submit" />
        </form>
      </div>

        
    </div>
  );
};

EditProduct.getLayout = function getLayout(page: typeof EditProduct) {
  return <Layout>{page}</Layout>;
};



export const getServerSideProps: any = async (context:any) => {

  const results  = await axios.get(process.env.BACKEND_URL + '/admin/product/' + context.query.id);
  const data =  results.data;

  const res  = await axios.get(process.env.BACKEND_URL + '/admin/get-all-product?type=variant');
  const variants =  res.data;

  return {
    props: {
      data,
      variants,
      BACKEND_URL: process.env.BACKEND_URL,
    },
  };
};


export default EditProduct;
