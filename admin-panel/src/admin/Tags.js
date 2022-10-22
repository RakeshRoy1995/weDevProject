import axios from 'axios';
import cogoToast from 'cogo-toast';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

function Tags() {
    const [data, setdata] = useState([]);

    const fetchData = async()=>{
        axios.get('all-tags')
            .then(function (response) {

                console.log("response" , response);
                setdata(response.data)
            })
            .catch(function (error) {
                cogoToast.error(error.response.data.message , {position: 'top-right' });
        });
    }

    const deleteRow = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
        })
        
        swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
        }).then((result) => {
        if (result.value) {

            axios.delete('tags/'+id+'?type=tags', {
                id:id
                })
                .then(function (response) {
                    fetchData();
                    swalWithBootstrapButtons.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                        )
                })
                .catch(function (error) {
            });

            
        }
    
        if (result.dismiss === "cancel" ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
                )
        }
    
        })
    
      }


    useEffect(() => {
        fetchData()
    }, []);

  return (
    <>
    <Link to='/add-Tags' >Add Tags</Link>

    <table className="table">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            {
                data.map((d,k)=>
                
                <tr>
                <th scope="row">{k+1}</th>
                    <td>{d.tag}</td>
                    <td> <Link to={"edit-tag/"+d._id} className='btn btn-sm btn-success'>EDIT</Link> <button onClick={()=>deleteRow(d._id)}  type='button' className='btn btn-sm btn-danger'>DELETE</button> </td>
                </tr>

                )
            }
            

        </tbody>
    </table>

    </>
  );
}

export default Tags;