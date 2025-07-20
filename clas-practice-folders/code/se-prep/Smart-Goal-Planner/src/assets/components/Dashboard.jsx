

const Dashboard = ({goals}) => {

  {/*calculate all statistics*/}
  const totalGoals=goals.length
  const totalSaved = goals.reduce((sum,goal)=>{
    sum + goal.savedAmount,0
  })
  const totalTarget = goals.reduce((sum, goal)=>{
    sum + goal.targetAmount,0
  })
  const CompletedGoals = goals.filter((goal)=>{
    goal.savedAmount >=goal.targetAmount
  }).length
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved/totalTarget)*100): 0

  {/*calculate deadlines*/}
  const today = new Date()
  const overDueGoals = goals.filter((goal)=>{
    const deadline = new Date(goal.deadline)
    return deadline < today && goal.savedAmount< goal.targetAmount
  })

  const dueSoonGoals = goals.filter((goal)=>{
    const deadline = new Date(goal.deadline)
    const daysLeft = Math.ceil((deadline-today)/(1000*60*60*24))
    return daysLeft <= 30 && daysLeft > 0 && goal.savedAmount < goal.targetAmount
  })


  return (
    <div className='Dashboard'>
      <h2>Your Savings Overview</h2>

      //statistcis cards
      <div className='starts-grid'>
        <div className='start-card'>
        <h3>Total Goals</h3>
        <p>{totalGoals}</p>
        </div>

        <div className='start-card'>
          <h3>completed</h3>
          <p>${totalSaved.toLocaleString()}</p>

        </div>
      </div>

    </div>
  )
}

export default Dashboard