import { FileProvider } from "./components/provider";
import Sidebar from "./components/Sidebar";


export default function App() {

  return (
    <FileProvider>

    <div>
      <Sidebar />
  
    </div>
    </FileProvider>
  )
}
