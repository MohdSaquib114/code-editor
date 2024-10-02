import Editor from "./Editor"
import Sidebar from "./Sidebar"

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <Editor />
    </div>
  )
}
