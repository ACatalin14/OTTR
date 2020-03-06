import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    getCrudServiceForResource(entityUrlName) {
        return {
            index() {
                return axios
                    .get(CONSTANTS.SERVER_URL + '/' + entityUrlName + '/')
                    .then(response => response.data)
                    .catch(this.throwServerError);
            },

            show(entityId) {
                return axios
                    .get(CONSTANTS.SERVER_URL + '/' + entityUrlName + '/' + entityId)
                    .then(response => response.data)
                    .catch(this.throwServerError);
            },

            create(entity) {
                return axios
                    .post(CONSTANTS.SERVER_URL + '/' + entityUrlName + '/', entity)
                    .then(response => response.data)
                    .catch(this.throwServerError);
            },

            update(entity) {
                return axios
                    .put(CONSTANTS.SERVER_URL + '/' + entityUrlName + '/' + entity._id, entity)
                    .then(response => response.data)
                    .catch(this.throwServerError);
            },

            delete(entityId) {
                return axios
                    .delete(CONSTANTS.SERVER_URL + '/' + entityUrlName + '/' + entityId)
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
    }
}