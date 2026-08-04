import { Bell, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function Header() {

    const [darkMode, setDarkMode] = useState(false);



    const toggleTheme = () => {

        document.documentElement.classList.toggle("dark");

        setDarkMode(!darkMode);

    };



    return (

        <header

            className="
            fixed
            left-0
            right-0
            top-0
            z-20
            flex
            h-20
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-4
            md:px-8
            dark:border-slate-800
            dark:bg-slate-950
            lg:left-72
            "

        >



            {/* Search */}

            <div className="
            flex
            items-center
            gap-4
            ">


                <div className="
                relative
                hidden
                md:block
                ">


                    <Search

                        className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        "

                        size={18}

                    />



                    <Input

                        placeholder="Išči..."

                        className="
                        w-80
                        pl-10
                        "

                    />


                </div>


            </div>






            {/* Right side */}


            <div className="
            flex
            items-center
            gap-2
            md:gap-3
            ">



                {/* Theme */}


                <Button

                    variant="ghost"

                    size="icon"

                    onClick={toggleTheme}

                >

                    {darkMode

                        ?

                        <Sun size={18}/>

                        :

                        <Moon size={18}/>

                    }


                </Button>







                {/* Notifications */}


                <Button

                    variant="ghost"

                    size="icon"

                >

                    <Bell size={18}/>


                </Button>







                {/* Profile */}


                <Avatar>

                    <AvatarFallback>

                        TS

                    </AvatarFallback>


                </Avatar>



            </div>



        </header>


    );

}