import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthContext, useAuthContextType } from "../../context/AuthContext";
import Tiptap from "../Editor";
import InputErrorMessage from "../Utils/InputErrorMessage";
import TostMessage from "../Utils/TostMessage";

type values_type = {
  description?: string;
};

function ticket_validation(values: values_type) {
  const errors: values_type = {};

  if (!values.description) {
    errors.description = "Description is required";
  } else if (values.description.length < 20) {
    errors.description = "Please explain your issue a bit more";
  }

  return errors;
}
interface PostReplyProps{
    id:string;
    close:any;
    replyAdded:any;
}


const PostReply: React.FC<any> = ({id,close,replyAdded})=> {
  const { data: session } = useSession<any>();
  const { state, dispatch }: useAuthContextType = useAuthContext();
  const [content,setContent] = useState('');
  const [loading,setLoading] = useState(false);

  

  const addReply = (values:any)=>{

    setLoading(true);

    fetch( `/api/replies/new`, {
        method: 'POST',
        body: JSON.stringify({...values,ticketId:id}),
    } ) // wrapped
    .then( res => res.json() )
    .then( data => {
      console.log(data);
      if(data.reply){

        //clear react query cache
        //close this popup
        replyAdded(data.reply);
        TostMessage("Successfully created", "success");
        close();
      }else{
        TostMessage("Some error orrcured", "error");
      }
      setLoading(false);
    })
    .catch( err => {
        console.log(err);
        TostMessage("Some error orrcured", "error");
        setLoading(false);
    });
  }
  const formik = useFormik({
    initialValues: {
      description: "",
      privacy:false
    },
    onSubmit: addReply,
    validate: ticket_validation,
  });
  
  useEffect(() => {
    console.log("state ", state.user?._id);
  }, [state]);

  


  return (
    <div className="container py-6 bg-slate-100">
      {session ? (
        <>
        <div className="w-full flex flex-col gap-2 p-2">
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-4 md:space-y-6"
                action="#"
              >
				
                <Tiptap content=''  {...formik.getFieldProps("description")} onChange={(editorHTML:string)=>{
					formik.setFieldValue('description',editorHTML);
				}}
                name="description"/>
                    <InputErrorMessage
                touched={formik.touched.description}
                error={formik.errors.description}
                />
                <div className="flex items-center mb-4 gap-2 ">
                    <input  {...formik.getFieldProps("privacy")} id="private-reply" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="private-reply" className="ms-2 text-sm font-medium cursor-pointer select-none">Private Reply</label>
                </div>
                <div className="bg-slate-100  flex justify-between items-center">
                    <button type="submit" disabled={loading} className="btn">
                    Post
                    </button>
                    <button type="button" onClick={()=>{close()}} className="btn active">
                    Cancel
                    </button>
                </div>
              </form>
          </div>
        </>
      ) : (
        <div className="flex gap-5 p-5 text-xl text-blue-500">
          <small>Please signin, first!</small>

          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </div>
      )}
    </div>
  )
}
export default PostReply;