import { useFormik } from "formik";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Tiptap from "../../../components/Editor";
import InputErrorMessage from "../../../components/Utils/InputErrorMessage";
import TostMessage from "../../../components/Utils/TostMessage";
import { useAuthContext, useAuthContextType } from "../../../context/AuthContext";

type values_type = {
  title?: string;
  description?: string;
};

function ticket_validation(values: values_type) {
  const errors: values_type = {};

  if (!values.title) {
    errors.title = "Title is Required!";
  }else if (values.title.length < 5) {
    errors.title = "Title is just too short";
  }

  if (!values.description) {
    errors.description = "Description is required";
  } else if (values.description.length < 20) {
    errors.description = "Please explain your issue a bit more";
  }

  return errors;
}



export default function NewTicket() {
  const router = useRouter();
  const { data: session } = useSession<any>();
  const { state }: useAuthContextType = useAuthContext();
  const [loading,setLoading] = useState(false);
  function signOutHandle() {
    signOut();
  }
  const addTicket = (values:any)=>{

    setLoading(true);

    fetch( `/api/tickets/new`, {
        method: 'POST',
        body: JSON.stringify(values),
    } ) // wrapped
    .then( res => res.json() )
    .then( data => {
      console.log(data);
      if(data.ticket){
        TostMessage("Successfully created", "success");
        setTimeout(()=>{
          router.push('/ticket/'+data?.ticket?.ticketId);
        },1500);
      }else{
        TostMessage("Some error orrcured", "error");
      }
      setLoading(false);
    })
    .catch( err => {
        setLoading(false);
    });
  }
  const formik = useFormik({
    initialValues: {
      title: "",
      description: ""
    },
    onSubmit: addTicket,
    validate: ticket_validation,
  });
  
  useEffect(() => {
    console.log("state ", state.user?._id);
  }, [state]);

  


  return (
    <div className="container p-6">
      {session ? (
        <>
        <div className="w-full flex flex-col gap-2">
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-4 md:space-y-6"
                action="#"
              >

                <input type="text" {...formik.getFieldProps("title")}
                    name="title" placeholder="Ticket title" className="p-2 text-2xl border rounded-md w-full my-4"/>
                 <InputErrorMessage
                    touched={formik.touched.title}
                    error={formik.errors.title}
                  />
				
                <Tiptap content='Ticket description' {...formik.getFieldProps("description")} onChange={(editorHTML:string)=>{
					formik.setFieldValue('description',editorHTML);
				}}
                    name="description"/>
                     <InputErrorMessage
                    touched={formik.touched.description}
                    error={formik.errors.description}
                    />
                  <button type="submit" disabled={loading} className="btn">
                  Create ticket
                </button>
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
