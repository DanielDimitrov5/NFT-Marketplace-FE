
import { message } from "antd";

export const infoMessage = (msg) => {
    message.info(msg);
};

export const successMessage = (msg) => {
    message.success(msg);
};

export const errorMessage = (msg) => {
    message.error(msg);
}
