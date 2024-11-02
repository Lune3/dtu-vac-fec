import { Header } from "./components/Header";
import { useState } from "react";

function App() {
  const [courseName,setCourseName] = useState<string>("");
  const [comments,setComments] = useState<object>();
  return (
    <>
      <Header setCourseName={setCourseName} courseName={courseName} setComments = {setComments}/>
    </>
  )
}

export default App
