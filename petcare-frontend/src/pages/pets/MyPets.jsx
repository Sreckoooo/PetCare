import { useEffect, useState } from "react";

import {
    Plus,
    Dog,
    X,
    Upload,
    Pencil,
    Trash2,
    CalendarDays,
    Venus,
} from "lucide-react";


import {
    getPets,
    createPet,
    updatePet,
    deletePet,
} from "@/api/api";


import { useAuth } from "@/context/AuthContext";


import { Button } from "@/components/ui/button";

import { toast } from "sonner";





export default function MyPets() {


    const { token } = useAuth();



    const [pets, setPets] = useState([]);

    const [loading, setLoading] = useState(true);



    const [showModal, setShowModal] = useState(false);

    const [editingPet, setEditingPet] = useState(null);


    const [deletePetId, setDeletePetId] = useState(null);



    const [imagePreview, setImagePreview] = useState(null);

    const [showTypesModal, setShowTypesModal] = useState(false);

    const [activeCard, setActiveCard] = useState(0);

    const emptyForm = {

        ime: "",

        pasma: "",

        vrsta: "",

        drugaVrsta: "",

        datum_rojstva: "",

        spol: "",

        image: null,

    };




    const [petForm, setPetForm] = useState(emptyForm);






    const loadPets = async () => {


        try {


            const data = await getPets(token);


            setPets(data);



        } catch (error) {


            console.error(
                "Loading pets failed:",
                error
            );


            toast.error(
                "Failed to load pets."
            );



        } finally {


            setLoading(false);


        }


    };






    useEffect(() => {


        if (token) {


            loadPets();


        }


    }, [token]);



    useEffect(() => {

        const interval = setInterval(() => {

            setActiveCard((prev) =>
                (prev + 1) % 3
            );

        }, 4000);


        return () => clearInterval(interval);

    }, []);



    const calculateAge = (date) => {


        if (!date) return 0;



        const birthDate = new Date(date);

        const today = new Date();



        let age =
            today.getFullYear() -
            birthDate.getFullYear();



        const month =
            today.getMonth() -
            birthDate.getMonth();



        if (
            month < 0 ||
            (
                month === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {

            age--;

        }



        return age;


    };


    const getPetIcon = (type) => {

        switch (type) {

            case "Dog":
                return "🐶";

            case "Cat":
                return "🐱";

            case "Rabbit":
                return "🐰";

            case "Bird":
                return "🐦";

            case "Fish":
                return "🐟";

            default:
                return "🐾";

        }

    };

    const getPetBadgeColor = (type) => {

        switch (type) {

            case "Dog":
                return "bg-blue-500";

            case "Cat":
                return "bg-purple-500";

            case "Rabbit":
                return "bg-green-500";

            case "Bird":
                return "bg-yellow-500";

            case "Fish":
                return "bg-cyan-500";

            default:
                return "bg-slate-500";

        }

    };



    const petTypes = pets.reduce((acc, pet) => {


        acc[pet.vrsta] =
            (acc[pet.vrsta] || 0) + 1;


        return acc;


    }, {});

    const mostCommonPetType =
        Object.entries(petTypes)
            .sort((a, b) => b[1] - a[1])[0];






    const averageAge = pets.length
        ? Math.round(
            pets.reduce(
                (sum, pet) =>
                    sum + calculateAge(
                        pet.datum_rojstva
                    ),
                0
            ) / pets.length
        )
        : 0;







    const handleChange = (e) => {


        setPetForm({

            ...petForm,

            [e.target.name]:
                e.target.value,


        });


    };







    const handleImageChange = (e) => {


        const file =
            e.target.files[0];



        if (!file) return;



        setPetForm({

            ...petForm,

            image: file,


        });



        setImagePreview(
            URL.createObjectURL(file)
        );



    };







    const openAddModal = () => {


        setEditingPet(null);


        setPetForm(emptyForm);


        setImagePreview(null);



        setShowModal(true);



    };






    const openEditModal = (pet) => {


        setEditingPet(pet);



        setPetForm({

            ime: pet.ime,

            pasma: pet.pasma,

            vrsta: pet.vrsta,

            drugaVrsta: "",

            datum_rojstva:
                pet.datum_rojstva
                    ?.substring(0, 10),

            spol: pet.spol,

            image: null,


        });



        if (pet.image) {


            setImagePreview(
                `data:${pet.image.contentType};base64,${pet.image.data}`
            );


        } else {


            setImagePreview(null);


        }




        setShowModal(true);


    };
    const closeModal = () => {


        setShowModal(false);

        setEditingPet(null);

        setPetForm(emptyForm);

        setImagePreview(null);


    };







    const handleSavePet = async () => {


        if (
            !petForm.ime ||
            !petForm.pasma ||
            !petForm.vrsta ||
            !petForm.datum_rojstva ||
            !petForm.spol
        ) {


            toast.error(
                "Please fill in all required fields."
            );


            return;


        }






        try {


            const formData = new FormData();



            formData.append(
                "ime",
                petForm.ime
            );


            formData.append(
                "pasma",
                petForm.pasma
            );


            formData.append(
                "vrsta",
                petForm.vrsta === "Other"
                    ? petForm.drugaVrsta
                    : petForm.vrsta
            );


            formData.append(
                "datum_rojstva",
                petForm.datum_rojstva
            );


            formData.append(
                "spol",
                petForm.spol
            );





            if (petForm.image) {


                formData.append(
                    "image",
                    petForm.image
                );


            }








            if (editingPet) {


                await updatePet(
                    editingPet._id,
                    formData,
                    token
                );


                toast.success(
                    "Pet updated successfully."
                );



            } else {


                await createPet(
                    formData,
                    token
                );


                toast.success(
                    "Pet created successfully."
                );


            }






            closeModal();


            loadPets();





        } catch (error) {


            console.error(
                error
            );


            toast.error(
                "Something went wrong."
            );


        }


    };









    const handleDeletePet = async () => {


        try {


            await deletePet(
                deletePetId,
                token
            );



            toast.success(
                "Pet deleted successfully."
            );



            setDeletePetId(null);



            loadPets();



        } catch (error) {


            console.error(
                error
            );


            toast.error(
                "Failed to delete pet."
            );


        }


    };








    if (loading) {


        return (

            <div className="
            flex
            h-full
            items-center
            justify-center
            text-slate-500
            ">

                Loading pets...

            </div>

        );


    }








    return (

        <div className="
        min-h-screen
        bg-slate-50
        p-8
        dark:bg-slate-950
        ">





            {/* Header */}


            <div className="
                mb-8
                flex
                flex-col
                gap-6
                lg:flex-row
                lg:items-center
                lg:justify-between
                ">


                <div>


                    <div className="
                    flex
                    items-center
                    gap-3
                    ">


                        <h1 className="
                        text-3xl
                        lg:text-4xl
                        font-bold
                        text-slate-900
                        dark:text-white
                        ">

                            My Pets

                        </h1>



                        <span className="
                        rounded-full
                        bg-cyan-100
                        px-3
                        py-1
                        text-sm
                        text-cyan-700
                        ">

                            🐾

                        </span>



                    </div>





                    <p className="
                    mt-2
                    max-w-xl
                    text-slate-500
                    ">


                        Manage your companions and keep track of their health, meals and activities.


                    </p>


                </div>







                <Button

                    onClick={openAddModal}

                    className="
                    h-12
                    rounded-xl
                    bg-slate-900
                    px-6
                    text-white
                    shadow-lg
                    hover:bg-slate-800
                    w-full
                    lg:w-auto
                    "

                >

                    <Plus size={18} />

                    Add New Pet


                </Button>



            </div>
            {/* Overview Cards */}

            <div className="
    mb-8
    relative
    overflow-hidden
    ">

                <div
                    className="
                flex
                transition-transform
                duration-700
                ease-in-out
                md:grid
                md:grid-cols-3
                md:transform-none
                "
                    style={{
                        transform: window.innerWidth < 768
                            ? `translateX(-${activeCard * 100}%)`
                            : "none"
                    }}
                >


                    <div className="
                w-full
                min-w-full
                md:min-w-0
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
                ">


                        <p className="text-sm text-slate-500">
                            Total Pets
                        </p>


                        <h3 className="
                    mt-3
                    text-4xl
                    font-bold
                    text-slate-900
                    dark:text-white
                    ">

                            {pets.length}

                        </h3>


                    </div>







                    <div className="
                    w-full
                    min-w-full
                    md:min-w-0                   
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-slate-800
                    dark:bg-slate-900
                    ">


                        <p className="text-sm text-slate-500">
                            Pet Types
                        </p>



                        <div

                            onClick={() => setShowTypesModal(true)}

                            className="
                            mt-4
                            cursor-pointer
                            rounded-2xl
                            bg-slate-100
                            p-4
                            transition
                            hover:bg-slate-200
                            dark:bg-slate-800
                            dark:hover:bg-slate-700
                            "

                        >


                            {mostCommonPetType && (

                                <div className="
                                flex
                                items-center
                                gap-4
                                ">


                                    <span className="text-4xl">

                                        {getPetIcon(mostCommonPetType[0])}

                                    </span>



                                    <div>

                                        <p className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                        ">

                                            {mostCommonPetType[0]}

                                        </p>


                                        <p className="text-sm text-slate-500">

                                            {mostCommonPetType[1]} pets

                                        </p>


                                    </div>


                                </div>

                            )}



                            <p className="
                            mt-4
                            text-sm
                            font-semibold
                            text-cyan-600
                            ">

                                View all pet types →

                            </p>


                        </div>


                    </div>








                    <div className="
                w-full
                min-w-full
                md:min-w-0              
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
                ">


                        <p className="text-sm text-slate-500">
                            Average Age
                        </p>



                        <h3 className="
                    mt-3
                    text-3xl
                    font-bold
                    text-slate-900
                    dark:text-white
                    ">

                            {averageAge} years

                        </h3>


                    </div>


                </div>
            </div>








            {/* Pets Grid */}



            {pets.length === 0 ? (



                <div className="
                rounded-3xl
                border
                border-dashed
                border-slate-300
                bg-white
                p-12
                text-center
                dark:border-slate-700
                dark:bg-slate-900
                ">


                    <Dog
                        size={60}
                        className="
                        mx-auto
                        mb-5
                        text-cyan-500
                        "
                    />



                    <h2 className="
                    text-2xl
                    font-bold
                    text-slate-900
                    dark:text-white
                    ">

                        No pets yet

                    </h2>



                    <p className="mt-3 text-slate-500">

                        Add your first pet and start managing their health.

                    </p>



                </div>



            ) : (



                <div className="
                grid
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
                ">



                    {pets.map((pet) => (


                        <div
                            key={pet._id}
                            className="
                            overflow-hidden
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-xl
                            dark:border-slate-800
                            dark:bg-slate-900
                            "
                        >





                            <div className="
                            relative
                            flex
                            h-48
                            items-center
                            justify-center
                            bg-slate-100
                            dark:bg-slate-800
                            ">



                                {pet.image ? (


                                    <img

                                        src={
                                            `data:${pet.image.contentType};base64,${pet.image.data}`
                                        }

                                        alt={pet.ime}

                                        className="
                                        h-full
                                        w-full
                                        object-cover
                                        "

                                    />


                                ) : (


                                    <div className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-3
                                        ">


                                        <div className="
                                            flex
                                            h-24
                                            w-24
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-white
                                            text-6xl
                                            shadow-sm
                                            dark:bg-slate-900
                                            ">

                                            {getPetIcon(pet.vrsta)}

                                        </div>




                                        <span className="
                                            text-xs
                                            font-medium
                                            text-slate-400
                                            ">

                                            No photo added

                                        </span>


                                    </div>


                                )}






                                <span className={`
                                    absolute
                                    right-4
                                    top-4
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-white
                                    ${getPetBadgeColor(pet.vrsta)}
                                    `}>

                                    {pet.vrsta}

                                </span>



                            </div>








                            <div className="p-6">



                                <h3 className="
                                text-2xl
                                font-bold
                                text-slate-900
                                dark:text-white
                                ">

                                    {pet.ime}

                                </h3>






                                <div className="
                                mt-4
                                space-y-3
                                text-sm
                                text-slate-500
                                ">



                                    <p className="flex items-center gap-2">

                                        <Dog size={16} />


                                        <span className="font-semibold">
                                            Breed:
                                        </span>


                                        {pet.pasma}


                                    </p>






                                    <p className="flex items-center gap-2">

                                        <Venus size={16} />


                                        <span className="font-semibold">
                                            Gender:
                                        </span>


                                        {pet.spol}


                                    </p>







                                    <p className="flex items-center gap-2">


                                        <CalendarDays size={16} />



                                        <span className="font-semibold">
                                            Birthday:
                                        </span>



                                        {new Date(
                                            pet.datum_rojstva
                                        ).toLocaleDateString()}



                                    </p>





                                    <p className="
                                    font-semibold
                                    text-cyan-500
                                    ">

                                        {calculateAge(
                                            pet.datum_rojstva
                                        )} years old


                                    </p>



                                </div>
                                <div className="
                                mt-6
                                flex
                                gap-3
                                ">


                                    <Button

                                        variant="outline"

                                        className="
                                        flex-1
                                        gap-2
                                        rounded-xl
                                        "

                                        onClick={() => openEditModal(pet)}

                                    >

                                        <Pencil size={16} />

                                        Edit


                                    </Button>







                                    <Button

                                        variant="destructive"

                                        className="
                                        flex-1
                                        gap-2
                                        rounded-xl
                                        "

                                        onClick={() => setDeletePetId(pet._id)}

                                    >

                                        <Trash2 size={16} />

                                        Delete


                                    </Button>



                                </div>


                            </div>


                        </div>


                    ))}


                </div>


            )}










            {/* Add / Edit Modal */}


            {showModal && (


                <div className="
                fixed
                inset-0
                z-100
                flex
                items-center
                justify-center
                bg-black/50
                backdrop-blur-sm
                px-4
                ">


                    <div className="
                    max-h-[90vh]
                    w-full
                    max-w-xl
                    overflow-y-auto
                    rounded-3xl
                    bg-white
                    p-8
                    shadow-2xl
                    dark:bg-slate-900
                    ">





                        <div className="
                        mb-8
                        flex
                        items-center
                        justify-between
                        ">


                            <div>

                                <h2 className="
                                text-3xl
                                font-bold
                                text-slate-900
                                dark:text-white
                                ">

                                    {editingPet
                                        ? "Edit Pet"
                                        : "Add New Pet 🐾"}

                                </h2>


                                <p className="
                                mt-2
                                text-sm
                                text-slate-500
                                ">

                                    Tell us about your companion

                                </p>


                            </div>





                            <button
                                onClick={closeModal}
                                className="
                                rounded-full
                                p-2
                                text-slate-400
                                hover:bg-slate-100
                                hover:text-red-500
                                dark:hover:bg-slate-800
                                "
                            >

                                <X size={24} />

                            </button>


                        </div>







                        <div className="space-y-5">



                            <input

                                name="ime"

                                value={petForm.ime}

                                onChange={handleChange}

                                placeholder="Pet name"

                                className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                px-4
                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-white
                                "

                            />







                            <select

                                name="vrsta"

                                value={petForm.vrsta}

                                onChange={handleChange}

                                className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                px-4
                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-white
                                "

                            >

                                <option value="">
                                    Select type
                                </option>

                                <option value="Dog">
                                    🐶 Dog
                                </option>

                                <option value="Cat">
                                    🐱 Cat
                                </option>

                                <option value="Rabbit">
                                    🐰 Rabbit
                                </option>

                                <option value="Bird">
                                    🐦 Bird
                                </option>

                                <option value="Other">
                                    Other
                                </option>


                            </select>






                            {petForm.vrsta === "Other" && (

                                <input

                                    name="drugaVrsta"

                                    value={petForm.drugaVrsta}

                                    onChange={handleChange}

                                    placeholder="Enter pet type"

                                    className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    dark:border-slate-700
                                    dark:bg-slate-800
                                    dark:text-white
                                    "

                                />

                            )}







                            <input

                                name="pasma"

                                value={petForm.pasma}

                                onChange={handleChange}

                                placeholder="Breed"

                                className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                px-4
                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-white
                                "

                            />







                            <input

                                type="date"

                                name="datum_rojstva"

                                value={petForm.datum_rojstva}

                                onChange={handleChange}

                                max={new Date().toISOString().split("T")[0]}

                                className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    dark:border-slate-700
                                    dark:bg-slate-800
                                    dark:text-white
                                    "

                            />







                            <select

                                name="spol"

                                value={petForm.spol}

                                onChange={handleChange}

                                className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                px-4
                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-white
                                "

                            >

                                <option value="">
                                    Select gender
                                </option>

                                <option value="Male">
                                    ♂ Male
                                </option>

                                <option value="Female">
                                    ♀ Female
                                </option>


                            </select>
                            {/* Image Preview */}


                            {imagePreview && (

                                <div className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                dark:border-slate-700
                                ">

                                    <img

                                        src={imagePreview}

                                        alt="Preview"

                                        className="
                                        h-48
                                        w-full
                                        object-cover
                                        "

                                    />

                                </div>

                            )}







                            {/* Upload */}


                            <label className="
                            flex
                            cursor-pointer
                            flex-col
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            border-2
                            border-dashed
                            border-slate-300
                            p-8
                            text-slate-500
                            transition
                            hover:border-cyan-500
                            hover:bg-cyan-50
                            hover:text-cyan-600
                            dark:border-slate-700
                            dark:hover:bg-slate-800
                            ">


                                <Upload size={32} />



                                <span className="
                                font-semibold
                                ">

                                    Upload pet photo

                                </span>




                                <span className="
                                text-xs
                                ">

                                    JPG or PNG recommended

                                </span>





                                <input

                                    type="file"

                                    accept="image/*"

                                    onChange={handleImageChange}

                                    className="hidden"

                                />


                            </label>








                            {/* Save Button */}


                            <Button

                                onClick={handleSavePet}

                                className="
                                mt-4
                                h-12
                                w-full
                                rounded-xl
                                bg-gradient-to-r
                                from-cyan-500
                                to-blue-600
                                text-base
                                font-semibold
                                shadow-lg
                                hover:scale-[1.02]
                                "

                            >


                                {editingPet
                                    ? "Save Changes"
                                    : "Create Pet"}



                            </Button>




                        </div>


                    </div>


                </div>


            )}









            {/* Delete Modal */}


            {deletePetId && (


                <div className="
                fixed
                inset-0
                z-100
                flex
                items-center
                justify-center
                bg-black/50
                backdrop-blur-sm
                px-4
                ">


                    <div className="
                    w-full
                    max-w-md
                    rounded-3xl
                    bg-white
                    p-8
                    shadow-2xl
                    dark:bg-slate-900
                    ">


                        <h2 className="
                        text-2xl
                        font-bold
                        text-slate-900
                        dark:text-white
                        ">

                            Delete Pet

                        </h2>





                        <p className="
                        mt-3
                        text-slate-500
                        dark:text-slate-400
                        ">

                            Are you sure you want to delete this pet?
                            This action cannot be undone.

                        </p>






                        <div className="
                        mt-8
                        flex
                        gap-3
                        ">



                            <Button

                                variant="outline"

                                className="
                                flex-1
                                rounded-xl
                                "

                                onClick={() => setDeletePetId(null)}

                            >

                                Cancel


                            </Button>






                            <Button

                                variant="destructive"

                                className="
                                flex-1
                                rounded-xl
                                "

                                onClick={handleDeletePet}

                            >

                                Delete


                            </Button>




                        </div>



                    </div>


                </div>


            )}

            {showTypesModal && (

                <div className="
                    fixed
                    inset-0
                    z-100
                    flex
                    items-center
                    justify-center
                    bg-black/50
                    backdrop-blur-sm
                    px-4
                    ">


                    <div className="
        w-full
        max-w-md
        rounded-3xl
        bg-white
        p-8
        shadow-2xl
        dark:bg-slate-900
        ">



                        <div className="
            mb-6
            flex
            items-center
            justify-between
            ">


                            <h2 className="
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
                ">

                                Pet Types

                            </h2>



                            <button

                                onClick={() => setShowTypesModal(false)}

                                className="
                    rounded-full
                    p-2
                    text-slate-400
                    hover:bg-slate-100
                    "

                            >

                                <X size={22} />

                            </button>



                        </div>





                        <div className="space-y-3">


                            {Object.entries(petTypes)

                                .sort((a, b) => b[1] - a[1])

                                .map(([type, count]) => (


                                    <div

                                        key={type}

                                        className="
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        bg-slate-100
                        px-4
                        py-3
                        dark:bg-slate-800
                        "

                                    >


                                        <div className="
                        flex
                        items-center
                        gap-3
                        ">


                                            <span className="text-3xl">

                                                {getPetIcon(type)}

                                            </span>



                                            <span className="
                            font-semibold
                            text-slate-900
                            dark:text-white
                            ">

                                                {type}

                                            </span>


                                        </div>




                                        <span className="
                        rounded-full
                        bg-white
                        px-3
                        py-1
                        text-sm
                        font-bold
                        shadow-sm
                        dark:bg-slate-900
                        dark:text-white
                        ">

                                            {count}

                                        </span>



                                    </div>


                                ))}


                        </div>



                    </div>


                </div>

            )}


        </div>

    );


}