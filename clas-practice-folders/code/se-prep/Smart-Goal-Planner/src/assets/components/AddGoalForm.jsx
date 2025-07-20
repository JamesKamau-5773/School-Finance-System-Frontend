
import { useState } from 'react'
import axios from 'axios'


const AddGoalForm = ({onAddGoal}) => {
  const[formData, setFormData]=useState({
    name: "" ,
    targetAmount:"" ,
    category:"savings",
    deadline:""
  })

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      await axios.post("http://localhost:3001/goals", formData)
      onAddGoal()
      setFormData()
    }catch(error){
      console.error("error sdding goal", error)

    }
  }


  
  return (
    <div>
      <form onSubmit={handleSubmit}/>
      
    </div>
  )
}

export default AddGoalForm