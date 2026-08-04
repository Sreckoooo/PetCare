import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    PawPrint,
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowRight,
    Heart,
    CloudSun,
    ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/api/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
    email: z.string().email("Please enter a valid email."),
    geslo: z.string().min(6, "Password must be at least 6 characters."),
});

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values) => {
        try {
            setLoading(true);

            const data = await loginUser(values);

            login(data);

            toast.success("Welcome back!");

            navigate("/dashboard");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950">

            <div className="absolute inset-0">

                <div className="absolute left-[-150px] top-[-150px] h-96 w-96 rounded-full bg-cyan-500/20 blur-[130px]" />

                <div className="absolute right-[-180px] top-[120px] h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[160px]" />

                <div className="absolute bottom-[-180px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[170px]" />

            </div>

            <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center px-8 py-12"
                >

                    <Card className="w-full max-w-md border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl">

                        <CardContent className="p-10">

                            <div className="mb-10 flex flex-col items-center">

                                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl">

                                    <PawPrint
                                        className="text-white"
                                        size={34}
                                    />

                                </div>

                                <h1 className="text-4xl font-bold text-white">
                                    PetCare
                                </h1>

                                <p className="mt-3 text-center text-slate-300">
                                    Smart Pet Management Platform
                                </p>

                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >

                                <div>

                                    <Label className="mb-2 block text-slate-200">
                                        Email
                                    </Label>

                                    <div className="relative">

                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <Input
                                            {...register("email")}
                                            type="email"
                                            placeholder="you@example.com"
                                            className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-500"
                                        />

                                    </div>

                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.email.message}
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <Label className="mb-2 block text-slate-200">
                                        Password
                                    </Label>

                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <Input
                                            {...register("geslo")}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="h-12 border-white/10 bg-white/5 pl-11 pr-11 text-white placeholder:text-slate-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>

                                    </div>

                                    {errors.geslo && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.geslo.message}
                                        </p>
                                    )}

                                </div>

                                <div className="flex items-center justify-between">

                                    <label className="flex items-center gap-2 text-sm text-slate-300">

                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-white/20 bg-transparent"
                                        />

                                        Remember me

                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-cyan-400 hover:text-cyan-300"
                                    >
                                        Forgot password?
                                    </Link>

                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-12 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:from-cyan-400 hover:to-indigo-500"
                                >
                                    {loading ? (
                                        "Signing In..."
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight
                                                size={18}
                                                className="ml-2"
                                            />
                                        </>
                                    )}
                                </Button>

                            </form>

                            <div className="my-8 flex items-center">

                                <div className="h-px flex-1 bg-white/10" />

                                <span className="mx-4 text-xs uppercase tracking-[0.3em] text-slate-500">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-white/10" />

                            </div>

                            <p className="text-center text-sm text-slate-400">

                                Don't have an account?{" "}

                                <Link
                                    to="/signup"
                                    className="font-semibold text-cyan-400 transition hover:text-cyan-300"
                                >
                                    Create one
                                </Link>

                            </p>

                        </CardContent>

                    </Card>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative hidden items-center justify-center overflow-hidden lg:flex"
                >

                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-600/10" />

                    <div className="relative z-10 max-w-lg space-y-6">

                        <div>

                            <h2 className="text-5xl font-bold leading-tight text-white">
                                Care for your pets,
                                <br />
                                smarter than ever.
                            </h2>

                            <p className="mt-6 text-lg leading-8 text-slate-300">
                                Manage meals, medications, reminders, treatments and activities
                                from one beautiful dashboard.
                            </p>

                        </div>

                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 5,
                            }}
                            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                        >

                            <div className="flex items-center gap-4">

                                <Heart
                                    className="text-red-400"
                                    size={30}
                                />

                                <div>

                                    <h3 className="text-lg font-semibold text-white">
                                        Health Tracking
                                    </h3>

                                    <p className="text-slate-400">
                                        Monitor treatments and medications.
                                    </p>

                                </div>

                            </div>

                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 12, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 6,
                            }}
                            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                        >

                            <div className="flex items-center gap-4">

                                <CloudSun
                                    className="text-yellow-400"
                                    size={30}
                                />

                                <div>

                                    <h3 className="text-lg font-semibold text-white">
                                        Weather Integration
                                    </h3>

                                    <p className="text-slate-400">
                                        Plan walks with live weather updates.
                                    </p>

                                </div>

                            </div>

                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4.5,
                            }}
                            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                        >

                            <div className="flex items-center gap-4">

                                <ShieldCheck
                                    className="text-emerald-400"
                                    size={30}
                                />

                                <div>

                                    <h3 className="text-lg font-semibold text-white">
                                        Secure Cloud Storage
                                    </h3>

                                    <p className="text-slate-400">
                                        Your pets' information is always safe.
                                    </p>

                                </div>

                            </div>

                        </motion.div>

                    </div>

                </motion.div>

            </div>

        </div>
    );
}