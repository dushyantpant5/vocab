"use client"
import { useState, useEffect } from "react";
interface UserDetails {
  username: string;
  email: string;
  // add other properties if available, like id, phone, etc.
}
export default function ProfilePage() {
  const [userDetails, setUserDetails]= useState<UserDetails| null>(null);
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
        } catch (err) {
          console.error(
            `Failed to fetch user Profile getting error
            ${err}`)
        } finally {
          setLoading(false);
        }
      };
    fetchUserDetails();
    }, []);

  return (
    <div>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
      <div className="flex flex-col items-center space-y-6 ">
        <div className="flex flex-col items-center">
          <div>
            <img
              src="https://i.ibb.co/Xxb9bKtw/Screenshot-626.png"
              className="w-34 h-34 rounded-full border-4 black-border"
            ></img>
          </div>
          <div className="text-xl font-bold">{userDetails?.username}</div>
          <div className="text-sm">{userDetails?.email}</div>
          <div className="text-sm">+917168901234</div>
        </div>
        <div className="flex flex-row space-x-4 border-2 p-3 rounded-md shadow-md">
          <div className="flex flex-col">
          <div className="text-xs">AVERAGE HOURS SPENT</div>
          <div className="text-lg font-bold">3.5 hrs</div>
          </div>
          <div className="flex flex-col">            
          <div className="text-xs">DAILY DASHBOARD <br/> WORD COUNT</div>
          <div className="text-lg font-bold">10 Words</div>
          </div>
          <div className="flex flex-col">            
          <div className="text-xs">
            TOTAL LEARNED <br /> WORDS <br/>LEARNED
          </div>
          <div className="text-lg font-bold">5 Words</div>
          </div>
          <div className="flex flex-col">            
          <div className="text-xs">AVERAGE WORDS <br/> LEARNED PER WEEK</div>
          <div className="text-lg font-bold">2 Words</div>
          </div>
          <div className="flex flex-col">            
          <div className="text-xs">AVERAGE WORDS <br/> LEARNED PER<br/> MONTH</div>
          <div className="text-lg font-bold">1 Word</div>

          </div>
        </div>
        <div className="flex flex-col border-2 p-2 rounded-md shadow-md">
            <div className="text-xl font-bold">Dashboard</div>
            <div>
            <img src="https://i.ibb.co/tPLR7XJm/Learning-Metrics-Over-Time-Chart.png" className="h-96"></img>
            </div>
        </div>
      </div>
      )
    }
    </div>
  );
}
