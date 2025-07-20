import React, { useEffect, useState } from 'react'
import axios from 'axios'
import GoalList from './Components/GoalList'
import AddGoalForm from './Components/AddGoalForm'
import Dashboard from './Components/DashBoard'



function App() {
  const [goals, setGoals]=useState([])

  //fetch goals on load
  useEffect(()=>{
    fetchGoals()
  }, []);

  const fetchGoals = async () => {
    try{
      const response = await axios.get ("http://localhost:3001/goals");
      setGoals(response.data);
    }catch(error){
      console.error("Error fetching goals:", error)
    }
  }

  const deleteGoal = async(id)=>{
    try {
      await axios.delete(`http://localhost:3001/goals/${id}` )
      fetchGoals()
    } catch (error) {
      console.error("Error deleting goal",error)
    }
  }
  return (
    <div className='app'>
      <h1>Smart Goal Planner</h1>
      <Dashboard/>
      <AddGoalForm onAddGoal = {fetchGoals}/>
      <GoalList
        goal={goals}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}/>
      
    </div>
  )
}

export default App