import { getUserFromToken } from '@/lib/getUserFromToken';
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";

export default async function Home() {
	const user = await getUserFromToken();

	if (!user) {
	  // middleware missed edge case
	  return (
		<div className="flex items-center justify-center min-h-screen text-white">
		  Unauthorized
		</div>
	  );
	}

	const isAdmin = user?.isAdmin || false;

	return (
		<>
			<main className="min-h-screen bg-slate-50 dark:bg-neutral-900">
				{ isAdmin ? <AdminDashboard /> : <UserDashboard /> }
			</main>
		</>

	);
}
