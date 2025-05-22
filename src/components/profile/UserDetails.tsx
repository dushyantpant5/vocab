'use client'

interface IUserDetailsProps {
    userDetails: {
        username: string;
        email: string;
        phonenumber: string;
        dailywordcount: string;
        profileurl: string;
    }
}

export default function UserDetails({ userDetails }: IUserDetailsProps) {

    return (
        <>
            <div className="text-2xl font-bold text-blue-900">
                {userDetails?.username}
            </div>
            <div className="text-sm text-blue-700">{userDetails?.email}</div>
            <div className="text-sm text-blue-700">
                {userDetails?.phonenumber}
            </div>
        </>)
}
