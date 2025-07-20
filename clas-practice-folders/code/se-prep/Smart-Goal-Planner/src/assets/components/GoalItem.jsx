
import ProgressBar from "./ProgressBar"

const GoalItem = ({ goal, onEdit, onDelete, onDeposit }) => {

  {/* progress calculation*/}
  const progress = math.round((goal.savedAAmount / goal.targetAmount) * 100); 
  
  return (
    <div className="goal-item">
      <h3>{goal.name}</h3>
      <P>Target Amount: ${goal.targetAmount}</P>
      <p>saved Amount: ${goal.savedAmount}</p>
      <progressBar progress={progress} />
      <div className="goal-actions">
        <button onClick={() => onEdit(goal)}>Edit</button>
        <button
          onClick={() => {
            onDelete(goal.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalItem;
