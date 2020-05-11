import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    getByName(name) {
        return axios
            .get(CONSTANTS.SERVER_URL + '/car-layout/name/' + name)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    throwServerError(err) {
        if (err.response) {
            throw err;
        }

        err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
        throw err;
    },

    getPngNameFromElementType(elementType) {

        switch (elementType) {
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                return 'seat-left.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                return 'seat-right.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                return 'seat-up.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                return 'seat-down.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT:
                return 'reserved-seat-left.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT:
                return 'reserved-seat-right.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP:
                return 'reserved-seat-up.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN:
                return 'reserved-seat-down.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT:
                return 'selected-seat-left.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT:
                return 'selected-seat-right.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP:
                return 'selected-seat-up.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN:
                return 'selected-seat-down.png';
            case CONSTANTS.LAYOUT.ELEMENTS.LUGGAGE_RACK:
                return 'luggage-rack.png';
            case CONSTANTS.LAYOUT.ELEMENTS.TABLE:
                return 'table.png';
            case CONSTANTS.LAYOUT.ELEMENTS.WALL:
                return 'wall.png';
            default:
                console.error('No image found for: ' + elementType);
                return 'no-existing-png-for-this-type';
        }
    },

    transformFromMongo2FrontendModel(carLayoutDb) {
        let carLayoutFrontend = {};

        carLayoutFrontend.name = carLayoutDb.name;
        carLayoutFrontend.seatingCapacity = carLayoutDb.seatingCapacity;
        carLayoutFrontend.width = carLayoutDb.width;
        carLayoutFrontend.height = carLayoutDb.height;
        carLayoutFrontend.cellSize = carLayoutDb.cellSize;
        carLayoutFrontend.lastElementId = carLayoutDb.lastElementId;

        carLayoutFrontend.gridLayout = [];
        for (let element of carLayoutDb.elements) {
            carLayoutFrontend.gridLayout.push(JSON.parse(JSON.stringify(element)));
        }

        carLayoutFrontend.sheetWidth =  carLayoutDb.cellSize * carLayoutDb.width + CONSTANTS.LAYOUT.GRID_MARGIN *
            (carLayoutDb.width - 1) + 2 * 4 * 5;

        carLayoutFrontend.sheetHeight =  carLayoutDb.cellSize * carLayoutDb.height + CONSTANTS.LAYOUT.GRID_MARGIN *
            (carLayoutDb.height - 1) + 2 * 4 * 5;

        return carLayoutFrontend;
    },

    /**
     * Rotate a car layout if the given layout is made for big screens
     *
     * rotate(LongLayout) => TallLayout
     * rotate(TallLayout) => TallLayout
     */
    rotateCarLayout(carLayout) {
        if (typeof carLayout !== 'object') {
            console.error('Car Layout to be rotated is not an object!');
            return { };
        }

        if (!Object.keys(carLayout).length) {
            return { };
        }

        if (carLayout.width <= carLayout.height) {
            // car layout is already rotated for small screens, so do not rotate it again!
            return carLayout;
        }

        let rotatedCarLayout = {
            name: carLayout.name,
            seatingCapacity: carLayout.seatingCapacity,
            width: carLayout.height,
            height: carLayout.width,
            cellSize: carLayout.cellSize,
            lastElementId: carLayout.lastElementId,
            sheetWidth: carLayout.cellSize * carLayout.height + CONSTANTS.LAYOUT.GRID_MARGIN *
                (carLayout.height - 1) + 2 * 4 * 5,
            sheetHeight: carLayout.cellSize * carLayout.width + CONSTANTS.LAYOUT.GRID_MARGIN *
                (carLayout.width - 1) + 2 * 4 * 5
        };

        rotatedCarLayout.gridLayout = [];
        for (let element of carLayout.gridLayout) {
            let newElement = {
                i: element.i,
                x: carLayout.height - element.h - element.y,
                y: element.x,
                w: element.h,
                h: element.w,
                type: element.type
            };

            if (element.seatNumber) {
                newElement.seatNumber = element.seatNumber;

                switch (element.type) {
                    case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT;
                        break;
                    default:
                        console.error('Unknown type for an element having a seat number!');
                }
            }

            rotatedCarLayout.gridLayout.push(newElement);
        }

        return rotatedCarLayout;
    },

    /**
     *
     * @param car
     * @param departureStation {RouteStation}
     * @param arrivalStation {RouteStation}
     * @param ownSelectedSeats {array}
     */
    fillCarLayoutWithReservedSeats(car, departureStation, arrivalStation, ownSelectedSeats) {

        const reqDep = departureStation.orderNo;    // required (wished) departure Station number
        const reqArr = arrivalStation.orderNo;    // required (wished) departure Station number

        for (let seat of car.seats) {

            if (!seat.reservations.length && !seat.selected) {
                continue;
            }

            if (seat.selected && ownSelectedSeats.every(s => s._id !== seat._id)) {
                // found a seat which is not selected by the one doing the order on this client
                this.changeSeatAppearance(car, seat);
                continue;
            }

            let conflictsWithOurRide = false;

            for (let ticket of seat.reservations) {

                const busyDep = ticket.departureStation.orderNo;
                const busyArr = ticket.arrivalStation.orderNo;

                if ((reqDep < busyDep && reqArr > busyDep) ||
                    reqDep === busyDep ||
                    (reqDep > busyDep && reqDep < busyArr)
                ) {
                    conflictsWithOurRide = true;
                    break;
                }
            }

            if (!conflictsWithOurRide) {
                continue;
            }

            this.changeSeatAppearance(car, seat);
        }

        return car.carLayout;
    },

    getCorrespondingReservedSeatAppearance(initialType) {

        switch (initialType) {
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN;
        }
    },

    changeSeatAppearance(car, seat) {

        // search for seat in car layout
        const index = car.carLayout.gridLayout.findIndex( elem => {
            return elem.seatNumber === seat.number;
        });

        car.carLayout.gridLayout[index].type = this.getCorrespondingReservedSeatAppearance(car.carLayout.gridLayout[index].type);
    },

    getSelectedSeatTypeFromUnselected(elementType) {

        switch (elementType) {
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                return CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                return CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                return CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                return CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN;

            default:
                console.error('This is not an unselected seat!');
                return null;
        }
    },

    getUnselectedSeatTypeFromSelected(elementType) {

        switch (elementType) {
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT:
                return CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT;

            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT:
                return CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT;

            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP:
                return CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP;

            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN:
                return CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN;

            default:
                console.error('This is not a selected seat!');
                return null;
        }
    }
}