// React component logic
const Dashboard = ({ userType }) => {
    return (
        <div>
            {userType === 'buyer' && <BuyerDashboard />}
            {userType === 'administrator' && <AdminDashboard />}
        </div>
    );
};
