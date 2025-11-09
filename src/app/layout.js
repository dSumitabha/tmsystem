import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';
import { AssignUserProvider } from "@/context/AssignUserContext";
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Task Managemenet System",
  description: "Created by Sumitabha Dandapat",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AssignUserProvider>
					<AuthProvider>
					<Header />
							{children}
						<Footer />
					<Toaster position="top-center" />
					</AuthProvider>
				</AssignUserProvider>
			</body>
		</html>
	);
}
