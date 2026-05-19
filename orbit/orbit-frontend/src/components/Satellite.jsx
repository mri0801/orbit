import { useNavigate } from "react-router-dom";
import "./Satellite.css";

function Satellite({ satellite, index }) {
  const navigate = useNavigate();

  const angle = (index / 10) * 360;

  return (
    <div
      className="orbit"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div
        className="satellite"
        onClick={() => navigate(`/satellite/${satellite._id}`)}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3212/3212608.png"
          alt={satellite.name}
        />
        <span>{satellite.name}</span>
      </div>
    </div>
  );
}

export default Satellite;