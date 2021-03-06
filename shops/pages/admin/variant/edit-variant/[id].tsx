import Head from "next/head";
import Link from "next/link";
import axios from 'axios';
import Layout from "../../../../components/Layout";
import cogoToast from "cogo-toast";

const EditProduct  = (props:any) => {

    const handleContactInfoSubmit = async(event:any)=>{
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }

        if (form.checkValidity() === true) {
          const data = new FormData(event.target);
    
          await axios.put(props.BACKEND_URL+"/admin/"+props.data[0]._id + "?type=variant", data).then((res) => {
            cogoToast.success("Data Successfully Updated!");
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

      <Link href="/admin/variant" >
        <a>
          <button>All Variant</button>
        </a>
      </Link>


      <div className="add-product">
        <form onSubmit={handleContactInfoSubmit} >
          <label >Item</label>
          <input type="text"  name="name" defaultValue={props.data[0].name} placeholder="Your name.." required />
        
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

  const results  = await axios.get(process.env.BACKEND_URL + '/admin/product/' + context.query.id+"?type=variant");
  const data = await results.data;

  return {
    props: {
      data,
      BACKEND_URL: process.env.BACKEND_URL,
    },
  };
};


export default EditProduct;
