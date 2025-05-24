'use client'

import { useState, useEffect, useRef } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { User, Edit2 } from "lucide-react";


interface ProfilePictureProps {
    profileUrl?: string;
}

export default function ProfilePicture({ profileUrl }: ProfilePictureProps) {
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(profileUrl);
    const [profilePictureUpdating, setProfilePictureUpdating] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreviewUrl(profileUrl);
    }, [profileUrl]);

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        setProfilePictureUpdating(true);
        const [file] = event.target.files ?? [];
        if (!file) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append("profilePictureFile", file);
            const response = await fetch("/api/user/editUserProfilePicture", {
                method: "PATCH",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to update profile picture");
            }
            const data = await response.json();
            setPreviewUrl(data.profilePictureUrl);
        }
        catch (error) {
            console.error("Error updating profile picture", error);
        }
        finally {
            setProfilePictureUpdating(false);
        }
    }

    function onEditClick() {
        fileInputRef.current?.click();
    }

    return (
        <div className="relative w-36 h-36">
            <Avatar className="w-36 h-36 border-4 border-blue-600">
                <AvatarImage
                    src={previewUrl}
                    alt="Profile Picture"
                    className={`object-cover ${profilePictureUpdating ? "opacity-50" : ""}`}
                />
                <AvatarFallback className="bg-white text-blue-900">
                    <User className="w-6 h-6" />
                </AvatarFallback>
            </Avatar>

            <button
                type="button"
                aria-label="Edit Profile Picture"
                onClick={onEditClick}
                className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full shadow-lg transition hover:cursor-pointer"
            >
                <Edit2 className="w-5 h-5" />
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile picture"
            />
        </div>
    );
}
