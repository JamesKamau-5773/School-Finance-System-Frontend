
import GoalItem from "./GoalItem";

const GoalList = ({ goal, onEdit, onDelete }) => {
  return (
    <div className="goal-list">
      {GoalList.map((goal) => {
        <GoalItem
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
        />;
      })}
    </div>
  );
};

export default GoalList;
