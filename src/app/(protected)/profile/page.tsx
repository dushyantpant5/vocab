"use client";
import { useState, useEffect } from "react";
interface UserDetails {
  username: string;
  email: string;
  phonenumber: string;
  dailywordcount: string;
  // add other properties if available, like id, phone, etc.
}
export default function ProfilePage() {
  const [editDetails, setEditDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [learnedWordsCount, setLearnedWordsCount] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [dailywordcount, setDailywordcount] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getUserProfile`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUserDetails(data);

        // api call for fetching count of learned words
        const wordRes = await fetch("/api/words/getLearnedWordCount", {
          method: "GET",
          credentials: "include",
        });
        const learnedWordCount = await wordRes.json();
        setLearnedWordsCount(learnedWordCount.learnedWordsCount);
      } catch (err) {
        console.error(
          `Failed to fetch user Profile getting error
            ${err}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [learnedWordsCount]);

  const handleProfile = () => {
    setEditDetails(!editDetails);
  };
  const setProfileData = async () => {
    try {
      const response = await fetch("/api/user/editUserProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ phonenumber, dailywordcount }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("data");
        setEditDetails(true);
      }
      else {
        throw new Error(
          data.error ||
            "Please Enter 10 digit phone number or Please Enter word count between 1 to 20"
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err instanceof Error) {
          console.error(err); // ✅ This logs full error stack + message
          console.log(err);
          setError(err.message); // Handle any errors
        } else {
          setError("An unknown error occurred");
        }
      }
    }
  };

  return (
    <div
      className="bg-gradient-to-r from-violet-200 to-pink-200 p-8 rounded-md mx-0 my-0 
"
    >
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : editDetails ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Edit Details
            </h2>
            <form className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Enter Phone Number
                </label>
                <input
                  type="text"
                  id="phonenumber"
                  required
                  placeholder="Enter 10 digit Registered Phone number"
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Enter Number of Words you want to learn
                </label>
                <input
                  type="text"
                  id="dailywords"
                  required
                  placeholder="Enter No of Words"
                  value={dailywordcount}
                  onChange={(e) => setDailywordcount(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">Please Check Your Phone Number and Word Count</p>
              )}
              <div>
                <button
                  onClick={setProfileData}
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 -mx-2.5  ">
          <div className="flex flex-col items-center">
            <div>
              <img
                src="https://i.ibb.co/Xxb9bKtw/Screenshot-626.png"
                className="w-38 h-38 rounded-full border-4 black-border"
              ></img>
            </div>
            <div
              onClick={handleProfile}
              className="text-xl border-2 border-white p-2 rounded-md font-bold bg-black text-white"
            >
              Edit 📝
            </div>

            <div className="text-2xl font-bold">{userDetails?.username}</div>
            <div className="text-sm">{userDetails?.email}</div>
            <div className="text-sm">{userDetails?.phonenumber}</div>
          </div>
          <div className="flex flex-row space-x-6 border-2 p-3 rounded-md shadow-md backdrop-blur-md">
            <div className="flex flex-col">
              <div className="text-xs">AVERAGE HOURS SPENT</div>
              <div className="text-lg font-bold">3.5 hrs</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs">
                DAILY DASHBOARD <br /> WORD COUNT
              </div>
              <div className="text-lg font-bold">
                {userDetails?.dailywordcount} Words
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs">
                TOTAL LEARNED <br /> WORDS <br />
                LEARNED
              </div>
              <div className="text-lg font-bold">{learnedWordsCount} Words</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs">
                AVERAGE WORDS <br /> LEARNED PER WEEK
              </div>
              <div className="text-lg font-bold">2 Words</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs">
                AVERAGE WORDS <br /> LEARNED PER
                <br /> MONTH
              </div>
              <div className="text-lg font-bold">1 Word</div>
            </div>
          </div>
          <div className="flex flex-col border-2 p-3 rounded-md shadow-md backdrop-blur-md">
            <div className="text-xl font-bold">Dashboard</div>
            <div className="my-4">
              <img
                src="https://i.ibb.co/tPLR7XJm/Learning-Metrics-Over-Time-Chart.png"
                className="h-102"
              ></img>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
