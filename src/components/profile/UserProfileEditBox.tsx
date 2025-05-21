'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { UserDetails } from "@/app/(protected)/profile/page";
import { toast } from 'sonner';
import { Loader } from "lucide-react";

interface IPatchUserDetails {
    phonenumber?: string;
    dailywordcount?: string;
}


export default function UserProfileEditBox({ phoneNumber, dailyWordCount, setIsEditing, setUserDetails }: {
    phoneNumber: string
    dailyWordCount: string
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}) {

    const [patchUserDetailsData, setPatchUserDetailsData] = useState<IPatchUserDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPatchUserDetailsData({
            phonenumber: phoneNumber,
            dailywordcount: dailyWordCount,
        });
    }, [phoneNumber, dailyWordCount]);

    const handleCardClose = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("phonenumber", patchUserDetailsData?.phonenumber ?? "");
        formData.append("dailywordcount", patchUserDetailsData?.dailywordcount ?? "");
        try {
            const res = await fetch("/api/user/editUserProfile", {
                method: "PATCH",
                body: formData,
                credentials: "include",
            });
            const data = await res.json();
            if (res.status === 200) {
                toast.success("Profile updated successfully");

                setUserDetails((prevState) => {
                    if (!prevState) return prevState;
                    return {
                        ...prevState,
                        phonenumber: patchUserDetailsData?.phonenumber ?? "",
                        dailywordcount: patchUserDetailsData?.dailywordcount ?? "",
                    };
                });

            } else {
                toast.error(`Error: ${data.error || "Unknown error occurred"}`);
            }
        } catch (error) {
            toast.error(String(error) || "Something went wrong while updating your profile");
        }
        finally {
            setLoading(false);
            setIsEditing(false);
        }
    };


    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <Card className="w-full max-w-md mt-4 bg-white shadow-xl border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <Input
                                type="text"
                                placeholder="Enter phone number"
                                value={patchUserDetailsData?.phonenumber ?? ""}
                                onChange={(event) =>
                                    setPatchUserDetailsData((prevState) => ({
                                        ...prevState,
                                        phonenumber: event.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Daily Word Count</label>
                            <Input
                                type="number"
                                placeholder="Enter daily word count"
                                value={patchUserDetailsData?.dailywordcount ?? ""}
                                onChange={(event) =>
                                    setPatchUserDetailsData((prevState) => ({
                                        ...prevState,
                                        dailywordcount: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button className="hover:cursor-pointer" variant="outline" onClick={handleCardClose} >Cancel</Button>
                        <Button className="hover:cursor-pointer" onClick={handleSave} >Save</Button>
                    </CardFooter>
                </Card>
            )}
        </>
    );
}


