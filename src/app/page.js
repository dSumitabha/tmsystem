
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

export default function Home() {
	const isAdmin = false;


	return (
		<>
			<main className="min-h-screen bg-neutral-900">
				{ isAdmin ? <AdminDashboard /> : <UserDashboard /> }
			</main>
		</>

	);
}
