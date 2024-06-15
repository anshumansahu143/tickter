import {
  faChevronDown,
  faRemove,
  faSearch,
  faSignOut,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import debounce from 'debounce';
import Ticket from "../Ticket/ticket";



const Header = () => {


  
  const [loading,setLoading] = useState(false);
  const [search,setSearch] = useState('');
  const [results,setResults] = useState([]);
  const debouceRequest = useCallback((value:string) => request(value), []);

  const [admin, set_admin] = useState({
    logo: "/logo.png",
    whatsapp: "",
    show_withdraw: "",
    show_admin_link: "",
  });


  const onChange = (e:any) => {
    debouceRequest(e.target.value);
    setSearch(e.target.value); // Remove this line will lead to normal denounce
  };
  const request = debounce(value => {
    getData(value);
  }, 500);

  const getData = (search:string)=>{
    if(search?.length>3){
      setLoading(true);
      setResults([]);
      fetch('/api/tickets/search',{
        method: 'POST',
        body:JSON.stringify({'search':search})
      })
      .then((res)=>res.json())
      .then((res)=>{
        if(res?.items?.length){
          setResults(res.items);
        }
        
        setLoading(false);
      });
    }
  }



  const { data: session } = useSession<any>();

  function signOutHandle() {
    signOut();
  }

  let [show_search, set_show_search] = useState(false);

  const [open_profile_opt, set_opo] = useState(false);

  function searchToggle() {}

  return (
    <header className="h-[90px] border shadow sticky top-0 inset-x-0 bg-white mx-auto z-50">
      <div className="container h-full flex items-center relative justify-between">
        <Link href="/" className="h-full flex items-center">
          <img className="lg:w-[150px] sm:w-[75px]" src={admin?.logo} alt="" />
        </Link>

        <div
          className={` ${
            show_search ? "scale-y-100" : "scale-y-0"
          } relative search_bar w-80 sm:w-[500px] 2xl:w-[600px] transition-transform lg:scale-y-100 absolute lg:relative left-5 sm:left-0 top-[72px] lg:top-0 items-center justify-center h-10 transform origin-top`}
        >
          <input
            type="search"
            placeholder="Search..."
            className="h-full px-3 w-full rounded border-2 border-green-primary text-green-primary focus:ring focus:border-transparent"
            onChange={onChange}
          />
          
            {
              search?.length?
              <div className="absolute top-[100%] p-4 bg-white  w-full shadow-lg rounded-lg border max-h-[80vh] overflow-y-auto">
              {
                results?.length?
                results.map((result:any)=>{
                  return <Ticket ticket={result} key={result._id}/>
                })
                :loading?<div className="flex flex-col gap-2 m-4">
                <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
                <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
                <Skeleton className="w-full h-[25px] rounded-full"></Skeleton>
          
                </div>:<div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
                  <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                  <p>No tickets found!</p>
                </div>
              }
              </div>
              :''
            }
          
        </div>

        <div className="flex items-center justify-center gap-x-3 sm:gap-x-4">
          <button
            onClick={searchToggle}
            className="lg:hidden text-sm transition-all font-medium bg-transparent border border-dark-primary text-dark-primary hover:border-transparent hover:bg-dark-primary hover:text-white w-8 sm:w-10 h-8 sm:h-10 items-center justify-center rounded-full focus:ring-2 focus:border-transparent focus:ring-dark-primary  md:flex"
          >
            {show_search ? (
              <FontAwesomeIcon icon={faRemove} />
            ) : (
              <FontAwesomeIcon icon={faSearch} />
            )}
          </button>

          {session?(
            <div className="relative w-fit z-50">
              <button
                onClick={() => set_opo((p) => !p)}
                onBlur={() =>
                  setTimeout(() => {
                    set_opo(false);
                  }, 500)
                }
                type="button"
                className={`w-full py-2 px-3 rounded bg-gray-100 shadow border flex items-center justify-center gap-x-3`}
              >
                <span className={`text-slate-700`}> {session?.user?.name} </span>

                <img
                  className="h-8 w-8 rounded-full"
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt=""
                />
                <FontAwesomeIcon
                  className={`text-sm text-gray-500 transition-all transform ${
                    open_profile_opt ? "rotate-180" : "rotate-0"
                  }`}
                  icon={faChevronDown}
                />
              </button>

              <div
                className={`absolute w-full bg-white rounded shadow top-full right-0 transition-all origin-top transform ${
                  open_profile_opt ? "scale-y-100" : "scale-y-0"
                }`}
              >
                <Link
                  href="/my-tickets"
                  className="flex items-center gap-x-2 w-full hover:bg-gray-100 p-3"
                >
                  <>
                    <FontAwesomeIcon
                      className="text-base text-gray-500"
                      icon={faUser}
                    />
                    <span className="text-sm font-medium">My tickets</span>
                  </>
                </Link>
                

                <button
                  onClick={signOutHandle}
                  className="flex items-center gap-x-2 w-full  hover:bg-gray-100 p-3"
                >
                  <FontAwesomeIcon
                    className="text-base text-gray-500"
                    icon={faSignOut}
                  />
                  <span className="text-sm font-medium">Logout</span>
                  {false && (
                    <span className="block w-4 h-4 border border-black rounded-full border-t-transparent animate-spin ml-auto" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
            <Link href="/login"><button className="btn" type="button"><span>Login</span></button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
