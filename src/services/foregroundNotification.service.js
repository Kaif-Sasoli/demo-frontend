import { onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";

export const listenForNotifications = (
    onNotification
) => {
    return onMessage(
        messaging,
        (payload) => {
            console.log(
                "Foreground notification:",
                payload
            );

            onNotification(payload);
        }
    );
};