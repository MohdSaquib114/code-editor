import Layout from "./components/Layout";
import { FileProvider } from "./components/Provider";



export default function App() {

  return (
    <FileProvider>
          <div className="h-screen">
              <Layout />
          </div>
    </FileProvider>
  )
}
