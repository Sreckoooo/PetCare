import {
    Activity,
    Bell,
    Dog,
    Home,
    LogOut,
    Menu,
    PawPrint,
    Pill,
    Salad,
    ShieldPlus,
    Stethoscope,
    User,
    X,
} from "lucide-react";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";


import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";



const navigation = [
    {
        title: "Dashboard",
        icon: Home,
        path: "/dashboard",
    },
    {
        title: "My Pets",
        icon: Dog,
        path: "/pets",
    },
    {
        title: "Meals",
        icon: Salad,
        path: "/meals",
    },
    {
        title: "Activities",
        icon: Activity,
        path: "/activities",
    },
    {
        title: "Medications",
        icon: Pill,
        path: "/medications",
    },
    {
        title: "Treatments",
        icon: ShieldPlus,
        path: "/treatments",
    },
    {
        title: "Exams",
        icon: Stethoscope,
        path: "/exams",
    },
    {
        title: "Reminders",
        icon: Bell,
        path: "/reminders",
    },
];



export default function Sidebar() {


    const { logout } = useAuth();

    const navigate = useNavigate();


    const [open, setOpen] = useState(false);





    const handleLogout = () => {

        logout();

        navigate("/login", {
            replace: true,
        });

    };






    return (

        <>


            {/* Mobile menu button */}

            <button

                onClick={() => setOpen(true)}

                className="
                fixed
                left-4
                top-4
                z-[60]
                rounded-xl
                bg-slate-900
                p-3
                text-white
                shadow-lg
                lg:hidden
                "

            >

                <Menu size={22} />


            </button>








            {/* Overlay */}


            {open && (

                <div

                    onClick={() => setOpen(false)}

                    className="
                        fixed
                        inset-0
                        z-[60]
                        bg-black/40
                        lg:hidden
                        "

                />

            )}











            <aside

                className={`
                fixed
                left-0
                top-0
                z-[70]
                flex
                h-screen
                w-72
                flex-col
                border-r
                border-slate-200
                bg-white
                transition-transform
                duration-300
                dark:border-slate-800
                dark:bg-slate-950

                ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

                lg:translate-x-0
                `}

            >





                {/* Mobile close */}

                <div className="
                flex
                justify-end
                p-4
                lg:hidden
                ">


                    <button

                        onClick={() => setOpen(false)}

                        className="
                        rounded-xl
                        p-2
                        text-slate-500
                        hover:bg-slate-100
                        dark:hover:bg-slate-800
                        "

                    >

                        <X size={22} />


                    </button>


                </div>









                {/* Logo */}


                <div className="
                flex
                items-center
                gap-3
                border-b
                border-slate-200
                px-6
                py-6
                dark:border-slate-800
                ">


                    <div className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-900
                    text-white
                    dark:bg-white
                    dark:text-slate-900
                    ">

                        <PawPrint size={24} />


                    </div>





                    <div>

                        <h1 className="
                        text-xl
                        font-bold
                        text-slate-900
                        dark:text-white
                        ">

                            PetCare

                        </h1>



                        <p className="
                        text-sm
                        text-slate-500
                        ">

                            PetCare 2.0

                        </p>


                    </div>



                </div>









                {/* Navigation */}


                <nav className="
                flex-1
                space-y-2
                overflow-y-auto
                p-4
                ">


                    {navigation.map((item) => {


                        const Icon = item.icon;


                        return (

                            <NavLink

                                key={item.path}

                                to={item.path}

                                onClick={() => setOpen(false)}

                                className={({ isActive }) =>
                                    `
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-200

                                    ${isActive
                                        ?
                                        "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                        :
                                        "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                    }
                                    `
                                }

                            >


                                <Icon size={20} />


                                {item.title}



                            </NavLink>


                        );


                    })}



                </nav>









                {/* Bottom */}


                <div className="
                border-t
                border-slate-200
                p-4
                dark:border-slate-800
                ">




                    <NavLink

                        to="/profile"

                        onClick={() => setOpen(false)}

                        className={({ isActive }) =>
                            `
                            mb-3
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium

                            ${isActive
                                ?
                                "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                :
                                "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            }
                            `
                        }

                    >

                        <User size={20} />

                        Profile


                    </NavLink>







                    <Button

                        variant="outline"

                        className="
                        w-full
                        justify-start
                        gap-3
                        "

                        onClick={handleLogout}

                    >

                        <LogOut size={18} />

                        Logout


                    </Button>



                </div>




            </aside>


        </>

    );

}