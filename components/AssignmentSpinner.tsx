type AssignmentSpinnerProps = {
  onSpin: () => void;
  isSpinning: boolean;
};

export function AssignmentSpinner({ onSpin, isSpinning }: AssignmentSpinnerProps) {
  return (
    <div className="spinner-console">
      <div className="spinner-lights" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => <i key={index} />)}
      </div>
      <button className="spin-button" type="button" onClick={onSpin} disabled={isSpinning}>
        <span className="button-topline">{isSpinning ? "CALCULATING SHAME" : "SLAM TO DETERMINE FATE"}</span>
        <span>{isSpinning ? "SPINNING..." : "SPIN THE BOYS"}</span>
      </button>
      <div className="spinner-lights bottom" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => <i key={index} />)}
      </div>
    </div>
  );
}
