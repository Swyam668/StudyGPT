import React, { useState, useEffect } from "react";
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { User, Mail, Lock } from 'lucide-react';

const ProfilePage = () => {

    const [loading, setLoading] = useState(true);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await authService.getProfile();
                setUsername(data.username);
                setEmail(data.email);
            } catch (error) {
                toast.error('Failed to fetch Profile data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Passwords must be at least 6 characters long.');
            return;
        }
        setPasswordLoading(true);
        try {
            await authService.changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully!');
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error) {
            toast.error(error.message || 'Failed to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-10">
            <PageHeader title="Profile Settings" />

            <div className="grid gap-8 max-w-4xl mx-auto">

                {/* User Information */}
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/30 backdrop-blur-xl shadow-[0_0_30px_-10px_rgba(34,211,238,0.4)] p-6">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-6 tracking-wide">
                        User Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Username */}
                        <div>
                            <label className="text-sm text-cyan-400">Username</label>
                            <div className="mt-2 flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-black/40 px-4 py-3">
                                <User className="text-cyan-400" size={18} />
                                <p className="text-cyan-100 font-medium truncate">
                                    {username}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm text-cyan-400">Email Address</label>
                            <div className="mt-2 flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-black/40 px-4 py-3">
                                <Mail className="text-cyan-400" size={18} />
                                <p className="text-cyan-100 font-medium truncate">
                                    {email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/30 backdrop-blur-xl shadow-[0_0_30px_-10px_rgba(34,211,238,0.4)] p-6">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-6 tracking-wide">
                        Change Password
                    </h3>

                    <form onSubmit={handleChangePassword} className="space-y-5">
                        {[
                            {
                                label: "Current Password",
                                value: currentPassword,
                                setValue: setCurrentPassword
                            },
                            {
                                label: "New Password",
                                value: newPassword,
                                setValue: setNewPassword
                            },
                            {
                                label: "Confirm New Password",
                                value: confirmNewPassword,
                                setValue: setConfirmNewPassword
                            }
                        ].map((field, idx) => (
                            <div key={idx}>
                                <label className="text-sm text-cyan-400">
                                    {field.label}
                                </label>
                                <div className="mt-2 flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-black/40 px-4 py-3 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-400/30 transition">
                                    <Lock className="text-cyan-400" size={18} />
                                    <input
                                        type="password"
                                        value={field.value}
                                        onChange={(e) => field.setValue(e.target.value)}
                                        required
                                        className="w-full bg-transparent text-cyan-100 placeholder-cyan-500 outline-none"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-6 flex justify-end">
                        <Button
                            type="submit"
                            disabled={passwordLoading}
                            className="
                                relative overflow-hidden
                                rounded-xl px-8 py-3
                                font-semibold tracking-wide
                                text-cyan-100
                                bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-500/20
                                border border-cyan-400/40
                                shadow-[0_0_25px_-5px_rgba(34,211,238,0.6)]
                                hover:shadow-[0_0_35px_-5px_rgba(34,211,238,0.9)]
                                hover:border-cyan-300
                                hover:text-white
                                transition-all duration-300
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {/* Glow sweep */}
                            <span className="
                                pointer-events-none absolute inset-0
                                bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent
                                translate-x-[-100%] hover:translate-x-[100%]
                                transition-transform duration-700
                            " />
                            
                            <span className="relative z-10">
                                {passwordLoading ? "Changing..." : "Change Password"}
                            </span>
                        </Button>
                    </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
