import { motion } from "framer-motion";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    PawPrint,
    User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { registerUser } from "@/api/api";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signupSchema = z
    .object({
        ime: z.string().min(2, "First name is required"),
        priimek: z.string().min(2, "Last name is required"),
        email: z.string().email("Invalid email"),
        geslo: z.string().min(6, "Password must contain at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.geslo === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function Signup() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data) => {
        try {
            await registerUser({
                ime: data.ime,
                priimek: data.priimek,
                email: data.email,
                geslo: data.geslo,
            });

            toast.success("Account created successfully!");

            navigate("/login");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Registration failed."
            );
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#030712]">
            <div className="absolute inset-0">
                <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-[-180px] right-[-120px] h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
            </div>

            <div className="relative z-10 flex min-h-screen">
                {/* Left */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex w-full items-center justify-center p-8 lg:w-1/2"
                >
                    <Card className="w-full max-w-md border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600">
                                <PawPrint className="h-8 w-8 text-white" />
                            </div>

                            <h1 className="text-3xl font-bold text-white">
                                PetCare
                            </h1>

                            <p className="mt-3 text-slate-400">
                                Create your account
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            <div>
                                <Label className="mb-2 text-slate-300">
                                    First name
                                </Label>

                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                                    <Input
                                        {...register("ime")}
                                        placeholder="John"
                                        className="pl-10"
                                    />
                                </div>

                                {errors.ime && (
                                    <p className="mt-0.5 text-xs text-red-400">
                                        {errors.ime.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2 text-slate-300">
                                    Last name
                                </Label>

                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                                    <Input
                                        {...register("priimek")}
                                        placeholder="Doe"
                                        className="pl-10"
                                    />
                                </div>

                                {errors.priimek && (
                                    <p className="mt-0.5 text-xs text-red-400">
                                        {errors.priimek.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2 text-slate-300">
                                    Email
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                                    <Input
                                        {...register("email")}
                                        placeholder="you@example.com"
                                        className="pl-10"
                                    />
                                </div>

                                {errors.email && (
                                    <p className="mt-0.5 text-xs text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label className="mb-2 text-slate-300">
                                    Password
                                </Label>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                                    <Input
                                        {...register("geslo")}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-12"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {errors.geslo && (
                                    <p className="mt-0.5 text-xs text-red-400">
                                        {errors.geslo.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2 text-slate-300">
                                    Confirm password
                                </Label>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                                    <Input
                                        {...register("confirmPassword")}
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-12"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                                    >
                                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {errors.confirmPassword && (
                                    <p className="mt-0.5 text-xs text-red-400">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-9 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
                            >
                                {isSubmitting ? (
                                    "Creating account..."
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={18} className="ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="my-6 flex items-center">
                            <div className="h-px flex-1 bg-white/10" />

                            <span className="mx-4 text-xs uppercase tracking-[0.3em] text-slate-500">
                                OR
                            </span>

                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <p className="text-center text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
                            >
                                Sign In
                            </Link>
                        </p>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative hidden overflow-hidden lg:flex lg:w-1/2 items-center justify-center"
                >
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-blue-700/10 to-violet-700/10" />

                    <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

                    <div className="relative z-10 max-w-2xl px-12">



                        <h2 className="text-[52px] font-black leading-[1.05] text-white">
                            Everything your pet needs.
                        </h2>

                        <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
                            Manage your pets, medications, reminders, meals and health history
                            from one beautiful dashboard designed for modern pet owners.
                        </p>


                        <div className="mt-8 grid gap-4">

                            <div className="group rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-3 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <span className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                                            HEALTH
                                        </span>

                                        <h3 className="mt-2 text-xl font-bold text-white">
                                            Medication Reminder
                                        </h3>

                                        <p className="mt-2 text-slate-300">
                                            Bella needs her vaccination in
                                            <span className="font-semibold text-cyan-300"> 2 days.</span>
                                        </p>

                                    </div>

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-3xl">
                                        💊
                                    </div>

                                </div>

                            </div>

                            <div className="group rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-yellow-400">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <span className="text-xs uppercase tracking-[0.35em] text-yellow-300">
                                            WEATHER
                                        </span>

                                        <h3 className="mt-2 text-xl font-bold text-white">
                                            Perfect Walking Day
                                        </h3>

                                        <p className="mt-2 text-slate-300">
                                            Sunny weather with
                                            <span className="font-semibold text-yellow-300">
                                                {" "}22°C
                                            </span>
                                            {" "}and light wind.
                                        </p>

                                    </div>

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/20 text-3xl">
                                        ☀️
                                    </div>

                                </div>

                            </div>

                            <div className="group rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-3 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <span className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                                            CLOUD
                                        </span>

                                        <h3 className="mt-2 text-xl font-bold text-white">
                                            Secure Sync
                                        </h3>

                                        <p className="mt-2 text-slate-300">
                                            Every record is automatically backed up
                                            to the cloud.
                                        </p>

                                    </div>

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl">
                                        ☁️
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="mt-6">

                            <div className="grid grid-cols-3 gap-5">

                                <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-transparent p-5 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400">

                                    <h3 className="text-4xl font-black text-cyan-300">
                                        2.5K+
                                    </h3>

                                    <p className="mt-3 text-sm uppercase tracking-[0.3em] text-slate-400">
                                        Happy Pets
                                    </p>

                                </div>

                                <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent p-5 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400">

                                    <h3 className="text-4xl font-black text-violet-300">
                                        1K+
                                    </h3>

                                    <p className="mt-3 text-sm uppercase tracking-[0.3em] text-slate-400">
                                        Owners
                                    </p>

                                </div>

                                <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent p-5 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400">

                                    <h3 className="text-4xl font-black text-emerald-300">
                                        99.9%
                                    </h3>

                                    <p className="mt-3 text-sm uppercase tracking-[0.3em] text-slate-400">
                                        Uptime
                                    </p>

                                </div>

                            </div>


                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}