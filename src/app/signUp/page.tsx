"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [wordCount, setWordCount] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== cpassword) {
            setError("Passwords do not match");
            return;
        }
        console.log(JSON.stringify(error))
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username, email, password , phoneNumber, wordCount}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Invalid credentials");
            }

            router.push("/auth-callback?origin=dashboard"); // Redirect to the dashboard or any other page
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err instanceof Error) {
                    setError(err.message);  // Handle any errors
                } else {
                    setError("An unknown error occurred");
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Let’s get started!</h2>
                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            User Name
                        </label>
                        <input
                            type="text"
                            id="username"
                            required
                            placeholder="User Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="cpassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="cpassword"
                            required
                            placeholder="Confirm Password"
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="cpassword">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phonenumber"
                            required
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="cpassword">
                            Enter Number of Words you want to learn
                        </label>
                        <input
                            type="text"
                            id="number"
                            required
                            placeholder="Enter Number of words"
                            value={wordCount}
                            onChange={(e) => setWordCount(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already signed in.{" "}
                    <a href="/signIn" className="text-blue-600 hover:underline">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
