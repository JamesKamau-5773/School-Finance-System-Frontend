

const ProgressBar = ({ progress }) => {
  return (
    <div className="Progress-Bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
