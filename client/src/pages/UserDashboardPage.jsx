import UserDashboard from "../features/user/userDashboard";
import { Link } from "react-router-dom";

const UserDashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl text-center font-bold p-4">Dashboard</h1>
      <UserDashboard />
    </div>
  );
};

export default UserDashboardPage;
