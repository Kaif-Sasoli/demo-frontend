import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    listenForNotifications,
} from "./services/foregroundNotification.service";

import { logoutUser } from "./services/auth.service";
import api from "./services/api";


function Home() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);


    useEffect(() => {

        // Get logged-in user
        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            setUser(
                JSON.parse(storedUser)
            );
        }


        // Listen for FCM notifications
        const unsubscribe =
            listenForNotifications((payload) => {

                console.log(
                    "Received notification:",
                    payload
                );

                const title =
                    payload.notification?.title ||
                    "Kisan AI";

                const message =
                    payload.notification?.body ||
                    "New notification";

                window.alert(
                    `${title}\n\n${message}`
                );
            });


        return () => {
            unsubscribe();
        };

    }, []);


    // ============================
    // Logout
    // ============================

    const handleLogout = async () => {

        try {

            setLoggingOut(true);

            const res = await logoutUser();
            console.log("rEs: ", res)

            if (res) {
                // Remove user from localStorage
                localStorage.removeItem("user");

                // Go to login page
                navigate("/login");
            }

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        } finally {

            setLoggingOut(false);
        }
    };

    const testFields = async () => {

        try {

            const response = await api.get("/field/fields");

            console.log(
                "Fields:",
                response.data
            );

            alert("Fields API successful!");

        } catch (error) {

            console.error(
                "Fields error:",
                error.response?.data
            );
        }
    };


    return (
        <div className="min-h-screen p-10">

            <h1 className="text-3xl font-bold">
                Welcome to Kisan AI
            </h1>


            {user && (

                <div className="mt-6 rounded-lg border p-5">

                    <h2 className="text-xl font-semibold">
                        User Details
                    </h2>

                    <p>
                        <strong>Username:</strong>{" "}
                        {user.username}
                    </p>

                    <p>
                        <strong>Full Name:</strong>{" "}
                        {user.fullName}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {user.email}
                    </p>

                </div>
            )}


            <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-5 rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
            >

                {loggingOut
                    ? "Logging out..."
                    : "Logout"
                }

            </button>
            <button
                onClick={testFields}
                className="mt-5 rounded bg-green-600 px-4 py-2 text-white"
            >
                Get Fields
            </button>

        </div>
    );
}

export default Home;