import { useSelector } from "react-redux";

export default function Feedback() {
  const feedback = useSelector(({ feedback }) => feedback);

  if (feedback) {
    const [msg, err = false] = feedback;
    return <p className={err ? "error" : "feedback"}>{msg}</p>;
  }
  return <p className="feedback">No Feedback...</p>
}

