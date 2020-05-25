import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    placeOrder(orderDetails) {

        return axios
            .post(CONSTANTS.SERVER_URL + '/order', orderDetails)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    getOrdersForUser(userId) {

        return axios
            .get(CONSTANTS.SERVER_URL + '/order/user/' + userId)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    throwServerError(err) {
        if (err.response) {
            throw err;
        }

        err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
        throw err;
    }
}