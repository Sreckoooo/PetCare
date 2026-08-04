import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getPets,
    getPetZdravila,
    getObroki,
    getOpomniki,
} from "@/api/api";

import {
    Activity,
    Bell,
    CalendarDays,
    Dog,
    HeartPulse,
    Utensils,
} from "lucide-react";

export default function Dashboard() {

    const { user, token } = useAuth();

    const [petsCount, setPetsCount] = useState(0);
    const [treatmentsCount, setTreatmentsCount] = useState(0);
    const [mealsCount, setMealsCount] = useState(0);
    const [remindersCount, setRemindersCount] = useState(0);


    useEffect(() => {

        const loadDashboard = async () => {
            try {

                const pets = await getPets(token);
                const treatments = await getPetZdravila(token);
                const meals = await getObroki(token);
                const reminders = await getOpomniki(token);

                setPetsCount(pets.length);
                setTreatmentsCount(treatments.length);
                setMealsCount(meals.length);
                setRemindersCount(reminders.length);

            } catch (error) {
                console.error(
                    "Dashboard loading error:",
                    error
                );
            }
        };


        if (token) {
            loadDashboard();
        }

    }, [token]);
    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    Good evening, {user?.ime || "there"} 👋
                </h1>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Here's what's happening with your pets today.
                </p>
            </div>


            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">


                {/* My Pets */}
                <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex items-center justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                            <Dog size={24} />
                        </div>

                        <span className="text-sm text-slate-400">
                            Pets
                        </span>

                    </div>


                    <h2 className="mt-5 text-4xl font-black text-slate-900 dark:text-white">
                        {petsCount}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Total pets
                    </p>

                </div>



                {/* Treatments */}
                <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex items-center justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
                            <HeartPulse size={24} />
                        </div>

                        <span className="text-sm text-slate-400">
                            Health
                        </span>

                    </div>


                    <h2 className="mt-5 text-4xl font-black text-slate-900 dark:text-white">
                        {treatmentsCount}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Active treatments
                    </p>

                </div>



                {/* Meals */}
                <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex items-center justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                            <Utensils size={24} />
                        </div>

                        <span className="text-sm text-slate-400">
                            Food
                        </span>

                    </div>


                    <h2 className="mt-5 text-4xl font-black text-slate-900 dark:text-white">
                        {mealsCount}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Today's meals
                    </p>

                </div>



                {/* Reminders */}
                <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex items-center justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <Bell size={24} />
                        </div>

                        <span className="text-sm text-slate-400">
                            Today
                        </span>

                    </div>


                    <h2 className="mt-5 text-4xl font-black text-slate-900 dark:text-white">
                        {remindersCount}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Upcoming reminders
                    </p>

                </div>


            </div>


            {/* Main Dashboard Content */}

            <div className="grid gap-6 xl:grid-cols-3">


                {/* Calendar */}

                <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Calendar
                        </h2>

                        <CalendarDays
                            className="text-cyan-500"
                            size={26}
                        />

                    </div>


                    <div className="flex h-[420px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">

                        <div className="text-center">

                            <CalendarDays
                                className="mx-auto mb-4 text-slate-400"
                                size={48}
                            />

                            <p className="text-slate-500">
                                Calendar will be here
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Reminders, meals, activities and exams
                            </p>

                        </div>

                    </div>

                </div>



                {/* Right Side */}

                <div className="space-y-6">


                    {/* Today's Reminders */}

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                        <div className="mb-5 flex items-center justify-between">

                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Today's Reminders
                            </h2>

                            <Bell
                                className="text-emerald-500"
                                size={22}
                            />

                        </div>


                        <div className="space-y-4">

                            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">

                                <p className="font-semibold text-slate-900 dark:text-white">
                                    No reminders
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Everything is up to date
                                </p>

                            </div>

                        </div>

                    </div>



                    {/* Weather */}

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">


                        <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
                            Weather
                        </h2>


                        <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-5">

                            <p className="text-5xl font-black text-slate-900 dark:text-white">
                                22°C
                            </p>

                            <p className="mt-2 text-slate-500">
                                Ptuj, Slovenia
                            </p>

                            <p className="mt-4 text-sm text-slate-500">
                                Perfect day for a walk 🐾
                            </p>

                        </div>


                    </div>


                </div>


            </div>



            {/* Recent Activity */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">


                <div className="mb-6 flex items-center gap-3">

                    <Activity
                        className="text-cyan-500"
                        size={24}
                    />

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Recent Activity
                    </h2>

                </div>



                <div className="space-y-4">


                    <div className="flex items-center gap-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">

                        <Dog className="text-cyan-500" />

                        <div>

                            <p className="font-semibold text-slate-900 dark:text-white">
                                No activity yet
                            </p>

                            <p className="text-sm text-slate-500">
                                Your pet activities will appear here
                            </p>

                        </div>

                    </div>


                </div>


            </div>


        </div>
    );
}
