import { useEffect } from "react"
import Editor from "./Editor"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFileContext } from "../hooks/useFileContext";


export default function Layout() {

   
    const {saveChanges} = useFileContext()
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
         
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault(); 
            saveChanges();
            toast.success("Changes Save !")
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [saveChanges]);

      
  return (
    <div className="flex flex-col h-full ">
        <div>
           <Navbar />
        </div>
        <div className="flex grow ">
            <Sidebar />
            <Editor />
       </div>
       <ToastContainer />
    </div>
  )
}
